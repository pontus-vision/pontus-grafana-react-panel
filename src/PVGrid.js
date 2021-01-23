import { __assign, __extends, __values } from 'tslib';
import React from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-balham-dark.css';
import Axios from 'axios';
import PontusComponent from './PontusComponent';
// import  * as reveal2 from './PVBurgerMenuReveal';
import * as Menu from './PVBurgerMenuScaleDown';
import PVGridColSelector from './PVGridColSelector';
import PVGridReportButtonCellRenderer from './PVGridReportButtonCellRenderer';
var PVGrid = /** @class */ (function (_super) {
  __extends(PVGrid, _super);
  function PVGrid(props) {
    var _this = _super.call(this, props) || this;
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
    _this.componentDidMount = function () {
      _this.mountedSuccess = true;
      _this.on(
        '' + _this.namespace + (_this.subNamespace ? _this.subNamespace : '') + '-pvgrid-on-search-changed',
        _this.setSearch
      );
      _this.on(
        '' + _this.namespace + (_this.subNamespace ? _this.subNamespace : '') + '-pvgrid-on-search-exact-changed',
        _this.setSearchExact
      );
      _this.on(
        '' + _this.namespace + (_this.subNamespace ? _this.subNamespace : '') + '-pvgrid-on-col-settings-changed',
        _this.setColumnSettingsCb
      );
      _this.on(
        '' + _this.namespace + (_this.subNamespace ? _this.subNamespace : '') + '-pvgrid-on-extra-search-changed',
        _this.setExtraSearch
      );
    };
    _this.getSearchObj = function (
      from,
      to,
      searchstr,
      searchExact,
      cols,
      dataType,
      sortcol,
      sortdir,
      filters,
      customFilter
    ) {
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
        sortDir: sortdir,
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
    _this.ensureData = function (fromReq, toReq) {
      if (undefined === fromReq || undefined === toReq) {
        return;
      }
      if (_this.req) {
        _this.req.cancel();
        for (var i = _this.fromPage; i <= _this.toPage; i++) {
          _this.data[i * _this.PAGESIZE] = undefined;
        }
      }
      var fromReqNum = !fromReq || fromReq < 0 ? 0 : fromReq;
      var fromPage = Math.floor(fromReqNum / _this.PAGESIZE);
      var toPage = Math.floor(toReq / _this.PAGESIZE);
      var url = _this.url;
      if (_this.hRequest) {
        clearTimeout(_this.hRequest);
      }
      var self = _this;
      _this.hRequest = setTimeout(function () {
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
            self.filters,
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
          .catch(function (thrown) {
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
    _this.onError = function (err, fromPage, toPage) {
      _this.errCounter++;
      if (_this.errCounter < 3) {
        _this.ensureData(_this.from, _this.to);
      }
    };
    _this.onSuccessProxy = function (resp) {
      _this.errCounter = 0;
      _this.onSuccessPVRestQuery(resp);
    };
    _this.onSuccessPVRestQuery = function (resp) {
      var e_1, _a;
      var from = resp.data.from,
        to = from + resp.data.records.length;
      var items = [];
      for (var i = 0; i < resp.data.records.length; i++) {
        var item = JSON.parse(resp.data.records[i]);
        try {
          for (var _b = ((e_1 = void 0), __values(Object.keys(item))), _c = _b.next(); !_c.done; _c = _b.next()) {
            var itemKey = _c.value;
            var val = item[itemKey];
            // LPPM - need to get rid of any dots in the value.
            var itemKeyClean = itemKey.replace(/\./g, '_');
            item[itemKeyClean] = val;
          }
        } catch (e_1_1) {
          e_1 = { error: e_1_1 };
        } finally {
          try {
            if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
          } finally {
            if (e_1) throw e_1.error;
          }
        }
        items[i] = item;
      }
      _this.req = undefined;
      if (_this.getRowsParams) {
        if (to > from) {
          _this.getRowsParams.successCallback(items, resp.data.totalAvailable);
        } else if (to === 0) {
          _this.getRowsParams.successCallback(items, 0);
        } else {
          _this.getRowsParams.successCallback(items);
        }
      }
    };
    _this.setSearch = function (topic, str) {
      _this.searchstr = str;
      _this.ensureData(0, _this.PAGESIZE);
    };
    _this.setSearchExact = function (topic, exact) {
      _this.searchExact = exact;
      _this.ensureData(0, _this.PAGESIZE);
    };
    _this.setDataType = function (str) {
      _this.dataType = str;
      PontusComponent.setItem(
        '' + _this.namespace + (_this.subNamespace ? _this.subNamespace : '') + '.PVGrid.dataType',
        _this.dataType
      );
    };
    _this.setExtraSearch = function (str) {
      // this.extraSearch = str;
      if (str && str.value) {
        _this.setDataType(str.value);
      }
    };
    _this.setColumns = function (cols) {
      // this.state.columnDefs = cols;
      if (_this.mountedSuccess) {
        _this.setState({ columnDefs: cols });
        _this.cols = cols;
        _this.ensureData(0, _this.PAGESIZE);
      }
    };
    // setCustomFilter = (customFilter: string | undefined) => {
    //   this.customFilter = customFilter;
    //   this.ensureData(0, this.PAGESIZE);
    // };
    _this.onClick = function (event) {
      if (event.data) {
        // let val = this.grid.getDataItem(clickInfo.row);
        // alert (val);
        _this.emit(_this.namespace + '-pvgrid-on-click-row', event.data);
      }
    };
    _this.setColumnSettings = function (colSettings) {
      _this.colFieldTranslation = {};
      if (colSettings) {
        PontusComponent.setItem(
          '' + _this.namespace + (_this.subNamespace ? _this.subNamespace : '') + '.PVGrid.colSettings',
          JSON.stringify(colSettings)
        );
        for (var i = 0; i < colSettings.length; i++) {
          var colSetting = colSettings[i];
          // const colSetting = colSettings[i];
          colSetting.headerName = PontusComponent.t(colSetting.name);
          var origField = colSetting.field;
          // If the column starts with a #, it's indexed, and we can sort/filter;
          // otherwise, we can't.
          if (origField.startsWith('#')) {
            colSetting.sortable = true;
            var isDate = origField.toLowerCase().search(/date/) >= 0;
            if (isDate) {
              colSetting.filter = 'agDateColumnFilter';
              // colSetting.valueFormatter = (param: ValueFormatterParams):string => {
              // };
            } else {
              colSetting.filter = true;
            }
            origField = origField.toString().substring(1);
          } else if (origField.startsWith('@')) {
            // origField = origField.toString().substring(1);
            // let parsedText = origField.toString().split('@');
            // origField = parsedText[1];
            // let text = parsedText[2];
            colSetting.cellRendererFramework = PVGridReportButtonCellRenderer;
            colSetting.sortable = false;
            colSetting.filter = false;
          } else {
            colSetting.sortable = false;
            colSetting.filter = false;
          }
          colSetting.field = origField.replace(/\./g, '_');
          colSetting.id = origField;
          _this.colFieldTranslation[colSetting.field] = origField;
        }
        _this.setColumns(colSettings);
        _this.cols = colSettings;
      }
    };
    _this.componentWillUnmount = function () {
      // this.props.glEventHub.off(this.namespace + '-pvgrid-on-search-changed', this.setSearch);
      // this.props.glEventHub.off(this.namespace + '-pvgrid-on-col-settings-changed', this.setColumnSettings);
      // this.props.glEventHub.off(this.namespace + '-pvgrid-on-extra-search-changed', this.setExtraSearch);
      _this.off(
        '' + _this.namespace + (_this.subNamespace ? _this.subNamespace : '') + '-pvgrid-on-search-changed',
        _this.setSearch
      );
      _this.off(
        '' + _this.namespace + (_this.subNamespace ? _this.subNamespace : '') + '-pvgrid-on-search-exact-changed',
        _this.setSearchExact
      );
      _this.off(
        '' + _this.namespace + (_this.subNamespace ? _this.subNamespace : '') + '-pvgrid-on-col-settings-changed',
        _this.setColumnSettingsCb
      );
      _this.off(
        '' + _this.namespace + (_this.subNamespace ? _this.subNamespace : '') + '-pvgrid-on-extra-search-changed',
        _this.setExtraSearch
      );
    };
    _this.dataSource = {
      rowCount: undefined,
      getRows: function (params) {
        var e_2, _a;
        console.log('asking for ' + params.startRow + ' to ' + params.endRow);
        _this.getRowsParams = params;
        //  {colId: "Object_Notification_Templates_Types_1", sort: "desc"}
        // params.sortModel
        if (params.sortModel && params.sortModel.length > 0) {
          _this.sortcol = params.sortModel[0].colId.replace(/_1$/, '');
          _this.sortcol = _this.colFieldTranslation[_this.sortcol];
          _this.sortdir = '+' + params.sortModel[0].sort;
        }
        if (params.filterModel) {
          _this.filters = [];
          try {
            for (var _b = __values(Object.keys(params.filterModel)), _c = _b.next(); !_c.done; _c = _b.next()) {
              var fm = _c.value;
              var colId = fm.replace(/_1$/g, '');
              colId = _this.colFieldTranslation[colId];
              var csJson = params.filterModel[fm];
              var colSearch = __assign({ colId: colId }, csJson);
              _this.filters.push(colSearch);
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
          } catch (e_2_1) {
            e_2 = { error: e_2_1 };
          } finally {
            try {
              if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            } finally {
              if (e_2) throw e_2.error;
            }
          }
        }
        // (sortdir > 0) ? "+asc" : "+desc"
        // this.ensureData(params.startRow, params.endRow);
        _this.ensureData(params.startRow, params.endRow);
      },
    };
    _this.onGridReady = function (params) {
      // this.gridApi = params.api;
      // this.gridColumnApi = params.columnApi;
    };
    _this.render = function () {
      // let eventHub = this.props.glEventHub;
      //
      var menu;
      if (!_this.state.hideMenu) {
        menu = React.createElement(
          Menu,
          {
            noOverlay: true,
            style: { position: 'absolute', right: '10px' },
            pageWrapId: 'outer-wrap',
            right: true,
            outerContainerId: 'outer-wrap',
          },
          React.createElement(
            PVGridColSelector,
            // glEventHub={this.props.glEventHub}
            {
              // glEventHub={this.props.glEventHub}
              style: { height: '100%', width: '100%' },
              namespace: '' + _this.namespace + (_this.subNamespace ? _this.subNamespace : ''),
              colSettings: _this.state.columnDefs,
              dataType: _this.dataType,
            }
          )
        );
      } else {
        menu = React.createElement('div', null);
      }
      return React.createElement(
        'div',
        { style: { width: '100%', height: 'calc(100% - 20px)' } },
        menu,
        React.createElement(
          'div',
          { style: { width: '100%', height: '100%' }, className: 'ag-theme-balham-dark', id: 'outer-wrap' },
          React.createElement(AgGridReact, {
            columnDefs: _this.state.columnDefs,
            // autoGroupColumnDef={this.state.autoGroupColumnDef}
            defaultColDef: _this.state.defaultColDef,
            suppressRowClickSelection: true,
            groupSelectsChildren: true,
            debug: true,
            rowSelection: _this.state.rowSelection,
            // rowGroupPanelShow={this.state.rowGroupPanelShow}
            // pivotPanelShow={this.state.pivotPanelShow}
            enableRangeSelection: false,
            // pagination={true}
            // paginationPageSize={this.state.paginationPageSize}
            paginationNumberFormatter: _this.state.paginationNumberFormatter,
            localeTextFunc: _this.state.localeTextFunc,
            onGridReady: _this.onGridReady,
            rowData: _this.state.rowData,
            datasource: _this.dataSource,
            onRowClicked: _this.onClick,
            // components={this.state.components}
            // rowBuffer={this.state.rowBuffer}
            rowDeselection: true,
            rowModelType: _this.state.rowModelType,
            // cacheOverflowSize={this.state.cacheOverflowSize}
            // maxConcurrentDatasourceRequests={this.state.maxConcurrentDatasourceRequests}
            // infiniteInitialRowCount={this.state.infiniteInitialRowCount}
            // maxBlocksInCache={this.state.maxBlocksInCache}
            // paginationPageSize={100}
            cacheOverflowSize: 2,
            maxConcurrentDatasourceRequests: 2,
            infiniteInitialRowCount: 1,
            maxBlocksInCache: 2,
            pagination: true,
            paginationAutoPageSize: true,
            getRowNodeId: function (item) {
              return item.id;
            },
          })
        )
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
    _this.fromPage = 0;
    _this.toPage = 0;
    _this.namespace = props.namespace || '';
    _this.subNamespace = props.subNamespace || '';
    _this.mountedSuccess = false;
    _this.customFilter = props.customFilter;
    // this.columns = [
    //   {key: 'name', name: 'Name'},
    //   {key: 'street', name: 'Street'}
    // ];
    _this.errCounter = 0;
    _this.PAGESIZE = 300;
    _this.data = [];
    _this.searchstr = '';
    _this.searchExact = true;
    _this.sortcol = null;
    _this.sortdir = '+desc';
    _this.hRequest = undefined;
    _this.req = undefined; // ajax request
    _this.url = PontusComponent.getRestUrlAg(props);
    _this.dataType = _this.getDataType(props);
    _this.colFieldTranslation = {};
    // this.setColumnSettings(this.getColSettings(props));
    _this.state = __assign(__assign({ hideMenu: true }, _this.props), {
      totalRecords: 0,
      columnDefs: _this.getColSettings(props),
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
      rowData: _this.data,
      paginationNumberFormatter: function (params) {
        return '[' + params.value.toLocaleString() + ']';
      },
      localeTextFunc: function (key, defaultValue) {
        // to avoid key clash with external keys, we add 'grid' to the start of each key.
        var gridKey = 'grid_' + key;
        // look the value up. here we use the AngularJS 1.x $filter service, however you
        // can use whatever service you want, AngularJS 1.x or otherwise.
        var value = PontusComponent.t(gridKey);
        return value === gridKey ? defaultValue : value;
      },
    });
    return _this;
  }
  PVGrid.prototype.getColSettings = function (props) {
    var colSettingsStr = PontusComponent.getItem(
      '' + this.namespace + (this.subNamespace ? this.subNamespace : '') + '.PVGrid.colSettings'
    );
    var colSettings;
    if (colSettingsStr) {
      colSettings = JSON.parse(colSettingsStr);
    } else {
      colSettings = props.colSettings ? props.colSettings : [];
    }
    this.setColumnSettings(colSettings);
    return colSettings;
  };
  PVGrid.prototype.getDataType = function (props) {
    var dataType = PontusComponent.getItem(
      '' + this.namespace + (this.subNamespace ? this.subNamespace : '') + '.PVGrid.dataType'
    );
    // let dataType = JSON.parse();
    if (!dataType) {
      dataType = props.dataType ? props.dataType : '';
    }
    this.setDataType(dataType);
    return dataType;
  };
  PVGrid.prototype.setColumnSettingsCb = function (topic, colSettings) {
    this.setColumnSettings(colSettings);
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
  PVGrid.prototype.setTotalRecords = function (totalRecords) {
    this.setState({ totalRecords: totalRecords });
  };
  return PVGrid;
})(PontusComponent);
export default PVGrid;
//# sourceMappingURL=PVGrid.js.map
