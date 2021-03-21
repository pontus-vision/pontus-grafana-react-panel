import React from 'react';
import { Button, Menu } from 'semantic-ui-react';
import { Box, Flex } from 'reflexbox';
import AceEditor from 'react-ace';
// import ResizeAware from 'react-resize-aware';
// import ReactResizeDetector from 'react-resize-detector';
import 'brace/mode/json';
import 'brace/theme/monokai';
import PVAceGremlinEditor, { PVAceGremlinEditorProps } from './PVAceGremlinEditor';

// import axios from "axios";
// import "slickgrid-es6/dist/slick-default-theme.less";

class PVAceGremlinJSONQueryResults extends PVAceGremlinEditor {
  obj: any;
  constructor(props: PVAceGremlinEditorProps) {
    super(props);
    // this.columns = [
    //   {key: 'name', name: 'Name'},
    //   {key: 'street', name: 'Street'}
    // ];

    this.state = { value: '', height: 1000, width: 1000 };
  }

  resetValue = (data: string) => {
    this.setState({ value: '' });
  };

  setValue = (data: string) => {
    this.setState({ value: data });
  };

  setObj = (obj: any) => {
    this.obj = obj;
  };

  componentDidMount() {
    // super.componentDidMount();
    this.on(this.props.namespace + '-PVAceGremlinEditor-on-change', this.setValue);
    this.on(this.props.namespace + '-PVAceGremlinEditor-on-before-run-query', this.resetValue);
  }

  componentWillUnmount() {
    // super.componentWillUnmount();
    // this.props.glEventHub.off(this.namespace + 'pvgrid-on-data-loaded', this.onDataLoadedCb);
    this.off(this.props.namespace + '-PVAceGremlinEditor-on-change', this.setValue);
    // window.removeResizeListener(this.od.offsetParent, this.handleResize);
  }

  render() {
    // let eventHub = this.props.glEventHub;
    //

    let data = this.state.value;
    if (data.response) {
      data = data.response;
    }
    if (data.data) {
      data = data.data;
    }
    if (data.result) {
      data = data.result;
    }
    if (typeof data === 'object') {
      data = JSON.stringify(data, null, 2);
    }
    data = data.replace(/\\n/g, '\n');
    data = data.replace(/\\t/g, '\t');
    return (
      <div
        // style={{
        //   height: 'calc(100%-5px)', width: 'calc(100%)', position: 'relative',
        // }}
        style={{ height: this.state.height, width: this.state.width }}
        // height={this.state.height}
        // width={this.state.width}
        ref={this.setOuterDiv}
      >
        <Flex dir={'column'} width={1} style={{ flexWrap: 'wrap' }}>
          <Box px={2} width={1 / 4}>
            <Menu>
              <Button
                className={'compact'}
                onClick={() => {
                  this.emit((this.props.namespace ? this.props.namespace : '') + '-pvgrid-on-click-row', {
                    id: this.obj.editor.getSelectedText(),
                  });
                }}
                // inverted={false}
                // color={'black'}
                style={{ border: 0, background: 'rgb(69,69,69)' }}
                size={'small'}
              >
                Graph
              </Button>
            </Menu>
          </Box>
          <Box px={2} width={1 / 4}>
            <AceEditor
              mode="json"
              theme="monokai"
              name="gremlin-query-results"
              editorProps={{ $blockScrolling: true }}
              enableBasicAutocompletion={false}
              enableLiveAutocompletion={false}
              tabSize={2}
              readOnly={true}
              value={data}
              ref={this.setObj}
              // style={{height: this.state.height + 'px', width: this.state.width + 'px'}}
              height={this.state.height! - 20 + 'px'}
              width={this.state.width! - 20 + 'px'}
              style={{ overflow: 'auto' }}
            />
          </Box>
        </Flex>
      </div>
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

export default PVAceGremlinJSONQueryResults;
