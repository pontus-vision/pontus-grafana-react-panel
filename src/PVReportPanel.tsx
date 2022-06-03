import React from 'react';
import axios, { AxiosResponse } from 'axios';
import PontusComponent, { PubSubCallback } from './PontusComponent';
import { PVNamespaceProps } from './types';
import { Base64 } from 'js-base64';

// import PVDatamaps from './PVDatamaps';

export interface PVReportProps extends PVNamespaceProps {
  templateText: string;
}

export interface PVReportState extends PVReportProps {
  preview?: string;
  contextId?: string;
}

export class PVReportPanel extends PontusComponent<PVReportProps, PVReportState> {
  private h_request: any;

  constructor(props: Readonly<any>) {
    super(props);
    this.url = PontusComponent.getRestReportRenderURL(props);
    this.state = { ...this.props };
  }

  onClickNeighbour: PubSubCallback = (topic: string, obj: any) => {
    this.setState({ ...this.state, contextId: obj.id });
  };

  createSubscriptions = (props: Readonly<PVReportProps>) => {
    if (props.isNeighbour) {
      this.on(`${props.neighbourNamespace}-pvgrid-on-click-row`, this.onClickNeighbour);
    }
  };

  removeSubscriptions = (props: Readonly<PVReportProps>) => {
    if (props.isNeighbour) {
      this.off(`${props.neighbourNamespace}-pvgrid-on-click-row`, this.onClickNeighbour);
    }
  };
  componentDidMount = () => {
    this.createSubscriptions(this.props);
    this.ensureData(undefined, this.props.templateText);
  };

  // componentDidUpdate = (prevProps: Readonly<PVGridProps>, prevState: Readonly<PVGridState>, snapshot?: any): void => {
  //   this.removeSubscriptions(prevProps);
  //   this.createSubscriptions(this.props);
  // };

  componentWillUnmount = () => {
    this.removeSubscriptions(this.props);
  };

  ensureData = (contextId: any, templateText: string) => {
    if (this.req) {
      this.req.cancel();
    }

    let url = this.url;
    if (this.h_request !== null) {
      clearTimeout(this.h_request);
    }

    let self = this;

    this.h_request = setTimeout(() => {
      let CancelToken = axios.CancelToken;
      self.req = CancelToken.source();

      this.post(
        url,
        {
          refEntryId: contextId,
          reportTemplateBase64: templateText,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
          cancelToken: self.req.token,
        }
      )
        .then(this.onSuccess)
        .catch((thrown) => {
          if (axios.isCancel(thrown)) {
            console.log('Request canceled', thrown.message);
          } else {
            this.onError(thrown);
          }
        });
    }, 50);
  };
  onError = (err: Error) => {
    if (this.errorCounter > 5) {
      console.error('error loading data:' + err);
    } else {
      this.ensureData(this.state.contextId, '');
    }
    this.errorCounter++;
  };

  onSuccess = (resp: AxiosResponse<any>) => {
    this.errorCounter = 0;

    try {
      if (resp.status === 200) {
        const items = resp.data.base64Report;
        this.setState({
          ...this.state,
          preview: Base64.decode(items),
        });
      }
    } catch (e) {
      // e;
      this.setState({
        ...this.state,
        preview: `Error rendering template: ${e}`,
      });
    }
  };

  render() {
    return <div dangerouslySetInnerHTML={{ __html: this.state.preview || '' }} />;
  }
}

export default PVReportPanel;