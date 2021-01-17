import React, { PureComponent } from 'react';
import { PanelProps } from '@grafana/data';
import { SimpleOptions } from 'types';
import './App.css';
// import PVGrid from './PVGrid';
// import {AgGridReact} from "ag-grid-react";
// import PVGrid from "./PVGrid";
// import PVGremlinComboBox from "./PVGremlinComboBox";
// import PontusComponent from './PontusComponent';
import PVGrid, { PVGridColDef } from './PVGrid';

interface Props extends PanelProps<SimpleOptions> {}

interface SimplePanelState extends Readonly<any> {
  columnDefs?: PVGridColDef[];
  dataType?: string;
  filter?: any;
  customFilter?: any;
}

export class SimplePanel extends PureComponent<Props, SimplePanelState> {
  constructor(props: any) {
    super(props);
  }

  render() {
    const { width, height } = this.props;
    const namespace = this.props.options.namespace;
    const url = this.props.options.url;
    const isNeighbour = this.props.options.isNeighbour;
    const neighbourNamespace = this.props.options.neighbourNamespace;
    const dataType = this.props.options.dataType;
    const colSettings = this.props.options.colSettings;
    const customFilter = this.props.options.customFilter;
    const filter = this.props.options.filter;

    // const { columnDefs, rowData } = this.state as SimplePanelState;
    // @ts-ignore
    return (
      <div
        style={{
          position: 'relative',
          width,
          height,
        }}
      >
        <div
          className="ag-theme-balham"
          style={{
            height: '100%',
            width: '100%',
          }}
        >
          {/*<PontusComponent/>*/}
          {/*<AgGridReact/>*/}
          {/*<PVGremlinComboBox mountedSuccess={true} namespace={"foo"}/>*/}
          <PVGrid
            url={url}
            neighbourNamespace={neighbourNamespace}
            isNeighbour={isNeighbour}
            namespace={namespace}
            customFilter={customFilter}
            mountedSuccess={true}
            dataType={dataType}
            columnDefs={colSettings}
            subNamespace={undefined}
            filter={filter}
          />
        </div>

        {/*<div*/}
        {/*  style={{*/}
        {/*    position: 'absolute',*/}
        {/*    bottom: 0,*/}
        {/*    left: 0,*/}
        {/*    padding: '10px',*/}
        {/*  }}*/}
        {/*>*/}
        {/*<div>Count: {data.series.length}</div>*/}
        {/*<div>{options.text}</div>*/}
        {/*</div>*/}
      </div>
    );
  }
}
