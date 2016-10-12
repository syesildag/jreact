var Utils;
(function (Utils) {
    'use strict';
    function uuid() {
        /*jshint bitwise:false */
        var i, random;
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
    Utils.uuid = uuid;
    function pluralize(count, word) {
        return count === 1 ? word : word + 's';
    }
    Utils.pluralize = pluralize;
    function store(namespace, data) {
        if (data)
            return localStorage.setItem(namespace, JSON.stringify(data));
        var store = localStorage.getItem(namespace);
        return store ? JSON.parse(store) : null;
    }
    Utils.store = store;
    function extend() {
        var newObj = {};
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
    Utils.extend = extend;
    /**
    * A consistent way of creating unique IDs in angular. The ID is a sequence of alpha numeric
    * characters such as '012ABC'. The reason why we are not using simply a number counter is that
    * the number string gets longer over time, and it can also overflow, where as the nextId
    * will grow much slower, it is a string, and it will never overflow.
    *
    * @returns {string} an unique alpha-numeric string
    */
    var uid = ['0', '0', '0'];
    function nextUid() {
        var index = uid.length, digit;
        while (index--) {
            digit = uid[index].charCodeAt(0);
            if (digit == 57 /*'9'*/) {
                uid[index] = 'A';
                return uid.join('');
            }
            if (digit == 90 /*'Z'*/) {
                uid[index] = '0';
            }
            else {
                uid[index] = String.fromCharCode(digit + 1);
                return uid.join('');
            }
        }
        uid.unshift('0');
        return uid.join('');
    }
    Utils.nextUid = nextUid;
    var SPECIAL_CHARS_REGEXP = /([\:\-\_]+(.))/g;
    function camelCase(name) {
        return name
            .replace(SPECIAL_CHARS_REGEXP, function (_, separator, letter, offset) {
            return offset ? letter.toUpperCase() : letter;
        });
    }
    Utils.camelCase = camelCase;
    // Returns a function, that, as long as it continues to be invoked, will not
    // be triggered. The function will be called after it stops being called for
    // N milliseconds. If `immediate` is passed, trigger the function on the
    // leading edge, instead of the trailing.
    function debounce(func, wait, immediate) {
        var timeout;
        return function debounced() {
            var context = this, args = arguments;
            clearTimeout(timeout);
            timeout = setTimeout(function () {
                timeout = null;
                if (!immediate)
                    func.apply(context, args);
            }, wait);
            if (immediate && !timeout)
                func.apply(context, args);
        };
    }
    Utils.debounce = debounce;
    // Returns a function that can only be triggered every `delay` milliseconds.
    // In other words, the function will not be called unless it has been more
    // than `delay` milliseconds since the last call.
    function throttle(func, delay) {
        var recent;
        return function throttled() {
            var context = this;
            var args = arguments;
            var now = Utils.now();
            if (!recent || recent - now > delay) {
                func.apply(context, args);
                recent = now;
            }
        };
    }
    Utils.throttle = throttle;
    Utils.now = typeof window !== 'undefined' && window && window.performance ? window.performance.now.bind(window.performance) : Date.now;
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
    function isUndefined(value) { return typeof value === 'undefined'; }
    Utils.isUndefined = isUndefined;
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
    function isDefined(value) { return typeof value !== 'undefined'; }
    Utils.isDefined = isDefined;
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
    function isObject(value) { return value != null && typeof value === 'object'; }
    Utils.isObject = isObject;
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
    function isString(value) { return typeof value === 'string'; }
    Utils.isString = isString;
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
    function isNumber(value) { return typeof value === 'number'; }
    Utils.isNumber = isNumber;
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
    function isDate(value) {
        return toString.call(value) === '[object Date]';
    }
    Utils.isDate = isDate;
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
    function isFunction(value) { return typeof value === 'function'; }
    Utils.isFunction = isFunction;
    /**
     * Determines if a value is a regular expression object.
     *
     * @private
     * @param {*} value Reference to check.
     * @returns {boolean} True if `value` is a `RegExp`.
     */
    function isRegExp(value) {
        return toString.call(value) === '[object RegExp]';
    }
    Utils.isRegExp = isRegExp;
    function isFile(obj) {
        return toString.call(obj) === '[object File]';
    }
    Utils.isFile = isFile;
    function isBlob(obj) {
        return toString.call(obj) === '[object Blob]';
    }
    Utils.isBlob = isBlob;
    function isBoolean(value) {
        return typeof value === 'boolean';
    }
    Utils.isBoolean = isBoolean;
    function isPromiseLike(obj) {
        return obj && isFunction(obj.then);
    }
    Utils.isPromiseLike = isPromiseLike;
})(Utils || (Utils = {}));
/* global describe, it, beforeEach */
/// <reference path="../typings/node/node.d.ts" />
/// <reference path="../typings/mocha/mocha.d.ts" />
/// <reference path="../typescript/utils.ts"/>
'use strict';
//SERKAN
var assert = require('assert');
describe('addition', function () {
    var self = this;
    beforeEach(function () {
        self.onePlusOne = 1 + 1;
    });
    it('should add 1+1 correctly', function (done) {
        assert.equal(2, self.onePlusOne);
        // must call done() so that mocha know that we are... done.
        // Useful for async tests.
        done();
    });
    it('Utils.pluralize', function (done) {
        assert.equal("cars", Utils.pluralize(2, "car"));
        done();
    });
});
//# sourceMappingURL=test.js.map