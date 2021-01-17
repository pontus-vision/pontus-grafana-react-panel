import { __assign, __extends } from 'tslib';
import React from 'react';
import Creatable from 'react-select/creatable';
// Be sure to include styles at some point, probably during your bootstrapping
import PontusComponent from './PontusComponent';
import Axios from 'axios';
var PVGremlinComboBox = /** @class */ (function (_super) {
  __extends(PVGremlinComboBox, _super);
  function PVGremlinComboBox(props) {
    var _this = _super.call(this, props) || this;
    _this.getOptions = function (jsonRequest) {
      if (jsonRequest) {
        var reqToSave = jsonRequest;
        if (typeof jsonRequest === 'object') {
          reqToSave = JSON.stringify(jsonRequest);
        }
        PontusComponent.setItem(_this.props.namespace + '.optionsJsonRequest', reqToSave);
      }
      var url = _this.props.url ? _this.props.url : PontusComponent.getRestVertexLabelsURL(_this.props);
      if (_this.req) {
        _this.req.cancel();
      }
      var CancelToken = Axios.CancelToken;
      _this.req = CancelToken.source();
      Axios.post(url, jsonRequest, {
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
          if (Axios.isCancel(thrown)) {
            console.log('Request canceled', thrown.message);
          } else {
            _this.onError(thrown);
          }
        });
      // return retVal;
    };
    _this.onError = function (err) {
      if (_this.props.onError) {
        _this.props.onError(err);
      } else {
        console.error('error loading pages ' + err);
      }
    };
    _this.onChange = function (value) {
      _this.setState({
        value: value,
      });
      PontusComponent.setItem(_this.props.namespace + '-value', JSON.stringify(value));
      if (_this.props.onChange) {
        _this.props.onChange(value);
        // this.reactSelect.setFocus();
      }
    };
    _this.req = undefined;
    if (!_this.props.url) {
      throw new Error('must set the URL to forward requests');
    }
    var lastValStr = PontusComponent.getItem(_this.props.namespace + '-value');
    // let optionsStr = PontusComponent.getItem(`${this.props.namespace}-options`);
    var lastVal = null;
    if (lastValStr) {
      lastVal = JSON.parse(lastValStr);
    } else {
      lastVal = lastVal ? lastVal : _this.props.value ? _this.props.value : _this.props.multi ? [] : {};
      // let options = (!this.props.options) ? this.props.multi ? lastVal : [lastVal] : this.props.options;
    }
    lastVal = lastVal ? lastVal : _this.props.value ? _this.props.value : _this.props.multi ? [] : {};
    var options = !_this.props.options ? (_this.props.multi ? lastVal : [lastVal]) : _this.props.options;
    _this.state = __assign(__assign({}, props), {
      value: lastVal,
      // ,options: [{label : "one", value: "one"}, {label: "two", value: "two"}]
      options: options,
    });
    return _this;
  }
  PVGremlinComboBox.prototype.componentDidMount = function () {
    /* you can pass config as prop, or use a predefined one */
    var savedReq = PontusComponent.getItem(this.props.namespace + '.optionsJsonRequest');
    try {
      if (savedReq) {
        savedReq = JSON.parse(savedReq);
      } else {
        savedReq = this.props.optionsRequest;
      }
    } catch (e) {}
    this.getOptions(savedReq);
  };
  PVGremlinComboBox.prototype.componentWillUnmount = function () {
    // this.props.glEventHub.off('pvgrid-on-data-loaded', this.onDataLoadedCb);
  };
  PVGremlinComboBox.prototype.render = function () {
    var customStyles = {
      option: function (provided, state) {
        return __assign(__assign({}, provided), { color: 'black', padding: 2 });
      },
      singleValue: function (provided, state) {
        var opacity = state.isDisabled ? 0.5 : 1;
        var transition = 'opacity 300ms';
        return __assign(__assign({}, provided), { opacity: opacity, transition: transition });
      },
    };
    // multi={this.props.multi === null ? true : this.props.multi}
    return React.createElement(Creatable, {
      name: this.props.name || 'form-field-name',
      // key={this.state.value}
      defaultValue: this.state.value,
      isMulti: this.props.multi === null ? true : this.props.multi,
      isClearable: true,
      options: this.state.options,
      joinValues: true,
      delimiter: ',',
      onChange: this.onChange,
      placeholder: this.state.placeholder,
      styles: customStyles,
    });
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
  return PVGremlinComboBox;
})(PontusComponent);
export default PVGremlinComboBox;
//# sourceMappingURL=PVGremlinComboBox.js.map
