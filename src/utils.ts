module Utils {
  'use strict';

  export function uuid(): string {
    /*jshint bitwise:false */
    var i: number, random: number;
    var uuid = '';

    for (i = 0; i < 32; i++) {
      random = Math.random() * 16 | 0;
      if (i === 8 || i === 12 || i === 16 || i === 20) {
        uuid += '-';
      }
      uuid += (i === 12 ? 4 : (i === 16 ? (random & 3 | 8) : random))
        .toString(16);
    }

    return uuid;
  }

  export function pluralize(count: number, word: string) {
    return count === 1 ? word : word + 's';
  }

  export function store(namespace: string, data: any): void;
  export function store(namespace: string): any;
  export function store(namespace: string, data?: any): any {
    if (data)
      return localStorage.setItem(namespace, JSON.stringify(data));

    var store = localStorage.getItem(namespace);
    return store ? JSON.parse(store) : null;
  }

  export function extend() {
    var newObj: any = {};
    for (var i = 0; i < arguments.length; i++) {
      var obj = arguments[i];
      for (var key in obj) {
        if (obj.hasOwnProperty(key)) {
          newObj[key] = obj[key];
        }
      }
    }
    return newObj;
  }
  
  /**
  * A consistent way of creating unique IDs in angular. The ID is a sequence of alpha numeric
  * characters such as '012ABC'. The reason why we are not using simply a number counter is that
  * the number string gets longer over time, and it can also overflow, where as the nextId
  * will grow much slower, it is a string, and it will never overflow.
  *
  * @returns {string} an unique alpha-numeric string
  */
  var uid = ['0', '0', '0'];
  export function nextUid() {
    var index = uid.length,
      digit: number;

    while (index--) {
      digit = uid[index].charCodeAt(0);
      if (digit == 57 /*'9'*/) {
        uid[index] = 'A';
        return uid.join('');
      }
      if (digit == 90  /*'Z'*/) {
        uid[index] = '0';
      } else {
        uid[index] = String.fromCharCode(digit + 1);
        return uid.join('');
      }
    }
    uid.unshift('0');
    return uid.join('');
  }

  const SPECIAL_CHARS_REGEXP = /([\:\-\_]+(.))/g;
  export function camelCase(name: string) {
    return name
      .replace(SPECIAL_CHARS_REGEXP, function(_, separator, letter, offset) {
        return offset ? letter.toUpperCase() : letter;
      });
  }

  const SNAKE_CASE_REGEXP = /[A-Z]/g;
  export function snake_case(name: string, separator: string) {
    separator = separator || '_';
    return name.replace(SNAKE_CASE_REGEXP, function(letter, pos) {
      return (pos ? separator : '') + letter.toLowerCase();
    });
  }
  
  // Returns a function, that, as long as it continues to be invoked, will not
  // be triggered. The function will be called after it stops being called for
  // N milliseconds. If `immediate` is passed, trigger the function on the
  // leading edge, instead of the trailing.
  export function debounce(func: (...a: any[]) => any, wait: any, immediate: boolean) {
    var timeout: number;
    return function debounced() {
      var context = this, args = arguments;
      clearTimeout(timeout);
      timeout = setTimeout(function() {
        timeout = null;
        if (!immediate) func.apply(context, args);
      }, wait);
      if (immediate && !timeout) func.apply(context, args);
    };
  }

  // Returns a function that can only be triggered every `delay` milliseconds.
  // In other words, the function will not be called unless it has been more
  // than `delay` milliseconds since the last call.
  export function throttle(func: (...a: any[]) => any, delay: number) {
    var recent: number;
    return function throttled() {
      var context = this;
      var args = arguments;
      var now: number = Utils.now();

      if (!recent || recent - now > delay) {
        func.apply(context, args);
        recent = now;
      }
    };
  }

  export const now: () => number = typeof window !== 'undefined' && window && window.performance ? window.performance.now.bind(window.performance) : Date.now;

  /**
   * @ngdoc function
   * @name angular.isUndefined
   * @module ng
   * @kind function
   *
   * @description
   * Determines if a reference is undefined.
   *
   * @param {*} value Reference to check.
   * @returns {boolean} True if `value` is undefined.
   */
  export function isUndefined(value: any) { return typeof value === 'undefined'; }

  /**
   * @ngdoc function
   * @name angular.isDefined
   * @module ng
   * @kind function
   *
   * @description
   * Determines if a reference is defined.
   *
   * @param {*} value Reference to check.
   * @returns {boolean} True if `value` is defined.
   */
  export function isDefined(value: any) { return typeof value !== 'undefined'; }

  /**
   * @ngdoc function
   * @name angular.isObject
   * @module ng
   * @kind function
   *
   * @description
   * Determines if a reference is an `Object`. Unlike `typeof` in JavaScript, `null`s are not
   * considered to be objects. Note that JavaScript arrays are objects.
   *
   * @param {*} value Reference to check.
   * @returns {boolean} True if `value` is an `Object` but not `null`.
   */
  export function isObject(value: any) { return value != null && typeof value === 'object'; }

  /**
   * @ngdoc function
   * @name angular.isString
   * @module ng
   * @kind function
   *
   * @description
   * Determines if a reference is a `String`.
   *
   * @param {*} value Reference to check.
   * @returns {boolean} True if `value` is a `String`.
   */
  export function isString(value: any) { return typeof value === 'string'; }

  /**
   * @ngdoc function
   * @name angular.isNumber
   * @module ng
   * @kind function
   *
   * @description
   * Determines if a reference is a `Number`.
   *
   * @param {*} value Reference to check.
   * @returns {boolean} True if `value` is a `Number`.
   */
  export function isNumber(value: any) { return typeof value === 'number'; }

  /**
   * @ngdoc function
   * @name angular.isDate
   * @module ng
   * @kind function
   *
   * @description
   * Determines if a value is a date.
   *
   * @param {*} value Reference to check.
   * @returns {boolean} True if `value` is a `Date`.
   */
  export function isDate(value: any) {
    return toString.call(value) === '[object Date]';
  }

  /**
   * @ngdoc function
   * @name angular.isFunction
   * @module ng
   * @kind function
   *
   * @description
   * Determines if a reference is a `Function`.
   *
   * @param {*} value Reference to check.
   * @returns {boolean} True if `value` is a `Function`.
   */
  export function isFunction(value: any) { return typeof value === 'function'; }

  /**
   * Determines if a value is a regular expression object.
   *
   * @private
   * @param {*} value Reference to check.
   * @returns {boolean} True if `value` is a `RegExp`.
   */
  export function isRegExp(value: any) {
    return toString.call(value) === '[object RegExp]';
  }

  export function isFile(obj: any) {
    return toString.call(obj) === '[object File]';
  }

  export function isBlob(obj: any) {
    return toString.call(obj) === '[object Blob]';
  }

  export function isBoolean(value: any) {
    return typeof value === 'boolean';
  }

  export function isPromiseLike(obj: any) {
    return obj && isFunction(obj.then);
  }
}
