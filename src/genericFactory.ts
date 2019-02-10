/// <reference path="./functions.ts"/>

/**
 * @author Serkan YESILDAG
 */
export interface ToString {
  toString(): string;
}

export interface Constructor<K, T extends Functions.Supplier<K>> {
  new(...args: Array<any>): T;
}

export abstract class Base<K extends ToString, T extends Functions.Supplier<K>> {
  private classMap: { [index: string]: Constructor<K, T> };

  constructor() {
    this.classMap = {};
    for (let clazz of this.getClassList()) {
      let key: K = new clazz().supply();
      this.classMap[key.toString()] = clazz;
    }
  }

  public create(key: K, ...args: Array<any>): T {
    let clazz = this.classMap[key.toString()];
    return new clazz(args);
  }

  protected getClassList(): Array<Constructor<K, T>> {
    return [];
  }
}
