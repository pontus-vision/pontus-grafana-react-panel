import { __assign, __extends } from "tslib";
import React from 'react';
import { Button, Portal, Segment } from 'semantic-ui-react';
import PVReportButton from './PVReportButton';
// import PVDatamaps from './PVDatamaps';
var PVGridReportButtonCellRenderer = /** @class */ (function (_super) {
    __extends(PVGridReportButtonCellRenderer, _super);
    function PVGridReportButtonCellRenderer(props) {
        var _this = _super.call(this, props) || this;
        _this.onClick = function () {
            _this.ensureData(_this.state.contextId, _this.state.templateText);
        };
        var parsedStaticData = props.colDef.id.split('@');
        _this.state = __assign(__assign({ colDef: undefined, node: undefined, open: false, preview: '' }, props), { buttonLabel: parsedStaticData[1].substring(1, parsedStaticData[1].length - 1), contextId: props.node && props.node.data ? props.node.data.id : undefined, templateText: parsedStaticData[2].substring(1, parsedStaticData[2].length - 1) });
        return _this;
        // this.state.context
    }
    PVGridReportButtonCellRenderer.prototype.render = function () {
        return (React.createElement("div", null,
            React.createElement(Button, { className: 'compact', style: {
                    border: 0,
                    background: 'dodgerblue',
                    marginRight: '3px',
                    borderRadius: '5px',
                    height: '24px',
                }, size: 'small', onClick: this.onClick }, this.state.buttonLabel),
            React.createElement(Portal, { onClose: this.handleClose, open: this.state.open },
                React.createElement(Segment, { style: {
                        height: '50%',
                        width: '50%',
                        overflowX: 'auto',
                        overflowY: 'auto',
                        left: '30%',
                        position: 'fixed',
                        top: '20%',
                        zIndex: 100000,
                        backgroundColor: '#696969',
                        padding: '10px',
                    } },
                    React.createElement("div", { dangerouslySetInnerHTML: { __html: this.state.preview } })))));
    };
    return PVGridReportButtonCellRenderer;
}(PVReportButton));
export default PVGridReportButtonCellRenderer;
//# sourceMappingURL=PVGridReportButtonCellRenderer.js.map