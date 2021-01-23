import React from 'react';
import { AgGridReact } from 'ag-grid-react';
// import 'ag-grid-community/dist/styles/ag-grid.css';
// import 'ag-grid-community/dist/styles/ag-theme-balham-dark.css';

import Axios from 'axios';
import PontusComponent, { PubSubCallback } from './PontusComponent';
// import  * as reveal2 from './PVBurgerMenuReveal';
import PVGridReportButtonCellRenderer from './PVGridReportButtonCellRenderer';
import { ColDef, GridOptions, IDatasource, IGetRowsParams, RowClickedEvent } from 'ag-grid-community';

export interface PVGridProps {
  url: string;
  isNeighbour: boolean;
  neighbourNamespace: string;
  namespace?: string;
  subNamespace?: string;
  mountedSuccess?: boolean;
  customFilter?: string | undefined;
  settings?: any;
  columnDefs?: PVGridColDef[];
  dataType?: string;
  filter?: string;
}

export interface PVGridState extends PVGridProps {
  hideMenu: boolean | undefined;

  totalRecords: number;
  defaultColDef: ColDef;

  rowModelType: string;
  paginationPageSize: number;
  maxConcurrentDatasourceRequests: number;
  // infiniteInitialRowCount: 1000,
  // maxBlocksInCache: 100,
  rowSelection: string;
  // rowGroupPanelShow: "always",
  // pivotPanelShow: "always",

  paginationNumberFormatter: { (data: any): string };

  localeTextFunc: { (key: string, defaultValue: string): string };
  options?: string[] | undefined;
  rowData: any[] | undefined;
}

export interface PVGridColDef extends ColDef {
  id: string;
  name: string;
  field: string;
}

class PVGrid extends PontusComponent<PVGridProps, PVGridState> {
  // protected namespace: string;
  // protected subNamespace: string;
  private mountedSuccess: boolean;
  protected customFilter: string | undefined;
  private dataType: string | undefined;
  private readonly PAGESIZE: number;
  private errCounter: number;
  private data: any[];
  private searchstr: string;
  private searchExact: boolean;
  private sortcol: any | null;
  private sortdir: string;
  private filters: any;
  private colFieldTranslation: any;
  // private gridApi: GridApi | null | undefined;
  // private gridColumnApi: ColumnApi | null | undefined;
  private getRowsParams: IGetRowsParams | undefined;
  private from: number | undefined;
  private to: number | undefined;
  // private extraSearch: any;
  private cols: PVGridColDef[] | undefined;
  // private h_request2: NodeJS.Timeout | undefined;
  // private req2: CancelTokenSource | undefined;
  private fromPage: number;
  private toPage: number;
  private filtersCalc: any[];
  constructor(props: Readonly<PVGridProps>) {
    super(props);

    this.fromPage = 0;
    this.toPage = 0;
    this.mountedSuccess = false;

    this.errCounter = 0;
    this.PAGESIZE = 300;
    this.data = [];
    this.searchstr = '';
    this.searchExact = true;
    this.customFilter = props.customFilter;
    this.filters = props.filter ? (JSON.parse(props.filter) as any[]) : [];
    this.filtersCalc = [];
    this.sortcol = null;
    this.sortdir = '+desc';
    this.hRequest = undefined;
    this.req = undefined; // ajax request

    this.dataType = this.getDataType(props);

    this.colFieldTranslation = {};

    // this.setColumnSettings(this.getColSettings(props));

    this.state = {
      hideMenu: true,
      ...this.props,
      totalRecords: 0,
      columnDefs: this.getColSettings(props),
      defaultColDef: {
        editable: false,
        enableRowGroup: false,
        enablePivot: false,
        // enableValue: false,
        sortable: false,
        resizable: true,
        filter: false,
      },
      // components: {
      //   loadingRenderer: function(params) {
      //     if (params.value !== undefined) {
      //       return params.value;
      //     } else {
      //       return '<img src="/images/loading.gif">';
      //     }
      //   }
      // },
      // rowBuffer: 100,
      rowModelType: 'infinite',
      // fetch 100 rows per at a time
      // cacheBlockSize: 100,

      // only keep 10 blocks of rows
      // maxBlocksInCache: 10,

      paginationPageSize: 50,
      // cacheOverflowSize: 2,
      maxConcurrentDatasourceRequests: 1,
      // infiniteInitialRowCount: 1000,
      // maxBlocksInCache: 100,
      rowSelection: 'single',
      // rowGroupPanelShow: "always",
      // pivotPanelShow: "always",

      rowData: this.data,
      paginationNumberFormatter: (params: any) => {
        return '[' + params.value.toLocaleString() + ']';
      },

      localeTextFunc: (key: string, defaultValue: string): string => {
        // to avoid key clash with external keys, we add 'grid' to the start of each key.
        const gridKey: string = 'grid_' + key;

        // look the value up. here we use the AngularJS 1.x $filter service, however you
        // can use whatever service you want, AngularJS 1.x or otherwise.
        const value: string = PontusComponent.t(gridKey) as string;
        return value === gridKey ? defaultValue : value;
      },
    };
  }

  setCustomFilter = (customFilter: string | undefined) => {
    this.customFilter = customFilter;
    this.ensureData(0, this.PAGESIZE);
  };

  getColSettings(props: Readonly<PVGridProps>): PVGridColDef[] {
    // const colSettingsStr = PontusComponent.getItem(
    //   `${this.props.namespace}${this.props.subNamespace ? this.props.subNamespace : ''}.PVGrid.colSettings`
    // );
    let colSettings: PVGridColDef[];
    // if (colSettingsStr) {
    //   colSettings = JSON.parse(colSettingsStr) as PVGridColDef[];
    // } else {
    colSettings = props.columnDefs ? props.columnDefs : [];
    // }
    colSettings = this.setColumnSettings(colSettings, true);

    return colSettings;
  }

  getDataType(props: Readonly<PVGridProps>): string {
    // let dataType = PontusComponent.getItem(
    //   `${this.props.namespace}${this.props.subNamespace ? this.props.subNamespace : ''}.PVGrid.dataType`
    // );
    // let dataType = JSON.parse();
    // if (!dataType) {
    let dataType = props.dataType ? props.dataType : '';
    // }
    this.setDataType(dataType as string);

    return dataType as string;
  }

  // handleResize = () => {
  //   if (this.gridApi) {
  //     this.gridApi.checkGridSize();
  //     this.onViewportChanged();
  //   }
  // };
  //
  //
  // setNamespace = (namespace:string) => {
  //   this.namespace = namespace;
  // };
  //

  onClickNeighbour: PubSubCallback = (topic: string, obj: any) => {
    this.setCustomFilter(`hasNeighbourId:${obj.id}`);
  };

  getSearchObj = (
    from: number,
    to: number,
    searchstr: string,
    searchExact: any,
    cols: any,
    dataType: string | undefined,
    sortcol: any,
    sortdir: any,
    filters: any[],
    customFilter: string | undefined
  ) => {
    return {
      search: {
        searchStr: searchstr,
        searchExact: searchExact,
        cols: cols,
        extraSearch: { label: dataType, value: dataType },
      },
      customFilter: customFilter,
      cols: cols,
      filters: filters,
      dataType: dataType,
      from: from,
      to: to,
      sortCol: sortcol,
      sortDir: sortdir, // ((sortdir > 0) ? "+asc" : "+desc")
    };
  };
  // getColsFromDataType = () => {
  //   if (this.req2)
  //   {
  //     this.req2.cancel();
  //   }
  //
  //   const url = PontusComponent.getRestNodePropertyNamesURL(this.props);
  //   if (this.h_request2)
  //   {
  //     clearTimeout(this.h_request2);
  //   }
  //
  //   const self = this;
  //   const jsonRequest = {labels: this.dataType};
  //
  //   this.h_request2 = setTimeout(() => {
  //     self.req2 = Axios.CancelToken.source();
  //     Axios
  //       .post(url, jsonRequest, {
  //         headers: {'Content-Type': 'application/json', Accept: 'application/json'},
  //         cancelToken: self.req2.token,
  //       })
  //       .then(response => {
  //         // this.reactSelect.options = response.data.labels || [];
  //         if (response.data && response.data.labels)
  //         {
  //           for (let i = 0; i < response.data.labels.length; i++)
  //           {
  //             const lbl = response.data.labels[i];
  //             lbl.label = PontusComponent.t(lbl.label);
  //           }
  //           this.setState({
  //             options: response.data.labels,
  //           });
  //         }
  //
  //         // callback(null, {
  //         //   options: response.data.labels || [],
  //         //   complete: true
  //         //
  //         // });
  //       })
  //       .catch(thrown => {
  //         if (Axios.isCancel(thrown))
  //         {
  //           console.log('Request canceled', thrown.message);
  //         }
  //         else
  //         {
  //           this.onError(thrown, this.from, this.to);
  //         }
  //       });
  //   }, 50);
  // };

  ensureData = (fromReq: number | undefined, toReq: number | undefined) => {
    if (undefined === fromReq || undefined === toReq) {
      return;
    }
    if (this.req) {
      this.req.cancel();
      for (let i = this.fromPage; i <= this.toPage; i++) {
        this.data[i * this.PAGESIZE] = undefined;
      }
    }
    const fromReqNum = !fromReq || fromReq < 0 ? 0 : fromReq;

    const fromPage = Math.floor(fromReqNum / this.PAGESIZE);
    const toPage = Math.floor(toReq / this.PAGESIZE);

    const url = PontusComponent.getRestUrlAg(this.props);
    if (this.hRequest) {
      clearTimeout(this.hRequest);
    }

    const self = this;

    this.hRequest = setTimeout(() => {
      self.req = Axios.CancelToken.source();
      Axios.post(
        url,
        self.getSearchObj(
          fromReqNum,
          toReq,
          self.searchstr,
          self.searchExact,
          self.cols,
          self.dataType,
          self.sortcol,
          self.sortdir,
          self.filtersCalc,
          self.customFilter
        ),
        {
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
          cancelToken: self.req.token,
        }
      )
        .then(self.onSuccessProxy)
        .catch((thrown: any) => {
          if (Axios.isCancel(thrown)) {
            console.log('Request canceled', thrown.message);
          } else {
            self.onError(thrown, fromPage, toPage);
          }
        });

      self.fromPage = fromPage;
      self.toPage = toPage;
    }, 50);
  };
  onError = (err: any, fromPage: number | undefined, toPage: number | undefined) => {
    this.errCounter++;

    if (this.errCounter < 3) {
      this.ensureData(this.from, this.to);
    }
  };

  onSuccessProxy = (resp: { data: { from: any; records: string | any[]; totalAvailable: number | undefined } }) => {
    this.errCounter = 0;

    this.onSuccessPVRestQuery(resp);
  };

  onSuccessPVRestQuery = (resp: {
    data: { from: any; records: string | any[]; totalAvailable: number | undefined };
  }) => {
    const from = resp.data.from,
      to = from + resp.data.records.length;
    const items = [];

    for (let i = 0; i < resp.data.records.length; i++) {
      const item = JSON.parse(resp.data.records[i]);
      for (const itemKey of Object.keys(item)) {
        const val = item[itemKey];
        // LPPM - need to get rid of any dots in the value.
        const itemKeyClean = itemKey.replace(/\./g, '_');
        item[itemKeyClean] = val;
      }
      items[i] = item;
    }

    this.req = undefined;
    if (this.getRowsParams) {
      if (to > from) {
        this.getRowsParams.successCallback(items, resp.data.totalAvailable);
      } else if (to === 0) {
        this.getRowsParams.successCallback(items, 0);
      } else {
        this.getRowsParams.successCallback(items);
      }
    }
  };

  setSearch: PubSubCallback = (topic: string, str: any) => {
    this.searchstr = str;
    this.ensureData(0, this.PAGESIZE);
  };
  setSearchExact: PubSubCallback = (topic: string, exact: any) => {
    this.searchExact = exact;
    this.ensureData(0, this.PAGESIZE);
  };

  setDataType = (str: string) => {
    this.dataType = str;
    // PontusComponent.setItem(
    //   `${this.props.namespace}${this.props.subNamespace ? this.props.subNamespace : ''}.PVGrid.dataType`,
    //   this.dataType
    // );
  };

  setExtraSearch: PubSubCallback = (topic: string, str: any) => {
    // this.extraSearch = str;
    if (str && str.value) {
      this.setDataType(str.value);
    }
  };

  setColumns = (cols: PVGridColDef[]) => {
    // this.state.columnDefs = cols;
    if (this.mountedSuccess) {
      this.setState({ columnDefs: cols });
      this.cols = cols;
      this.ensureData(0, this.PAGESIZE);
    }
  };

  // setCustomFilter = (customFilter: string | undefined) => {
  //   this.customFilter = customFilter;
  //   this.ensureData(0, this.PAGESIZE);
  // };

  onClick = (event: RowClickedEvent): void => {
    if (event.data) {
      // let val = this.grid.getDataItem(clickInfo.row);
      // alert (val);
      this.emit(this.props.namespace + '-pvgrid-on-click-row', event.data);
    }
  };

  setColumnSettingsCb = (topic: string, colSettings: PVGridColDef[]) => {
    this.setColumnSettings(colSettings);
  };

  setColumnSettings = (colSettings: PVGridColDef[], initMode?: boolean): PVGridColDef[] => {
    this.colFieldTranslation = {};

    if (colSettings) {
      const newColSettings: PVGridColDef[] = [];

      // // if (!initMode) {
      // PontusComponent.setItem(
      //   `${this.props.namespace}${this.props.subNamespace ? this.props.subNamespace : ''}.PVGrid.colSettings`,
      //   JSON.stringify(colSettings)
      // );
      // // }

      for (let i = 0; i < colSettings.length; i++) {
        const colSetting: PVGridColDef = colSettings[i];
        const newColSetting: PVGridColDef = { ...colSetting };

        // const colSetting = colSettings[i];
        newColSetting.headerName = PontusComponent.t(colSetting.name);
        // force a deep copy here.
        let origField = `${colSetting.field}`;
        // if (!initMode) {
        // If the column starts with a #, it's indexed, and we can sort/filter;
        // otherwise, we can't.
        if (origField.startsWith('#')) {
          // colSetting.sortable = true;
          newColSetting.sortable = true;
          const isDate = origField.toLowerCase().search(/date/) >= 0;
          if (isDate) {
            // colSetting.filter = 'agDateColumnFilter';
            newColSetting.filter = 'agDateColumnFilter';
            // colSetting.valueFormatter = (param: ValueFormatterParams):string => {
            // };
          } else {
            // colSetting.filter = true;
            newColSetting.filter = true;
          }
          origField = origField.toString().substring(1);
        } else if (origField.startsWith('@')) {
          // origField = origField.toString().substring(1);

          // let parsedText = origField.toString().split('@');
          // origField = parsedText[1];
          // let text = parsedText[2];
          newColSetting.cellRendererFramework = PVGridReportButtonCellRenderer;
          newColSetting.sortable = false;
          newColSetting.filter = false;
          // colSetting.cellRendererFramework = PVGridReportButtonCellRenderer;
          // colSetting.sortable = false;
          // colSetting.filter = false;
        } else {
          // colSetting.sortable = false;
          // colSetting.filter = false;
          newColSetting.sortable = false;
          newColSetting.filter = false;
        }
        newColSetting.id = origField;
        newColSetting.field = origField.replace(/\./g, '_');
        // }

        this.colFieldTranslation[colSetting.field] = origField;
        this.colFieldTranslation[newColSetting.field] = origField;
        newColSettings.push(newColSetting);
      }

      this.setColumns(newColSettings);
      this.cols = newColSettings;
      return newColSettings;
    }

    return [];
  };
  createSubscriptions = (props: Readonly<PVGridProps>) => {
    this.on(
      `${props.namespace}${props.subNamespace ? props.subNamespace : ''}-pvgrid-on-search-changed`,
      this.setSearch
    );
    this.on(
      `${props.namespace}${props.subNamespace ? props.subNamespace : ''}-pvgrid-on-search-exact-changed`,
      this.setSearchExact
    );
    this.on(
      `${props.namespace}${props.subNamespace ? props.subNamespace : ''}-pvgrid-on-col-settings-changed`,
      this.setColumnSettingsCb
    );
    this.on(
      `${props.namespace}${props.subNamespace ? props.subNamespace : ''}-pvgrid-on-extra-search-changed`,
      this.setExtraSearch
    );
    if (props.isNeighbour) {
      this.on(`${props.neighbourNamespace}-pvgrid-on-click-row`, this.onClickNeighbour);
    } else {
      this.setCustomFilter(undefined);
    }
  };

  removeSubscriptions = (props: Readonly<PVGridProps>) => {
    this.off(
      `${props.namespace}${props.subNamespace ? props.subNamespace : ''}-pvgrid-on-search-changed`,
      this.setSearch
    );
    this.off(
      `${props.namespace}${props.subNamespace ? props.subNamespace : ''}-pvgrid-on-search-exact-changed`,
      this.setSearchExact
    );
    this.off(
      `${props.namespace}${props.subNamespace ? props.subNamespace : ''}-pvgrid-on-col-settings-changed`,
      this.setColumnSettingsCb
    );
    this.off(
      `${props.namespace}${props.subNamespace ? props.subNamespace : ''}-pvgrid-on-extra-search-changed`,
      this.setExtraSearch
    );

    if (props.isNeighbour) {
      this.off(`${props.neighbourNamespace}-pvgrid-on-click-row`, this.onClickNeighbour);
    } else {
      this.setCustomFilter(undefined);
    }
  };
  componentDidMount = () => {
    this.mountedSuccess = true;
    this.createSubscriptions(this.props);
  };

  componentDidUpdate(prevProps: Readonly<PVGridProps>, prevState: Readonly<PVGridState>, snapshot?: any): void {
    this.removeSubscriptions(prevProps);
    this.createSubscriptions(this.props);
  }

  componentWillUnmount = () => {
    this.removeSubscriptions(this.props);
  };

  // onViewportChanged = (/*e, args*/) => {
  //   // let vp = this.grid.getViewport();
  //   // this.ensureData(vp.top, vp.bottom);
  // };

  // onDataLoadedCb = (args) =>
  // {
  //   if (this.getRowsParams)
  //   {
  //     this.getRowsParams.successCallback(args.data, args.to);
  //   }
  //
  // };

  setTotalRecords(totalRecords: number) {
    this.setState({ totalRecords: totalRecords });
  }

  dataSource: IDatasource = {
    rowCount: undefined,
    getRows: (params: IGetRowsParams) => {
      console.log('asking for ' + params.startRow + ' to ' + params.endRow);
      this.getRowsParams = params;

      //  {colId: "Object_Notification_Templates_Types_1", sort: "desc"}
      // params.sortModel
      if (params.sortModel && params.sortModel.length > 0) {
        this.sortcol = params.sortModel[0].colId.replace(/_1$/, '');
        this.sortcol = this.colFieldTranslation[this.sortcol];
        this.sortdir = `+${params.sortModel[0].sort}`;
      }

      if (params.filterModel) {
        this.filtersCalc = this.filters ? [...this.filters] : [];

        for (const fm of Object.keys(params.filterModel)) {
          let colId = fm.replace(/_1$/g, '');
          colId = this.colFieldTranslation[colId];

          const csJson = params.filterModel[fm];

          const colSearch = {
            colId: colId,
            ...csJson,
          };

          this.filtersCalc.push(colSearch);

          /* when we have simple filters, the following format is used:
           [
           { colId: "Object_Notification_Templates_Label", filterType: "text", type: "contains", filter: "adfasdf"},
           { colId: "Object_Notification_Templates_Types", filterType: "text", type: "contains", filter: "aaa"}
           ]
           */

          //            OR
          /*
           When we have complex filters, the following format is used:
           [
           {
           colId: "Object_Notification_Templates_Label",
           condition1: {filterType: "text", type: "notContains", filter: "ddd"},
           condition2: {filterType: "text", type: "endsWith", filter: "aaaa"},
           filterType: "text",
           operator: "OR"
           },
           {
           colId: "Object_Notification_Templates_Types:{
           condition1: {filterType: "text", type: "notContains", filter: "aaaa"},
           condition2: {filterType: "text", type: "startsWith", filter: "bbbb"},
           filterType: "text",
           operator: "AND"
           }
           ]
           */
        }
      }
      // (sortdir > 0) ? "+asc" : "+desc"
      // this.ensureData(params.startRow, params.endRow);
      this.ensureData(params.startRow, params.endRow);
    },
  };

  onGridReady = (params: GridOptions) => {
    // this.gridApi = params.api;
    // this.gridColumnApi = params.columnApi;
  };

  render = () => {
    // let eventHub = this.props.glEventHub;
    //
    let menu;
    if (!this.state.hideMenu) {
      menu = <div />;

      //   (
      //   <Menu noOverlay style={{ position: 'absolute', right: '10px' }} pageWrapId={'outer-wrap'} right outerContainerId={'outer-wrap'}>
      //     <PVGridColSelector
      //       // glEventHub={this.props.glEventHub}
      //       style={{ height: '100%', width: '100%' }}
      //       namespace={`${this.namespace}${this.subNamespace ? this.subNamespace : ''}`}
      //       colSettings={this.state.columnDefs}
      //       dataType={this.dataType}
      //     />
      //   </Menu>
      // );
    } else {
      menu = <div />;
    }

    return (
      <div style={{ width: '100%', height: 'calc(100% - 20px)' }}>
        {menu}

        <div
          style={{ width: '100%', height: '100%' }}
          className={'ag-theme-balham-dark'}
          id={'outer-wrap'}
          // ref={this.setGridDiv}>
        >
          <AgGridReact
            columnDefs={this.state.columnDefs}
            // autoGroupColumnDef={this.state.autoGroupColumnDef}
            defaultColDef={this.state.defaultColDef}
            suppressRowClickSelection={true}
            groupSelectsChildren={true}
            debug={true}
            rowSelection={this.state.rowSelection}
            // rowGroupPanelShow={this.state.rowGroupPanelShow}
            // pivotPanelShow={this.state.pivotPanelShow}
            enableRangeSelection={false}
            // pagination={true}
            // paginationPageSize={this.state.paginationPageSize}
            paginationNumberFormatter={this.state.paginationNumberFormatter}
            localeTextFunc={this.state.localeTextFunc}
            onGridReady={this.onGridReady}
            rowData={this.state.rowData}
            datasource={this.dataSource}
            onRowClicked={this.onClick}
            // components={this.state.components}
            // rowBuffer={this.state.rowBuffer}
            rowDeselection={true}
            rowModelType={this.state.rowModelType}
            // cacheOverflowSize={this.state.cacheOverflowSize}
            // maxConcurrentDatasourceRequests={this.state.maxConcurrentDatasourceRequests}
            // infiniteInitialRowCount={this.state.infiniteInitialRowCount}
            // maxBlocksInCache={this.state.maxBlocksInCache}

            // paginationPageSize={100}
            cacheOverflowSize={2}
            maxConcurrentDatasourceRequests={2}
            infiniteInitialRowCount={1}
            maxBlocksInCache={2}
            pagination={true}
            paginationAutoPageSize={true}
            getRowNodeId={item => item.id}
          />
        </div>
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
  };
}

export default PVGrid;
