import React, { CSSProperties } from 'react';
import { Button, Menu } from 'semantic-ui-react';
import { Box, Flex } from 'reflexbox';
import AceEditor from 'react-ace';
import 'brace/mode/groovy';
import 'brace/theme/monokai';
import 'brace/ext/searchbox';

import axios from 'axios';
import PontusComponent from './PontusComponent';
import { PVNamespaceProps } from './types';
import ReactResizeDetector from 'react-resize-detector';

// import "slickgrid-es6/dist/slick-default-theme.less";
export interface PVAceGremlinEditorProps extends PVNamespaceProps {
  height?: number;
  width?: number;
  style?: CSSProperties;
}

export interface PVAceGremlinEditorState extends PVAceGremlinEditorProps {
  value?: any;
}

class PVAceGremlinEditor extends PontusComponent<PVAceGremlinEditorProps, PVAceGremlinEditorState> {
  protected od: any;
  constructor(props: PVAceGremlinEditorProps) {
    super(props);
    // this.columns = [
    //   {key: 'name', name: 'Name'},
    //   {key: 'street', name: 'Street'}
    // ];
    this.url = PontusComponent.getGraphURL(props);
    this.state = { ...props, height: 1000, width: 1000 };
  }

  getSearchObj = (data: string) => {
    return {
      gremlin: data, //JSON.stringify(data)
    };
  };

  runQuery = () => {
    let val = PontusComponent.getItem('LGPD-savedStatePVAceGremlinEditor') || '';

    if (val) {
      this.emit(this.props.namespace + '-PVAceGremlinEditor-on-before-run-query', val);

      this.sendData(val);
    }
  };

  sendData = (data: string) => {
    if (this.req) {
      this.req.cancel();
    }

    let url = this.url;
    if (this.hRequest) {
      clearTimeout(this.hRequest);
    }

    let self = this;

    this.hRequest = setTimeout(() => {
      let CancelToken = axios.CancelToken;
      self.req = CancelToken.source();

      // http.post(url)
      axios
        .post(url, self.getSearchObj(data), {
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
          cancelToken: self.req.token,
        })
        .then(self.onSuccess)
        .catch((thrown) => {
          if (axios.isCancel(thrown)) {
            console.log('Request canceled', thrown.message);
          } else {
            self.onError(thrown);
          }
        });
    }, 50);
  };
  onError = (err: Error) => {
    this.emit(this.props.namespace + '-PVAceGremlinEditor-on-change', err);
  };

  onSuccess = (resp: any) => {
    this.emit(this.props.namespace + '-PVAceGremlinEditor-on-change', resp);
  };

  // setObj = (obj) => {
  //   this.obj = obj;
  //   // this.obj.container.parentNode.onresize = this.resize;
  //   // this.obj.container.parentNode.addEventListener("resize", this.resize);
  // };

  handleResize = () => {
    try {
      let width = this.od.offsetParent.offsetWidth;
      let height = this.od.offsetParent.offsetHeight;
      this.setState({ height: height, width: width });

      console.log(this);
    } catch (e) {
      console.log(e);
    }
  };

  onChange = (val: any, ev: any) => {
    PontusComponent.setItem('LGPD-savedStatePVAceGremlinEditor', val);
    // this.setState({value: val})
  };

  setOuterDiv = (od: any) => {
    this.od = od;
    // try {
    //   if (window.addResizeListener) window.addResizeListener(this.od.offsetParent, this.handleResize);
    // } catch (e) {}
  };
  //
  // componentWillUnmount() {
  //   window.removeResizeListener(this.od.offsetParent, this.handleResize);
  // }

  render() {
    // let eventHub = this.props.glEventHub;
    //
    let val = PontusComponent.getItem('LGPD-savedStatePVAceGremlinEditor') || '';
    //
    // <ResizeAware
    //   style={{width: '100%', height: 'calc(100% - 20px)', flex: 1 }}
    //   onResize={this.handleResize}
    //   ref={this.setObj}
    //
    //
    //
    //
    //
    //
    // // >
    //  <ReactResizeDetector handleWidth handleHeight onResize={this.handleResize}
    //                       style={{height: this.state.height + 'px', width: this.state.width + 'px'}}
    //
    //  >
    return (
      <ReactResizeDetector onResize={this.handleResize}>
        <div
          // style={{
          //   height: 'calc(100%-5px)', width: 'calc(100%)', position: 'relative',
          // }}
          style={{ ...this.props.style, height: this.state.height, width: this.state.width }}
          ref={this.setOuterDiv}
        >
          <Flex width={1} style={{ flexWrap: 'wrap' }}>
            <Box px={2} width={1 / 4}>
              <Menu>
                <Button
                  className={'compact'}
                  onClick={this.runQuery}
                  // inverted={false}
                  // color={'black'}
                  style={{ border: 0, background: 'rgb(69,69,69)' }}
                  size={'small'}
                >
                  {PontusComponent.t('Send Query')}
                </Button>
              </Menu>
            </Box>
            <Box px={2} width={1 / 4}>
              <AceEditor
                mode="groovy"
                theme="monokai"
                onChange={this.onChange}
                name="gremlin-editor"
                editorProps={{ $blockScrolling: true, useIncrementalSearch: true }}
                enableBasicAutocompletion={true}
                // enableLiveAutocompletion={true}
                tabSize={2}
                value={val}
                height={this.state.height! - 20 + 'px'}
                width={this.state.width! - 20 + 'px'}
                style={{ overflow: 'auto', flexGrow: 1 }}
              />
            </Box>
          </Flex>
        </div>
      </ReactResizeDetector>
    );

    /*       return (
     <ul className="userlist">
     {this.state.users.map(function (user) {
     return <User
     key={user.name}
     userData={user}
     glEventHub={eventHub}/>
     })}
     </ul>
     )
     */
  }
}

export default PVAceGremlinEditor;
