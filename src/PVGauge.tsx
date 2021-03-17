import React from 'react';
import ReactResizeDetector from 'react-resize-detector';

import Gauge from 'react-svg-gauge';
import PontusComponent from './PontusComponent';

export interface PVGaugeProps {
  type: string;
  label: string;
  value: number;
  width: number;
  height: number;
  backgroundColor: string;
  longShow: boolean;
  autoResize: boolean;
  valueLabelStyle?: any;
}

export interface PVGaugeState extends PVGaugeProps {}

/***************************
 * UserList Component
 ***************************/
class PVGauge extends PontusComponent<PVGaugeProps, PVGaugeState> {
  constructor(props: PVGaugeProps) {
    super(props);
    // this.url = "/gateway/sandbox/pvgdpr_graph";
    let autoResize = true;
    if (props.height && props.height > 0 && props.width !== null && props.width > 0) {
      autoResize = false;
    }

    this.state = {
      height: props.height,
      width: props.width,
      autoResize: autoResize,
      value: props.value,
      longShow: props.longShow,
      type: props.type,
      label: props.label,
      backgroundColor: props.backgroundColor,
    };
  }

  getHexColor(value: number) {
    const string = value.toString(16);
    return string.length === 1 ? '0' + string : string;
  }

  getRandomInt(max: number) {
    return Math.floor(Math.random() * Math.floor(max));
  }

  handleResize = (width?: number, height?: number): void => {
    // if (height > 0)
    // {
    //   this.instance.updateSize(width, height);
    //
    // }
    // else
    // {
    //   this.instance.updateSize(width, window.innerHeight - 50);
    //
    // }
    if (this.state.autoResize && height && width) {
      this.setState({ height: height, width: width });
    }
  };
  // setNode = (node:any) => {
  //   this.instance = node;
  // };

  render() {
    let val = this.props.value; // || this.getRandomInt(100);
    let r = Math.floor(255 - val * 2.55);

    let g = Math.floor(val * 2.55);
    let b = 0;
    const colorHex: string = '#' + this.getHexColor(r) + this.getHexColor(g) + this.getHexColor(b);

    // var eventHub = this.props.glEventHub;
    //         <Graph graph={this.state.graph} options={this.state.options} events={this.state.events}/>
    // style={{ height: 'calc(100% - 20px)', width: '100%' }}

    return (
      <ReactResizeDetector onResize={this.handleResize}>
        <div style={{ height: '100%', width: '100%' }}>
          <Gauge
            // ref={this.setNode}
            min={0}
            max={100}
            valueFormatter={(value: number) => `${value.toFixed(0)}`}
            color={colorHex}
            value={val}
            width={this.state.width}
            height={this.state.height}
            label={this.props.label ? this.props.label : ''}
            backgroundColor="#fefefe"
            topLabelStyle={{
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
            minMaxLabelStyle={{
              textAnchor: 'middle',
              fill: '#ffffff',
              stroke: 'none',
              fontStyle: 'normal',
              fontVariant: 'normal',
              fontWeight: 'normal',
              fontStretch: 'normal',
              fontSize: 20,
              lineHeight: 'normal',
              fillOpacity: 1,
            }}
            valueLabelStyle={
              this.props.valueLabelStyle || {
                textAnchor: 'middle',
                fill: '#ffffff',
                stroke: 'none',
                fontStyle: 'normal',
                fontVariant: 'normal',
                fontWeight: 'bold',
                fontStretch: 'normal',
                lineHeight: 'normal',
                fillOpacity: 1,
              }
            }
          />
        </div>
      </ReactResizeDetector>
    );
  }
}

export default PVGauge;
