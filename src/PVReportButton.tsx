import React from 'react';
import Axios, { AxiosResponse } from 'axios';
import { Button, Segment, Portal } from 'semantic-ui-react';
import { Base64 } from 'js-base64';
import PontusComponent from './PontusComponent';

// import PVDatamaps from './PVDatamaps';
export interface PVReportButtonProps {
  node: any;
  colDef: any;
  namespace?: string;
  subNamespace?: string;
  mountedSuccess?: boolean;
  customFilter?: string | undefined;
  settings?: any | undefined;
  url?: string | undefined;
  value?: any | undefined;
  multi?: boolean;
  options?: any;
  onError?: { (err: any): void };
  onChange?: { (val: any): void };
  name?: string;
  optionsRequest?: any;
  placeholder?: React.ReactNode;
  templateText?: string;
  contextId?: string;
  buttonLabel: string;
}

export interface PVReportButtonState extends PVReportButtonProps {
  open: boolean;
  preview: string;
}

class PVReportButton extends PontusComponent<PVReportButtonProps, PVReportButtonState> {
  constructor(props: Readonly<PVReportButtonProps>) {
    super(props);
    // this.columns = [
    //   {key: 'name', name: 'Name'},
    //   {key: 'street', name: 'Street'}
    // ];
    this.errorCounter = 0;

    this.url = PontusComponent.getGraphURL(this.props);
    // this.url = "/gateway/sandbox/pvgdpr_graph";

    this.state = {
      ...props,
      open: false,
      preview: '',
    };
  }

  onClick = () => {
    this.ensureData(this.props.contextId, this.props.templateText);
  };

  componentDidMount() {
    // super.componentDidMount();
    // this.props.glEventHub.on('NavPanelAwarenessPVGrid-pvgrid-on-click-row', this.onClickedPVGridAwarenessCampaign);

    this.setState({ open: false });
  }

  componentWillUnmount() {
    // this.props.glEventHub.off('NavPanelAwarenessPVGrid-pvgrid-on-click-row', this.onClickedPVGridAwarenessCampaign);
    // super.componentWillUnmount();
  }

  getQuery = (contextId: string, templateText: string) => {
    return {
      gremlin: 'renderReportInBase64(pg_id,pg_templateText)',
      bindings: {
        pg_id: contextId,
        pg_templateText: templateText,
      },
    };
  };

  ensureData = (contextId: string | undefined, templateText: string | undefined) => {
    if (!contextId || !templateText) {
      return;
    }

    if (this.req) {
      this.req.cancel();
    }

    const url = this.url;
    if (this.hRequest) {
      clearTimeout(this.hRequest);
    }

    const self = this;

    this.hRequest = setTimeout(() => {
      const CancelToken = Axios.CancelToken;
      self.req = CancelToken.source();

      Axios.post(url, self.getQuery(contextId, templateText), {
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        cancelToken: self.req.token,
      })
        .then(this.onSuccess)
        .catch(thrown => {
          if (Axios.isCancel(thrown)) {
            console.log('Request canceled', thrown.message);
          } else {
            this.onError(thrown);
          }
        });
    }, 50);
  };
  onError = (err: any) => {
    if (this.errorCounter > 5) {
      console.error('error loading data:' + err);
    } else {
      this.ensureData(this.props.contextId, this.props.templateText);
    }
    this.errorCounter++;
  };

  onSuccess = (resp: AxiosResponse<any>) => {
    this.errorCounter = 0;

    try {
      if (resp.status === 200) {
        // let items = resp.data.result.data['@value'][0]['@value'];
        const items = resp.data.result.data['@value'][0];

        this.setState({
          open: !this.state.open,
          preview: Base64.decode(items),
          // , value: Base64.encode(this.obj.getEditorContents())
        });
      }
    } catch (e) {
      // e;
    }
    /*
     var data = {
     labels: ['Red', 'Green', 'Yellow'],
     datasets: [{
     data: [300, 50, 100],
     backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
     hoverBackgroundColor: ['#FF6384', '#36A2EB', '#FFCE56']
     }]
     };
     */
    // this.onDataLoaded.notify({from: from, to: to});
  };

  handleClose = () => this.setState({ open: false });

  render() {
    return (
      <div>
        <Button className={'compact'} style={{ border: 0, background: 'rgb(254,250,250)', marginRight: '3px' }} size={'small'} onClick={this.onClick}>
          {this.props.buttonLabel}
        </Button>

        <Portal onClose={this.handleClose} open={this.state.open}>
          <Segment
            style={{
              height: '50%',
              width: '50%',
              overflowX: 'auto',
              overflowY: 'auto',
              left: '30%',
              position: 'fixed',
              top: '20%',
              zIndex: 100000,
              backgroundColor: 'rgba(250, 245, 245,0.75)',
              padding: '10px',
            }}
          >
            <div style={{ backgroundColor: 'rgba(250, 245, 245,0.75)' }} dangerouslySetInnerHTML={{ __html: this.state.preview }} />
          </Segment>
        </Portal>
      </div>
    );
  }
}

export default PVReportButton;
