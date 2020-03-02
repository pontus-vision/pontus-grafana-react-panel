import { __assign, __extends } from "tslib";
import React, { PureComponent } from 'react';
import { FormField } from '@grafana/ui';
var SimpleEditor = /** @class */ (function (_super) {
    __extends(SimpleEditor, _super);
    function SimpleEditor() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.onTextChanged = function (_a) {
            var target = _a.target;
            _this.props.onOptionsChange(__assign(__assign({}, _this.props.options), { text: target.value }));
        };
        return _this;
    }
    SimpleEditor.prototype.render = function () {
        var options = this.props.options;
        return (React.createElement("div", { className: "section gf-form-group" },
            React.createElement("h5", { className: "section-heading" }, "Display"),
            React.createElement(FormField, { label: "Text", labelWidth: 5, inputWidth: 20, type: "text", onChange: this.onTextChanged, value: options.text || '' })));
    };
    return SimpleEditor;
}(PureComponent));
export { SimpleEditor };
//# sourceMappingURL=SimpleEditor.js.map