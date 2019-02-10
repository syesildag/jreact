/**
 * @author Serkan YESILDAG
 */
namespace Functions {
  'use strict';

  export interface Constructor<T> {
    new (...args: Array<any>): T;
  }

  export interface Supplier<T> {
    supply(): T;
  }

  export interface ToString<T> {
    ( item: T ): string;
  }

  export interface Interceptor<T> {
    intercept( ctx: T ): any;
  }

  export interface Init {
    init(): void;
  }
}