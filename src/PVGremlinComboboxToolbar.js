import { __assign, __extends } from "tslib";
import React from 'react';
// Be sure to include styles at some point, probably during your bootstrapping
import axios from 'axios';
import PontusComponent from './PontusComponent';
import PVGremlinComboBox from './PVGremlinComboBox';
import CreatableSelect from 'react-select/creatable';
// import 'semantic-ui-css/semantic.min.css';
// import ResizeAware from 'react-resize-aware';
var PVGremlinComboboxToolbar = /** @class */ (function (_super) {
    __extends(PVGremlinComboboxToolbar, _super);
    function PVGremlinComboboxToolbar(props) {
        var _this = _super.call(this, props) || this;
        _this.getOptions = function (jsonRequest) {
            if (jsonRequest === void 0) { jsonRequest = undefined; }
            var url = _this.props.url ? _this.props.url : PontusComponent.getRestNodePropertyNamesURL(_this.props);
            if (_this.req) {
                _this.req.cancel();
            }
            var CancelToken = axios.CancelToken;
            _this.req = CancelToken.source();
            axios
                .post(url, jsonRequest, {
                headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
                cancelToken: _this.req.token,
            })
                .then(function (response) {
                // this.reactSelect.options = response.data.labels || [];
                if (response.data && response.data.labels) {
                    for (var i = 0; i < response.data.labels.length; i++) {
                        var lbl = response.data.labels[i];
                        lbl.label = PontusComponent.t(lbl.label);
                    }
                    _this.setState({
                        options: response.data.labels,
                    });
                }
                // callback(null, {
                //   options: response.data.labels || [],
                //   complete: true
                //
                // });
            })
                .catch(function (thrown) {
                if (axios.isCancel(thrown)) {
                    console.log('Request canceled', thrown.message);
                }
                else {
                    _this.onError(thrown);
                }
            });
            // return retVal;
        };
        _this.onChange = function (value) {
            if (value === void 0) { value = undefined; }
            _this.setState({
                value: value,
            });
            if (_this.props.onChange) {
                _this.props.onChange(value);
                // this.reactSelect.setFocus();
            }
        };
        _this.req = undefined;
        if (_this.props.url === null) {
            throw new Error('must set the URL to forward requests');
        }
        _this.state = {
            value: _this.props.multi ? [] : {},
            // ,options: [{label : "one", value: "one"}, {label: "two", value: "two"}]
            options: _this.props.options === null ? [] : _this.props.options,
        };
        return _this;
    }
    PVGremlinComboboxToolbar.prototype.componentDidMount = function () {
        /* you can pass config as prop, or use a predefined one */
        this.getOptions();
    };
    PVGremlinComboboxToolbar.prototype.componentWillUnmount = function () {
        // this.props.glEventHub.off('pvgrid-on-data-loaded', this.onDataLoadedCb);
    };
    PVGremlinComboboxToolbar.prototype.render = function () {
        // multi={this.props.multi === null ? true : this.props.multi}
        var customStyles = {
            option: function (provided, state) { return (__assign(__assign({}, provided), { color: 'black', padding: 2 })); },
            singleValue: function (provided, state) {
                var opacity = state.isDisabled ? 0.5 : 1;
                var transition = 'opacity 300ms';
                var top = '35%';
                return __assign(__assign({}, provided), { opacity: opacity, transition: transition, top: top });
            },
            container: function (provided, state) {
                var display = 'inline-block';
                var width = '20em';
                var height = '20px';
                var minHeight = '20px';
                var marginLeft = '2px';
                var marginRight = '2px';
                return __assign(__assign({}, provided), { display: display, width: width, height: height, minHeight: minHeight, marginLeft: marginLeft, marginRight: marginRight });
            },
            control: function (provided, state) {
                // const display = 'inline-block';
                var width = '20em';
                var height = '20px';
                var minHeight = '20px';
                return __assign(__assign({}, provided), { width: width, height: height, minHeight: minHeight });
            },
            placeholder: function (provided, state) {
                // const display = 'inline-block';
                var width = '20em';
                var height = '20px';
                var minHeight = '20px';
                var fontSize = '12px';
                var top = '45%';
                return __assign(__assign({}, provided), { width: width, height: height, minHeight: minHeight, fontSize: fontSize, top: top });
            },
            input: function (provided, state) {
                // const display = 'inline-block';
                var width = '20em';
                var height = '20px';
                var minHeight = '20px';
                var fontSize = '12px';
                var top = '25%';
                var margin = '0px'; /* margin: 2px; */
                var paddingBottom = '0px'; /* padding-bottom: 2px; */
                var paddingTop = '1px'; /* padding-top: 2px; */
                return __assign(__assign({}, provided), { width: width, height: height, minHeight: minHeight, fontSize: fontSize, top: top, margin: margin, paddingBottom: paddingBottom, paddingTop: paddingTop });
            },
            indicatorsContainer: function (provided, state) {
                var height = '20px';
                var minHeight = '20px';
                var fontSize = '12px';
                var top = '25%';
                return __assign(__assign({}, provided), { height: height, minHeight: minHeight, fontSize: fontSize, top: top });
            },
        };
        /*
         <CreatableSelect
         options={this.state.options}
         placeholder='Select Label'
         styles={customStyles}
         />
         */
        return (React.createElement(CreatableSelect, { name: this.props.name || 'form-field-name', key: this.state.value ? this.state.value.length : 0, value: this.state.value, isMulti: this.props.multi === null ? true : this.props.multi, isClearable: true, options: this.state.options, joinValues: true, delimiter: ',', onChange: this.onChange, placeholder: this.props.placeholder, styles: customStyles }));
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
    return PVGremlinComboboxToolbar;
}(PVGremlinComboBox));
export default PVGremlinComboboxToolbar;
//# sourceMappingURL=PVGremlinComboboxToolbar.js.map