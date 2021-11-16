import React from 'react';
// import i18next from 'i18next';
// import { useTranslation } from 'react-i18next';
import i18next, { getDefaultLang } from './i18n';
// let d3 = window.d3;
import PubSub from 'pubsub-js';
import axios, { CancelTokenSource } from 'axios';
import { getTheme } from '@grafana/ui';
import { GrafanaTheme } from '@grafana/data';
import { config } from '@grafana/runtime';

// import * as d3 from "d3";

export interface PubSubCallback extends Function {
  (topic: string, data: any): void;
}

// const { t, i18n } = useTranslation();

class PontusComponent<T, S> extends React.PureComponent<T, S> {
  protected url: string;
  protected req: CancelTokenSource | undefined;
  protected request: any;
  protected errorCounter: number;
  protected hRequest?: NodeJS.Timeout;
  protected theme: GrafanaTheme;
  protected oauth: any;
  // }
  private topics: Record<string, number> = {};

  // static getColorScale(minVal, maxVal)
  // {
  //   return scaleLinear.linear()
  //     .domain([minVal, (maxVal - minVal) / 2, maxVal])
  //     .range(['green', 'orange', 'red']);
  //
  private callbacksPerTopic: Record<string, PubSubCallback[]> = {};

  constructor(props: Readonly<any>) {
    super(props);
    this.errorCounter = 0;
    this.url = PontusComponent.getGraphURL(props);
    this.theme = getTheme();
    this.oauth = config.oauth;
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

  static decode = (str: string): string => Buffer.from(str, 'base64').toString('binary');

  static b64DecodeUnicode(str: string): string {
    return decodeURIComponent(
      Array.prototype.map
        .call(PontusComponent.decode(str), (c) => {
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
    return PontusComponent.getURLGeneric(props, 'home/gremlin');
  }

  static getRestEdgeLabelsURL(props: any): string {
    return PontusComponent.getURLGeneric(props, `home/edge_labels`);
  }

  static isLocalhost(): boolean {
    return window?.location?.hostname === 'localhost' || window?.location?.hostname === '127.0.0.1';
  }

  static getRestVertexLabelsURL(props: any): string {
    return PontusComponent.getURLGeneric(props, `home/vertex_labels`);
  }

  static getRestNodePropertyNamesURL(props: any): string {
    return PontusComponent.getURLGeneric(props, 'home/node_property_names');
  }

  static getRestURL(props: any): string {
    return PontusComponent.getURLGeneric(props, 'home/records');
  }

  static getRestUrlAg(props: any): string {
    return PontusComponent.getURLGeneric(props, 'home/agrecords');
  }

  static getURLGeneric(props: any, defaultSuffix: string): string {
    const pvgdprGuiStr = 'pvgdpr_gui';
    if (props.url && props.url.length > 0) {
      return props.url;
    } else if (window.location && window.location.pathname) {
      const pvgdprGuiIndex = window.location.pathname.indexOf(pvgdprGuiStr);
      if (pvgdprGuiIndex > 0) {
        const retVal = window.location.pathname.substr(0, pvgdprGuiIndex);
        return retVal.concat(`${PontusComponent.isLocalhost() ? 'pvgdpr_server/' : ''}${defaultSuffix}`);
      }
    }
    // else if (props.baseURI) {
    //   if (props.ownerDocument && props.ownerDocument.origin) {
    //     const uri = props.baseURI;
    //     const pvgdprGuiIndex = uri.indexOf(pvgdprGuiStr);
    //
    //     if (pvgdprGuiIndex > 0) {
    //       const originLen = props.ownerDocument.origin.length();
    //       const retVal = uri.substr(originLen, pvgdprGuiIndex);
    //
    //       return retVal.concat(`${PontusComponent.isLocalhost() ? 'pvgdpr_server/' : ''}${defaultSuffix}`);
    //     } else {
    //       return uri;
    //     }
    //   }
    // }
    return `${PontusComponent.getUrlPrefix()}/${defaultSuffix}`;
  }

  static getUrlPrefix(): string {
    const proto = `${window.location.protocol || 'http:'}//`;
    const portStr = window.location.port;
    const port = portStr ? `:${portStr}` : '';

    const host = `${window.location.hostname || 'localhost'}`;
    const prefix = `${proto}${host}${port}`;
    const middle = `${PontusComponent.isLocalhost() ? '/gateway/sandbox/pvgdpr_server' : ''}`;

    return `${prefix}${middle}`;
  }

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

  ensureData = (id1: any, id2?: any) => {
    if (this.req) {
      this.req.cancel();
    }

    let url = this.url;
    if (this.hRequest) {
      clearTimeout(this.hRequest);
    }

    let self = this;

    this.hRequest = setTimeout(() => {
      let CancelToken = axios.CancelToken;
      self.req = CancelToken.source();

      // http.post(url)
      axios
        .post(url, self.getQuery(id1, id2), {
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
          cancelToken: self.req.token,
        })
        .then(this.onSuccess)
        .catch((thrown) => {
          if (axios.isCancel(thrown)) {
            console.log('Request canceled', thrown.message);
          } else {
            this.onError(undefined, thrown);
          }
        });
    }, 50);
  };

  onSuccess = (resp: any) => {};

  onError = (event: any, thrown: Error) => {};

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

  protected getQuery = (eventId: any, id2?: any): { bindings: Record<string, any>; gremlin: string } => {
    return { bindings: { hello: 'world' }, gremlin: '' };
  };
}

export default PontusComponent;
