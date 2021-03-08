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
import PVDataGraph from './PVDataGraph';

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
    const graphMode = this.props.options.graphMode;
    const dataType = this.props.options.dataType || this.props.options.dataSettings?.dataType;
    const colSettings = this.props.options.colSettings || this.props.options.dataSettings?.colSettings;
    const customFilter = this.props.options.customFilter;
    const filter = this.props.options.filter;

    const gridWidget = (
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
    );

    const graphWidget = (
      <PVDataGraph isNeighbour={isNeighbour} namespace={namespace} neighbourNamespace={neighbourNamespace} />
    );

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
          {graphMode ? graphWidget : gridWidget}
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
