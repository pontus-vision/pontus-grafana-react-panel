import React from 'react';
// import ResizeAware from 'react-resize-aware';
import PVGauge from './PVGauge';
import axios, { AxiosResponse } from 'axios';
import { Grid } from 'semantic-ui-react';
import { ic_multiline_chart } from 'react-icons-kit-allreact/md/ic_multiline_chart';
import { book_2 } from 'react-icons-kit-allreact/ikons/book_2';

import Icon from 'react-icons-kit-allreact';
import PontusComponent from './PontusComponent';

/***************************
 * UserList Component
 ***************************/

export interface PVGDPRScoreProps {
  type: string;
  longShow: boolean;
}

export interface PVGDPRScoreState extends PVGDPRScoreProps {
  scoreValue: number;
  scoreExplanation: string;
}

class PVGDPRScores extends PontusComponent<PVGDPRScoreProps, PVGDPRScoreState> {
  text: string;
  title: string;
  icon: Icon;
  weight: number;
  errCounter: number;
  latestStatus: number;
  iconMap: Record<string, Icon> = {
    Awareness: new Icon(book_2),
  };
  scoreIcon: Icon;
  weightMap: Record<string, number> = {
    Awareness: 1,
  };
  h_request?: NodeJS.Timeout;

  constructor(props: PVGDPRScoreProps) {
    super(props);
    // this.url = "/gateway/sandbox/pvgdpr_graph";

    this.text = PontusComponent.t(`NavPanel${this.props.type}Popup_text`)!;

    this.title = PontusComponent.t(`NavPanel${this.props.type}Popup_title`)!;
    this.icon = this.iconMap[this.props.type];
    this.weight = this.weightMap[this.props.type];

    this.scoreIcon = new Icon(ic_multiline_chart);

    this.errCounter = 0;
    this.setState({
      scoreExplanation: '...  LOADING DATA ...',
      scoreValue: 0,
    });

    this.weight = 0;

    this.latestStatus = 200;

    // this.title = "Children";
    // this.icon = ic_child_care;
    //
    //
    // this.state = {
    //   scoreExplanation: "This score reflects the fact that 34 children do not have consent, and " +
    //   "23 do not have a parent or guardian configured",
    //   scoreValue: 45
    // };
  }

  componentDidMount() {
    this.ensureData();
  }

  ensureData = () => {
    let url = this.url;
    if (this.h_request) {
      clearTimeout(this.h_request);
    }

    let reqHeaders =
      //window.keycloakInstance ?
      // {
      //   'Content-Type': 'application/json'
      // , 'Accept': 'application/json'
      // , 'Authorization': "JWT " + window.keycloakInstance.token
      // }
      //   :
      {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      };

    let self = this;

    this.h_request = setTimeout(() => {
      let CancelToken = axios.CancelToken;
      self.req = CancelToken.source();

      // http.post(url)
      axios
        .post(url, self.getSearchQuery(), {
          maxRedirects: 0,
          validateStatus: (status) => {
            self.latestStatus = status;
            return status >= 200 && status < 300;
          },
          headers: reqHeaders,
          cancelToken: self.req.token,
        })
        .then(self.onSuccessProxy)
        .catch((thrown) => {
          if (axios.isCancel(thrown)) {
            console.log('Request canceled', thrown.message);
          } else {
            self.onError(thrown);
          }
        });
    }, 50);
  };
  onError = (err: any) => {
    this.errCounter++;
    // if (this.lastestStatus == 302)
    if (this.errCounter < 25) {
      // {
      //   axios.get('/gateway/sandbox/pvgdpr_gui/bootstrap-toast.css', {maxRedirects: 10, validateStatus: (status) => {
      //     this.lastestStatus = status;
      //     return status >= 200 && status < 400;
      //   }}).then((resp)=>{
      //     resp.status;
      //     /// TODO: finish this!!!!  GET THE HEADER, try again, but with the JWT token in the header!
      //   })
      // }

      this.ensureData();
    }
  };

  onSuccessProxy = (resp: AxiosResponse) => {
    this.errCounter = 0;

    this.onSuccess(resp);
  };

  onSuccess = (resp: AxiosResponse) => {
    let respParsed: any = {};

    try {
      if (typeof resp !== 'object') {
        respParsed = JSON.parse(resp);
      } else {
        respParsed = resp;
      }
      if (respParsed.status === 200) {
        let data = JSON.parse(respParsed.data.result.data['@value'][0]);
        this.setState({
          scoreExplanation: data.scoreExplanation,
          scoreValue: data.scoreValue,
        });

        this.emit('on-score-changed', {
          scoreValue: data.scoreValue,
          title: this.title,
          weight: this.weight,
        });
      }
    } catch (e) {
      // e;
    }
  };

  getSearchQuery = () => {
    throw new Error('This is a base class; getSearchQuery must be overriden ');
  };

  onClickGauge = () => {
    // if (this.props.complyPanel) {
    //   this.props.complyPanel.setState({ selected: this.title });
    // }
  };

  render() {
    // var eventHub = this.props.glEventHub;
    //         <Graph graph={this.state.graph} options={this.state.options} events={this.state.events}/>
    if (this.props.longShow) {
      return (
        <Grid centered divided columns={3} style={{ padding: 15 }}>
          <Grid.Column textAlign="center">
            <div onClick={this.onClickGauge}>
              <PVGauge
                min={0}
                max={100}
                valueFormatter={(value: number) => `${value.toFixed(0)}`}
                backgroundColor="#fefefe"
                value={this.state.scoreValue}
                width={150}
                height={130}
                label={this.title}
                valueLabelStyle={{
                  textAnchor: 'middle',
                  fill: '#ffffff',
                  stroke: 'none',
                  fontStyle: 'normal',
                  fontVariant: 'normal',
                  fontWeight: 'bold',
                  fontStretch: 'normal',
                  lineHeight: 'normal',
                  fillOpacity: 1,
                }}
              />
            </div>
          </Grid.Column>

          <Grid.Column textAlign="justified">
            <Icon icon={this.icon} />
            <p>{this.text}</p>
          </Grid.Column>
          <Grid.Column textAlign="justified">
            <Icon icon={this.scoreIcon} />

            <p>{this.state.scoreExplanation}</p>
          </Grid.Column>
        </Grid>
      );
    } else {
      return (
        <Grid centered divided columns={2}>
          <Grid.Column textAlign="justified">
            <Icon icon={this.scoreIcon} />

            <p>{this.state.scoreExplanation}</p>
          </Grid.Column>

          {/*<Grid.Column textAlign='center'>*/}
          {/*<strong>{this.title}</strong>*/}
          {/*<p>{this.text}</p>*/}
          {/*</Grid.Column>*/}
          <Grid.Column textAlign="center">
            <div>
              <PVGauge value={this.state.scoreValue} width={100} height={130} label={this.title} />
            </div>
          </Grid.Column>
        </Grid>
      );
    }
  }
}

export default PVGDPRScores;
