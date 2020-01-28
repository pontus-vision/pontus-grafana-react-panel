import React, { PureComponent } from 'react';
import { PanelProps } from '@grafana/data';
import { SimpleOptions } from 'types';
import './App.css';
// import PVGrid from './PVGrid';
// import {AgGridReact} from "ag-grid-react";
// import PVGrid from "./PVGrid";
// import PVGremlinComboBox from "./PVGremlinComboBox";
// import PontusComponent from './PontusComponent';
import PVGrid from './PVGrid';

interface Props extends PanelProps<SimpleOptions> {}

interface SimplePanelState extends Readonly<any> {
  columnDefs: any;
  rowData: any;
}

export class SimplePanel extends PureComponent<Props> {
  constructor(props: any) {
    super(props);
    this.state = {
      columnDefs: [
        {
          headerName: 'Make',
          field: 'make',
        },
        {
          headerName: 'Model',
          field: 'model',
        },
        {
          headerName: 'Price',
          field: 'price',
        },
      ],
      rowData: [
        {
          make: 'Toyota',
          model: 'Celica',
          price: 35000,
        },
        {
          make: 'Ford',
          model: 'Mondeo',
          price: 32000,
        },
        {
          make: 'Porsche',
          model: 'Boxter',
          price: 72000,
        },
      ],
    } as SimplePanelState;
  }

  render() {
    const { options, data, width, height } = this.props;

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
          <PVGrid namespace={'test'} customFilter={undefined} mountedSuccess={true} settings={undefined} subNamespace={undefined} />
        </div>

        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            padding: '10px',
          }}
        >
          <div>Count: {data.series.length}</div>
          <div>{options.text}</div>
        </div>
      </div>
    );
  }
}
