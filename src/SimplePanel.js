import { __extends } from "tslib";
import React, { PureComponent } from 'react';
import './App.css';
import PVGrid from './PVGrid';
var SimplePanel = /** @class */ (function (_super) {
    __extends(SimplePanel, _super);
    function SimplePanel(props) {
        var _this = _super.call(this, props) || this;
        _this.state = {
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
        };
        return _this;
    }
    SimplePanel.prototype.render = function () {
        var _a = this.props, options = _a.options, data = _a.data, width = _a.width, height = _a.height;
        // const { columnDefs, rowData } = this.state as SimplePanelState;
        // @ts-ignore
        return (React.createElement("div", { style: {
                position: 'relative',
                width: width,
                height: height,
            } },
            React.createElement("div", { className: "ag-theme-balham", style: {
                    height: '100%',
                    width: '100%',
                } },
                React.createElement(PVGrid, { namespace: "test", customFilter: undefined, mountedSuccess: true, settings: undefined, subNamespace: undefined })),
            React.createElement("div", { style: {
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    padding: '10px',
                } },
                React.createElement("div", null,
                    "Count: ",
                    data.series.length),
                React.createElement("div", null, options.text))));
    };
    return SimplePanel;
}(PureComponent));
export { SimplePanel };
//# sourceMappingURL=SimplePanel.js.map