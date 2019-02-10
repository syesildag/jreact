/// <reference path="functions.ts"/>

import * as Utils from './utils';

export enum TYPE {
  GET, POST, PUT, DELETE
}

class Ajax implements Functions.Supplier<JQueryXHR> {

  constructor(private settings: JQueryAjaxSettings) {
  }

  public supply() {
    return jQuery.ajax(this.settings);
  }
}

function getURL(url: string, params: any) {
  return url + '?' + jQuery.param(params);
}

function getByType(type: TYPE, url: string, params: any, settings: JQueryAjaxSettings): Ajax {
  let extendedSettings = Utils.extend(settings,
    {
      url: getURL(url, params),
      type: TYPE[type]
    } as JQueryAjaxSettings) as JQueryAjaxSettings;
  return new Ajax(extendedSettings);
}

export function get(url: string, params: any, settings: JQueryAjaxSettings): JQueryXHR {
  return getByType(TYPE.GET, url, params, settings).supply();
}

export function post(url: string, params: any, settings: JQueryAjaxSettings): JQueryXHR {
  return getByType(TYPE.POST, url, params, settings).supply();
}
