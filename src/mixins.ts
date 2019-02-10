/// <reference path="./functions.ts"/>

/**
 * @author Serkan YESILDAG
 */
namespace Mixins {
  'use strict';

  export function Named<T extends Functions.Constructor<any>>(Base: T) {
    return class extends Base {
      private _name: string;
      constructor(...args: any[]) {
        super(...args);
      }

      public getName() {
        return this._name;
      }

      public setName(_name: string) {
        this._name = _name;
      }
    }
  }
}