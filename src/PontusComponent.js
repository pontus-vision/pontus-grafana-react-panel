import { __extends } from 'tslib';
import React from 'react';
// import i18next from 'i18next';
// import { useTranslation } from 'react-i18next';
import i18next, { getDefaultLang } from './i18n';
// let d3 = window.d3;
import PubSub from 'pubsub-js';
// const { t, i18n } = useTranslation();
var PontusComponent = /** @class */ (function (_super) {
  __extends(PontusComponent, _super);
  function PontusComponent(props) {
    var _this = _super.call(this, props) || this;
    // static getColorScale(minVal, maxVal)
    // {
    //   return scaleLinear.linear()
    //     .domain([minVal, (maxVal - minVal) / 2, maxVal])
    //     .range(['green', 'orange', 'red']);
    //
    // }
    _this.topics = {};
    _this.getColorBasedOnLabel = function (vLabel) {
      if (vLabel.toUpperCase().startsWith('P')) {
        return '#440000';
      }
      if (vLabel.toUpperCase().startsWith('O')) {
        return '#0099cc';
      }
      if (vLabel.toUpperCase().startsWith('L')) {
        return '#ffaa00';
      }
      if (vLabel.toUpperCase().startsWith('E')) {
        return '#004433';
      }
      return '#595959';
    };
    _this.stringify = function (obj) {
      var cache = [];
      var stringifyFilter = function (key, value) {
        if (key === 'chartInstance' || key === 'canvas' || key === 'chart') {
          return;
        }
        if (typeof value === 'object' && value !== null) {
          if (cache && cache.indexOf(value) !== -1) {
            // Duplicate reference found
            try {
              // If this value does not reference a parent it can be deduped
              return JSON.parse(JSON.stringify(value));
            } catch (error) {
              // discard key if value cannot be deduped
              return;
            }
          }
          // Store value in our collection
          cache.push(value);
        }
        return value;
      };
      var state = JSON.stringify(obj, stringifyFilter);
      cache = [];
      return state;
    };
    _this.errorCounter = 0;
    _this.url = PontusComponent.getGraphURL(props);
    return _this;
  }
  PontusComponent.prototype.on = function (topic, callback) {
    if (!this.topics[topic]) {
      this.topics[topic] = 0;
    }
    PubSub.subscribe(topic, callback);
    this.topics[topic]++;
  };
  PontusComponent.prototype.off = function (topic, callback) {
    if (!this.topics[topic]) {
      return;
    }
    PubSub.unsubscribe(callback);
    this.topics[topic]--;
  };
  PontusComponent.prototype.emit = function (topic, data) {
    PubSub.publish(topic, data);
  };
  PontusComponent.recursiveSplitTranslateJoin = function (itemToSplit, splitArrayPattern) {
    var localSplitArrayPattern = Array.from(splitArrayPattern);
    var splitPattern = localSplitArrayPattern.shift();
    if (!splitPattern) {
      return i18next.t(itemToSplit);
    }
    var splitItem = itemToSplit.split(splitPattern ? splitPattern : '');
    for (var i = 0; i < splitItem.length; i++) {
      splitItem[i] = PontusComponent.recursiveSplitTranslateJoin(splitItem[i], localSplitArrayPattern);
    }
    var rejoined = splitItem.join(splitPattern);
    return PontusComponent.recursiveSplitTranslateJoin(rejoined, localSplitArrayPattern);
  };
  PontusComponent.t = function (str, conf) {
    if (conf === void 0) {
      conf = undefined;
    }
    if (!conf) {
      return i18next.t(str);
    } else {
      return PontusComponent.recursiveSplitTranslateJoin(str, conf);
    }
  };
  PontusComponent.b64DecodeUnicode = function (str) {
    return decodeURIComponent(
      Array.prototype.map
        .call(atob(str), function (c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join('')
    );
  };
  PontusComponent.escapeHTML = function (unsafeText) {
    var div = document.createElement('div');
    div.innerText = unsafeText;
    var retVal = PontusComponent.replaceAll('<br>', '<br/>', div.innerHTML);
    retVal = PontusComponent.replaceAll('\\"', "'", retVal);
    retVal = PontusComponent.replaceAll('\\r\\n', '<br/>', retVal);
    retVal = PontusComponent.replaceAll('\\n', '<br/>', retVal);
    retVal = PontusComponent.replaceAll('\\t', '  ', retVal);
    retVal = PontusComponent.replaceAll('"[', '[', retVal);
    retVal = PontusComponent.replaceAll(']"', ']', retVal);
    retVal = PontusComponent.replaceAll('&nbsp;', ' ', retVal);
    // retVal = retVal.replace(/(&#(\d+);)/g, function (match, capture, charCode)
    // {
    //   return String.fromCharCode(charCode);
    // });
    return retVal;
  };
  PontusComponent.replaceAll = function (searchString, replaceString, str) {
    return str.split(searchString).join(replaceString);
  };
  PontusComponent.getGraphURL = function (props) {
    // if (props.url)
    // {
    //   return props.url;
    // }
    // else if (props.baseURI)
    // {
    //   if (props.ownerDocument && props.ownerDocument.origin)
    //   {
    //     let uri = props.baseURI;
    //     let pvgdprGuiIndex = uri.indexOf('pvgdpr_gui');
    //
    //     if (pvgdprGuiIndex > 0)
    //     {
    //
    //       let originLen = props.ownerDocument.origin.length();
    //       let retVal = uri.substr(originLen, pvgdprGuiIndex);
    //
    //       retVal.concat('pvgdpr_graph');
    //
    //       return retVal;
    //     }
    //   }
    // }
    // return "/gateway/sandbox/pvgdpr_graph";
    return PontusComponent.getURLGeneric(props, 'pvgdpr_gui', 'pvgdpr_graph', '/gateway/sandbox/pvgdpr_graph');
  };
  PontusComponent.getRestEdgeLabelsURL = function (props) {
    return PontusComponent.getURLGeneric(
      props,
      'pvgdpr_gui',
      'pvgdpr_server/home/edge_labels',
      '/gateway/sandbox/pvgdpr_server/home/edge_labels'
    );
  };
  PontusComponent.getRestVertexLabelsURL = function (props) {
    return PontusComponent.getURLGeneric(
      props,
      'pvgdpr_gui',
      'pvgdpr_server/home/vertex_labels',
      '/gateway/sandbox/pvgdpr_server/home/vertex_labels'
    );
  };
  PontusComponent.getRestNodePropertyNamesURL = function (props) {
    return PontusComponent.getURLGeneric(
      props,
      'pvgdpr_gui',
      'pvgdpr_server/home/node_property_names',
      '/gateway/sandbox/pvgdpr_server/home/node_property_names'
    );
  };
  PontusComponent.getRestURL = function (props) {
    return PontusComponent.getURLGeneric(
      props,
      'pvgdpr_gui',
      'pvgdpr_server/home/records',
      '/gateway/sandbox/pvgdpr_server/home/records'
    );
  };
  PontusComponent.getRestUrlAg = function (props) {
    return PontusComponent.getURLGeneric(
      props,
      'pvgdpr_gui',
      'pvgdpr_server/home/agrecords',
      '/gateway/sandbox/pvgdpr_server/home/agrecords'
    );
  };
  PontusComponent.getURLGeneric = function (props, pvgdprGuiStr, defaultSuffix, defaultSandbox) {
    if (props.url) {
      return props.url;
    } else if (window.location && window.location.pathname) {
      var pvgdprGuiIndex = window.location.pathname.indexOf(pvgdprGuiStr);
      if (pvgdprGuiIndex > 0) {
        var retVal = window.location.pathname.substr(0, pvgdprGuiIndex);
        return retVal.concat(defaultSuffix);
      }
    } else if (props.baseURI) {
      if (props.ownerDocument && props.ownerDocument.origin) {
        var uri = props.baseURI;
        var pvgdprGuiIndex = uri.indexOf(pvgdprGuiStr);
        if (pvgdprGuiIndex > 0) {
          var originLen = props.ownerDocument.origin.length();
          var retVal = uri.substr(originLen, pvgdprGuiIndex);
          return retVal.concat(defaultSuffix);
        }
      }
    }
    return defaultSandbox;
  };
  PontusComponent.setItem = function (key, val) {
    localStorage.setItem(getDefaultLang() + key, val);
  };
  PontusComponent.getItem = function (key, defVal) {
    if (defVal === void 0) {
      defVal = undefined;
    }
    var retVal = localStorage.getItem(getDefaultLang() + key);
    if (!retVal && defVal) {
      PontusComponent.setItem(key, defVal);
      retVal = defVal;
    }
    return retVal;
  };
  return PontusComponent;
})(React.Component);
export default PontusComponent;
//# sourceMappingURL=PontusComponent.js.map
