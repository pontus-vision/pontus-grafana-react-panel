// @ts-ignore
import $ from 'jquery';
import React, { createRef } from 'react';

// @ts-ignore
window.jQuery = $;
// @ts-ignore
window.$ = $;

require('jquery-ui-sortable');
require('formBuilder');

const formData = [
  {
    type: 'header',
    subtype: 'h1',
    label: 'formBuilder in React',
  },
  {
    type: 'paragraph',
    label: 'This is a demonstration of formBuilder running in a React project.',
  },
];
// import './PVFormBuilderEditor.scoped.scss';
// import 'formiojs/dist/formio.embed.css';
// import 'formiojs/dist/formio.builder.min.css';
// import 'formiojs/dist/formio.full.min.css';
// import './formBuilder.css';
// import 'brace/mode/groovy';
// import 'brace/theme/monokai';
// import 'brace/ext/searchbox';

import PontusComponent from './PontusComponent';
import { PanelOptionsEditorProps } from '@grafana/data';
import ReactResizeDetector from 'react-resize-detector';
// import './react-formio';
// import { FormBuilder } from '@formio/react';
// import { ComponentSchema } from 'formiojs';
// import { ReactFormBuilder } from 'react-form-builder2';
import 'react-form-builder2/dist/app.css';

import { PVFormBuilderEditorProps } from './types';

export interface PVFormBuilderEditorState extends PVFormBuilderEditorProps {
  height?: number;
  width?: number;

  // style?: CSSProperties;
}

class PVFormBuilderEditor extends PontusComponent<
  PanelOptionsEditorProps<PVFormBuilderEditorProps | string>,
  PVFormBuilderEditorState
> {
  // private val: string;
  private od: any;

  constructor(props: Readonly<PanelOptionsEditorProps<PVFormBuilderEditorProps | string>>) {
    super(props);

    this.req = undefined;

    this.state = { ...props.context.options };
    // this.nodePropertyNamesReactSelect = null;
    // this.val = '';
  }
  fb = createRef();

  componentDidMount() {
    // @ts-ignore
    $(this.fb.current).formBuilder({ formData });
  }
  handleResize = () => {
    try {
      let width = this.od.offsetParent.offsetWidth;
      let height = this.od.offsetParent.offsetHeight;
      this.setState({ ...this.state, height: height, width: width });

      console.log(this);
    } catch (e) {
      console.log(e);
    }
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
    // let val = PontusComponent.getItem(this.props.namespace + 'LGPD-savedStateTemplateEditor') || '';

    let width = this.od ? this.od.offsetParent.offsetWidth - 30 : this.state.width;
    let height = this.od ? this.od.offsetParent.offsetHeight - 50 : this.state.height;
    // @ts-ignore
    let formBuilderDiv = <div id="fb-editor" ref={this.fb} />;

    return (
      <ReactResizeDetector onResize={this.handleResize}>
        <div style={{ height: height, width: width }} ref={this.setOuterDiv}>
          <div
            style={{
              display: 'flex',
              flexWrap: 'nowrap',
              flexDirection: 'row',
              flexGrow: 1,
              background: !this.theme.isLight ? 'rgb(187,187,188)' : 'rgb(48,48,48)',
              width: '100%',
            }}
          >
            {formBuilderDiv}
          </div>
        </div>
      </ReactResizeDetector>
    );
  }
}

export default PVFormBuilderEditor;
