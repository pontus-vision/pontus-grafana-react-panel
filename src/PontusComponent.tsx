import React from 'react';
// import i18next from 'i18next';
// import { useTranslation } from 'react-i18next';
import i18next, { getDefaultLang } from './i18n';
// let d3 = window.d3;
import PubSub from 'pubsub-js';
import { CancelTokenSource } from 'axios';

// import * as d3 from "d3";

export interface PubSubCallback extends Function {
  (topic: string, data: any): void;
}

// const { t, i18n } = useTranslation();

class PontusComponent<T, S> extends React.PureComponent<T, S> {
  protected url: string;
  protected req: CancelTokenSource | undefined;
  protected errorCounter: number;
  protected hRequest: any | undefined;

  constructor(props: Readonly<any>) {
    super(props);
    this.errorCounter = 0;
    this.url = PontusComponent.getGraphURL(props);
  }

  // static getColorScale(minVal, maxVal)
  // {
  //   return scaleLinear.linear()
  //     .domain([minVal, (maxVal - minVal) / 2, maxVal])
  //     .range(['green', 'orange', 'red']);
  //
  // }
  private topics: Record<string, number> = {};
  private callbacksPerTopic: Record<string, PubSubCallback[]> = {};

  on(topic: string, callback: PubSubCallback) {
    if (!this.topics[topic]) {
      this.topics[topic] = 0;
    }
    if (!this.callbacksPerTopic[topic]) {
      this.callbacksPerTopic[topic] = [];
    }
    if (!this.callbacksPerTopic[topic].some((currCallback) => currCallback === callback)) {
      PubSub.subscribe(topic, callback);
      this.callbacksPerTopic[topic].push(callback);
      this.topics[topic]++;
    }
  }

  off(topic: string, callback: PubSubCallback) {
    if (!this.topics[topic]) {
      return;
    }

    const found = this.callbacksPerTopic[topic].findIndex((currCallback) => currCallback === callback);
    if (found === -1) {
      return;
    }

    PubSub.unsubscribe(callback);

    this.callbacksPerTopic[topic].splice(found, 1);

    this.topics[topic]--;
  }
  emit(topic: string, data: any) {
    PubSub.publish(topic, data);
  }

  static recursiveSplitTranslateJoin(itemToSplit: string, splitArrayPattern: string[]): string {
    const localSplitArrayPattern = Array.from(splitArrayPattern);
    const splitPattern = localSplitArrayPattern.shift();
    if (!splitPattern) {
      return i18next.t(itemToSplit);
    }

    const splitItem = itemToSplit.split(splitPattern ? splitPattern : '');
    for (let i = 0; i < splitItem.length; i++) {
      splitItem[i] = PontusComponent.recursiveSplitTranslateJoin(splitItem[i], localSplitArrayPattern);
    }

    const rejoined = splitItem.join(splitPattern);

    return PontusComponent.recursiveSplitTranslateJoin(rejoined, localSplitArrayPattern);
  }

  static t(str: string, conf: string[] | undefined = undefined): string | undefined {
    if (!conf) {
      return i18next.t(str);
    } else {
      return PontusComponent.recursiveSplitTranslateJoin(str, conf);
    }
  }

  static b64DecodeUnicode(str: string): string {
    return decodeURIComponent(
      Array.prototype.map
        .call(atob(str), (c) => {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join('')
    );
  }

  static escapeHTML(unsafeText: string): string {
    const div = document.createElement('div');
    div.innerText = unsafeText;
    let retVal = PontusComponent.replaceAll('<br>', '<br/>', div.innerHTML);
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
  }

  static replaceAll(searchString: string, replaceString: string, str: string): string {
    if (str.split) {
      return str.split(searchString).join(replaceString);
    }
    return str;
  }

  static getGraphURL(props: any): string {
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
  }

  static getRestEdgeLabelsURL(props: any): string {
    return PontusComponent.getURLGeneric(
      props,
      'pvgdpr_gui',
      'pvgdpr_server/home/edge_labels',
      '/gateway/sandbox/pvgdpr_server/home/edge_labels'
    );
  }

  static getRestVertexLabelsURL(props: any): string {
    return PontusComponent.getURLGeneric(
      props,
      'pvgdpr_gui',
      'pvgdpr_server/home/vertex_labels',
      '/gateway/sandbox/pvgdpr_server/home/vertex_labels'
    );
  }

  static getRestNodePropertyNamesURL(props: any): string {
    return PontusComponent.getURLGeneric(
      props,
      'pvgdpr_gui',
      'pvgdpr_server/home/node_property_names',
      '/gateway/sandbox/pvgdpr_server/home/node_property_names'
    );
  }

  static getRestURL(props: any): string {
    return PontusComponent.getURLGeneric(
      props,
      'pvgdpr_gui',
      'pvgdpr_server/home/records',
      '/gateway/sandbox/pvgdpr_server/home/records'
    );
  }

  static getRestUrlAg(props: any): string {
    return PontusComponent.getURLGeneric(
      props,
      'pvgdpr_gui',
      'pvgdpr_server/home/agrecords',
      '/gateway/sandbox/pvgdpr_server/home/agrecords'
    );
  }

  static getURLGeneric(props: any, pvgdprGuiStr: string, defaultSuffix: string, defaultSandbox: string): string {
    if (props.url && props.url.length > 0) {
      return props.url;
    } else if (window.location && window.location.pathname) {
      const pvgdprGuiIndex = window.location.pathname.indexOf(pvgdprGuiStr);
      if (pvgdprGuiIndex > 0) {
        const retVal = window.location.pathname.substr(0, pvgdprGuiIndex);
        return retVal.concat(defaultSuffix);
      }
    } else if (props.baseURI) {
      if (props.ownerDocument && props.ownerDocument.origin) {
        const uri = props.baseURI;
        const pvgdprGuiIndex = uri.indexOf(pvgdprGuiStr);

        if (pvgdprGuiIndex > 0) {
          const originLen = props.ownerDocument.origin.length();
          const retVal = uri.substr(originLen, pvgdprGuiIndex);

          return retVal.concat(defaultSuffix);
        }
      }
    }

    return defaultSandbox;
  }

  getColorBasedOnLabel = (vLabel: string) => {
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

  stringify = (obj: object) => {
    let cache: any[] = [];

    const stringifyFilter = (key: string, value: any) => {
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

    const state = JSON.stringify(obj, stringifyFilter);
    cache = [];

    return state;
  };

  static setItem(key: string, val: any) {
    localStorage.setItem(getDefaultLang() + key, val);
  }

  static getItem(key: string, defVal: any | undefined = undefined): string | null {
    let retVal = localStorage.getItem(getDefaultLang() + key);
    if (!retVal && defVal) {
      PontusComponent.setItem(key, defVal);
      retVal = defVal;
    }
    return retVal;
  }
}

export default PontusComponent;
