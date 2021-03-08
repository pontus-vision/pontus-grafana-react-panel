import { __extends, __values } from 'tslib';
import React from 'react';
import PVGremlinComboBox from './PVGremlinComboBox';
// import { Flex } from 'reflexbox';
import PontusComponent from './PontusComponent';
var PVGridColSelector = /** @class */ (function (_super) {
  __extends(PVGridColSelector, _super);
  function PVGridColSelector(props) {
    var _this = _super.call(this, props) || this;
    _this.onError = function (err) {
      console.error('error loading pages ' + err);
    };
    _this.onChangeVertexLabels = function (val) {
      // alert("got data " + val);
      // this.props.glEventHub.emit('userSearch-on-boxChanged')
      _this.nodePropertyNamesReactSelect.getOptions({ labels: val });
      _this.emit(_this.namespace + '-pvgrid-on-extra-search-changed', val);
    };
    _this.onChangeNodePropertyNames = function (val) {
      // alert("got data " + val);
      // this.props.columnSettings = [
      //   {id: "name", name: "Name", field: "name", sortable: true},
      //
      //   {id: "street", name: "Street", field: "street", sortable: true}
      // ];
      var colSettings = [];
      _this.propsSelected = [];
      if (val) {
        for (var i = 0, ilen = val.length; i < ilen; i++) {
          colSettings.push({ id: val[i].value, name: val[i].label, field: val[i].value, sortable: true });
          _this.propsSelected.push(val[i].value);
        }
      }
      // for (val)
      _this.emit(_this.namespace + '-pvgrid-on-col-settings-changed', colSettings);
    };
    _this.setObjNodePropertyNames = function (reactSelect) {
      _this.nodePropertyNamesReactSelect = reactSelect;
    };
    _this.req = undefined;
    _this.state = { checkedFuzzy: false };
    _this.nodePropertyNamesReactSelect = null;
    _this.propsSelected = [];
    _this.namespace = _this.props.namespace || '';
    return _this;
  }
  PVGridColSelector.prototype.render = function () {
    var e_1, _a;
    var nodeTypesVal = this.props.dataType
      ? {
          label: PontusComponent.replaceAll('.', ' ', PontusComponent.replaceAll('_', ' ', this.props.dataType)),
          value: this.props.dataType,
        }
      : {};
    var nodeTypesReq = { labels: nodeTypesVal };
    var propTypesVal = [];
    if (this.props.colSettings) {
      try {
        for (var _b = __values(this.props.colSettings), _c = _b.next(); !_c.done; _c = _b.next()) {
          var setting = _c.value;
          propTypesVal.push({ label: setting.name, value: setting.id });
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
    }
    //
    // return (    <View style={{
    //   flex: 1,
    //   width: '100%',
    //   height: '100%',
    //   flexWrap: 'wrap',
    // }}>
    //   <View style={{
    //     flex: 1,
    //     width: '100%',
    //     height: 100,
    //     flexGrow: 1,
    //   }} >
    //     <PVGremlinComboBox
    //       namespace={`${this.namespace}-node-types`}
    //       name="node-types"
    //       multi={false}
    //       onChange={this.onChangeVertexLabels}
    //       onError={this.onError}
    //       url={PontusComponent.getRestVertexLabelsURL(this.props)}
    //       placeholder={PontusComponent.t('Data Type')}
    //       // style={{width: "100%"}}
    //       value={nodeTypesVal}
    //     />
    //   </View>
    //   <View style={{
    //     flex: 1,
    //     width: '100%',
    //     height: 100,
    //     flexGrow: 1,
    //   }}>
    //   </View>
    //   <View style={{
    //     flex: 1,
    //     width: '100%',
    //     height: 100,
    //     flexGrow: 1,
    //   }} >
    //     <PVGremlinComboBox
    //       name="node-property-types"
    //       namespace={`${this.namespace}-node-property-types`}
    //       multi={true}
    //       onChange={this.onChangeNodePropertyNames}
    //       onError={this.onError}
    //       ref={this.setObjNodePropertyNames}
    //       url={PontusComponent.getRestNodePropertyNamesURL(this.props)}
    //       placeholder={PontusComponent.t('Columns')}
    //       optionsRequest={nodeTypesReq}
    //       value={propTypesVal}
    //     />
    //   </View>
    // </View>);
    return React.createElement(
      'div',
      { style: { width: '100%', height: '100%', flexDirection: 'column', display: 'flex' } },
      React.createElement(
        'div',
        { style: { display: 'block', width: '100%', padding: '10px' } },
        React.createElement(PVGremlinComboBox, {
          namespace: this.namespace + '-node-types',
          name: 'node-types',
          multi: false,
          onChange: this.onChangeVertexLabels,
          onError: this.onError,
          url: PontusComponent.getRestVertexLabelsURL(this.props),
          placeholder: PontusComponent.t('Data Type'),
          // style={{width: "100%"}}
          value: nodeTypesVal,
        })
      ),
      React.createElement(
        'div',
        { style: { display: 'block', width: '100%', padding: '10px' } },
        React.createElement(PVGremlinComboBox, {
          name: 'node-property-types',
          namespace: this.namespace + '-node-property-types',
          multi: true,
          onChange: this.onChangeNodePropertyNames,
          onError: this.onError,
          ref: this.setObjNodePropertyNames,
          url: PontusComponent.getRestNodePropertyNamesURL(this.props),
          placeholder: PontusComponent.t('Columns'),
          optionsRequest: nodeTypesReq,
          value: propTypesVal,
        })
      )
    );
  };
  return PVGridColSelector;
})(PontusComponent);
export default PVGridColSelector;
//# sourceMappingURL=PVGridColSelector.js.map
