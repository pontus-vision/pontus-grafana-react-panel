import React, { PureComponent } from 'react';
import { PanelProps } from '@grafana/data';
import { SimpleOptions, WidgetType } from 'types';
import './App.css';
// import PVGrid from './PVGrid';
// import {AgGridReact} from "ag-grid-react";
// import PVGrid from "./PVGrid";
// import PVGremlinComboBox from "./PVGremlinComboBox";
// import PontusComponent from './PontusComponent';
import PVGrid, { PVGridColDef } from './PVGrid';
import PVDataGraph from './PVDataGraph';
import PVGDPRScore from './PVGDPRScore';
import PVDataGraphShowAllNodes from './PVDataGraphShowAllNodes';
import PVDoughnutChart from './PVDoughnutChart';
import PVAceGremlinEditor from './PVAceGremlinEditor';
import PVAceGremlinJSONQueryResults from './PVAceGremlinJSONQueryResults';
import { config, getEchoSrv } from '@grafana/runtime';
import PVReportPanel from './PVReportPanel';

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

  // componentDidMount = async (): Promise<void> => {
  //   await PontusComponent.getKeyCloak();
  // };

  render() {
    const { width, height } = this.props;
    const namespace = this.props.options.namespace;
    const isNeighbour = this.props.options.isNeighbour;
    const neighbourNamespace = this.props.options.neighbourNamespace;
    const widgetType = this.props.options.widgetType;
    const dataType = this.props.options.dataSettings?.dataType || this.props.options.dataType;
    const colSettings = this.props.options.dataSettings?.colSettings || this.props.options.colSettings;
    const customFilter = this.props.options.customFilter;
    const filter = this.props.options.filter;
    const scoreType = this.props.options.scoreType!;
    const awsAccessKeyId = this.props.options.awsAccessKeyId;
    const awsSecretKeyId = this.props.options.awsSecretKeyId;
    const templateText = this.props.options.templateText;
    const echoSrv = getEchoSrv();

    // console.log(`config.bootData = ${config.bootData}`);
    // console.log(`config.bootData = ${JSON.stringify(config.bootData)}`);
    // console.log(`config.oauth = ${JSON.stringify(config.oauth)}`);

    const widget: Record<WidgetType, JSX.Element> = {
      AwarenessPieChart: (
        <PVDoughnutChart
          maxHeight={1000}
          url={this.props.options.directUrl}
          neighbourNamespace={neighbourNamespace}
          auth={config.oauth}
          echoSrv={echoSrv}
          isNeighbour={isNeighbour}
          namespace={namespace}
          subNamespace={undefined}
          width={width}
          height={height}
          awsAccessKeyId={awsAccessKeyId}
          awsSecretKeyId={awsSecretKeyId}
        />
      ),
      GremlinQueryEditor: (
        <PVAceGremlinEditor
          auth={config.oauth}
          echoSrv={echoSrv}
          style={{ height: '100%', width: '100%' }}
          url={this.props.options.directUrl}
          neighbourNamespace={neighbourNamespace}
          isNeighbour={isNeighbour}
          namespace={namespace}
          subNamespace={undefined}
          awsAccessKeyId={awsAccessKeyId}
          awsSecretKeyId={awsSecretKeyId}
        />
      ),
      GremlinQueryResults: (
        <PVAceGremlinJSONQueryResults
          auth={config.oauth}
          echoSrv={echoSrv}
          url={this.props.options.directUrl}
          neighbourNamespace={neighbourNamespace}
          isNeighbour={isNeighbour}
          namespace={namespace}
          subNamespace={undefined}
          awsAccessKeyId={awsAccessKeyId}
          awsSecretKeyId={awsSecretKeyId}
        />
      ),
      PVGDPRScore: (
        <PVGDPRScore
          auth={config.oauth}
          echoSrv={echoSrv}
          url={this.props.options.directUrl}
          scoreType={scoreType}
          showGauge={this.props.options.showGauge}
          showText={this.props.options.showText}
          showIcon={this.props.options.showIcon}
          showExplanation={this.props.options.showExplanation}
          awsAccessKeyId={awsAccessKeyId}
          awsSecretKeyId={awsSecretKeyId}
        />
      ),
      PVDataGraph: (
        <PVDataGraph
          auth={config.oauth}
          echoSrv={echoSrv}
          url={this.props.options.directUrl}
          isNeighbour={isNeighbour}
          namespace={namespace}
          neighbourNamespace={neighbourNamespace}
          awsAccessKeyId={awsAccessKeyId}
          awsSecretKeyId={awsSecretKeyId}
        />
      ),
      PVGrid: (
        <PVGrid
          auth={config.oauth}
          echoSrv={echoSrv}
          url={this.props.options.gridUrl}
          neighbourNamespace={neighbourNamespace}
          isNeighbour={isNeighbour}
          namespace={namespace}
          customFilter={customFilter}
          mountedSuccess={true}
          dataType={dataType}
          columnDefs={colSettings}
          subNamespace={undefined}
          filter={filter}
          awsAccessKeyId={awsAccessKeyId}
          awsSecretKeyId={awsSecretKeyId}
        />
      ),
      PVInfraGraph: (
        <PVDataGraphShowAllNodes
          auth={config.oauth}
          echoSrv={echoSrv}
          url={this.props.options.directUrl}
          isNeighbour={isNeighbour}
          namespace={namespace}
          neighbourNamespace={neighbourNamespace}
          awsAccessKeyId={awsAccessKeyId}
          awsSecretKeyId={awsSecretKeyId}
        />
      ),
      PVReportPanel: (
        <PVReportPanel
          templateText={templateText || ''}
          isNeighbour={isNeighbour}
          namespace={namespace}
          neighbourNamespace={neighbourNamespace}
          awsAccessKeyId={awsAccessKeyId}
          awsSecretKeyId={awsSecretKeyId}
        />
      ),
    };

    return widget[widgetType];
    // const { columnDefs, rowData } = this.state as SimplePanelState;
    // @ts-ignore
    // return (
    //   <div
    //     style={{
    //       position: 'relative',
    //       width,
    //       height,
    //     }}
    //   >
    //     <div
    //       className="ag-theme-balham"
    //       style={{
    //         height: '100%',
    //         width: '100%',
    //       }}
    //     >
    //       {/*<PontusComponent/>*/}
    //       {/*<AgGridReact/>*/}
    //       {/*<PVGremlinComboBox mountedSuccess={true} namespace={"foo"}/>*/}
    //       {widget[widgetType]}
    //     </div>
    //
    //     {/*<div*/}
    //     {/*  style={{*/}
    //     {/*    position: 'absolute',*/}
    //     {/*    bottom: 0,*/}
    //     {/*    left: 0,*/}
    //     {/*    padding: '10px',*/}
    //     {/*  }}*/}
    //     {/*>*/}
    //     {/*<div>Count: {data.series.length}</div>*/}
    //     {/*<div>{options.text}</div>*/}
    //     {/*</div>*/}
    //   </div>
    // );
  }
}
