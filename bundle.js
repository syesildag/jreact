var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
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
    var SNAKE_CASE_REGEXP = /[A-Z]/g;
    function snake_case(name, separator) {
        separator = separator || '_';
        return name.replace(SNAKE_CASE_REGEXP, function (letter, pos) {
            return (pos ? separator : '') + letter.toLowerCase();
        });
    }
    Utils.snake_case = snake_case;
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
    function testString(value) {
        return value != null && value !== '';
    }
    Utils.testString = testString;
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
    function isStringOrNumber(value) {
        return isString(value) || isNumber(value);
    }
    Utils.isStringOrNumber = isStringOrNumber;
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
/// <reference path="../typings/tsd.d.ts"/>
/// <reference path="./utils.ts"/>
/**
 * @author SYESILDAG
 * https://github.com/syesildag/jreact
 */
var JReact;
(function (JReact) {
    'use strict';
    JReact.DEBUG = false;
    var INSTANCE = 'instance';
    JReact.KEY = 'data-key';
    var STYLE = 'style';
    var CLASS = 'class';
    var ATTRIBUTE_MAP = {
        key: JReact.KEY,
        style: STYLE,
        className: CLASS,
        colspan: 'colspan',
        change: 'change',
        click: 'click',
        mouseup: 'mouseup',
        mousedown: 'mousedown',
        mousemove: 'mousemove',
        touchstart: 'touchstart',
        touchend: 'touchend',
        touchmove: 'touchmove',
        contextMenu: 'contextmenu'
    };
    /**
     * FSA-compliant action.
     * @see https://github.com/acdlite/flux-standard-action
     *
     * @param {string} type
     * @param {object} payload
     * @param {boolean} error
     * @param {object} meta
     * @return {object} Action
     */
    var Action = (function () {
        function Action(type, payload, error, meta) {
            this.type = type;
            this.payload = payload;
            this.error = error;
            this.meta = meta;
        }
        return Action;
    }());
    JReact.Action = Action;
    function getInstance(el) {
        return el.data(INSTANCE);
    }
    JReact.getInstance = getInstance;
    function setInstance(el, comp) {
        el.data(INSTANCE, comp);
    }
    function getInstanceKey(comp) {
        return getInstanceKeyFromTag(comp.getTag(), comp.props.key);
    }
    JReact.getInstanceKey = getInstanceKey;
    function getInstanceKeyFromTag(tag, key) {
        var componentKey = tag;
        if (Utils.testString(key))
            componentKey += '[' + JReact.KEY + '=' + key + ']';
        return componentKey;
    }
    JReact.getInstanceKeyFromTag = getInstanceKeyFromTag;
    function isSame(myProps, nextProps) {
        if (myProps === nextProps)
            return true;
        if (Object.keys(myProps).length === Object.keys(nextProps).length)
            return Object.keys(myProps).every(function (prop) {
                return Utils.isFunction(myProps[prop]) || myProps[prop] === nextProps[prop];
            });
        return false;
    }
    JReact.isSame = isSame;
    function NOOP() { }
    JReact.NOOP = NOOP;
    function createElement(jrc, props) {
        var args = [];
        for (var _i = 2; _i < arguments.length; _i++) {
            args[_i - 2] = arguments[_i];
        }
        var childKeys = {};
        if (args.length > 1) {
            if (Utils.isStringOrNumber(args[0]))
                throw new Error('multiple children with string or number');
            args.forEach(function (child) {
                if (Utils.isStringOrNumber(child))
                    return;
                var comp = child, componentKey;
                if (!Utils.testString(comp.props.key))
                    throw new Error('partially defined child prop keys: ' + jrc);
                componentKey = getInstanceKey(comp);
                if (childKeys.hasOwnProperty(componentKey))
                    throw new Error('duplicate child prop keys: ' + jrc);
                else
                    childKeys[componentKey] = true;
            });
        }
        if (!props)
            props = {};
        props.children = args.length ? args : undefined;
        if (typeof jrc === 'function')
            return new jrc(props);
        else
            return new ComponentDOM(props, jrc);
    }
    JReact.createElement = createElement;
    function updateProps(comp, el, remove) {
        Object.keys(comp.props).forEach(function (key) {
            var keyMap, value = comp.props[key];
            if (ATTRIBUTE_MAP.hasOwnProperty(key)) {
                keyMap = ATTRIBUTE_MAP[key];
                if (typeof value === 'function') {
                    if (remove)
                        el.unbind(keyMap);
                    else
                        el.bind(keyMap, value);
                }
                else if (key === STYLE) {
                    Object.keys(value).forEach(function (style) {
                        el.css(style, remove ? '' : value[style]);
                    });
                }
                else if (remove)
                    el.removeAttr(keyMap);
                else
                    el.attr(keyMap, value);
            }
        }, comp);
    }
    function render(comp, mount, sibling) {
        var childSibling, nextSibling, renderResult, oldComp, el, first = false, alreadyMounted = false, children = [], childKeyElements = {}, instanceKey = getInstanceKey(comp), oldHTML;
        el = mount.children(instanceKey);
        alreadyMounted = el.length > 0;
        if (alreadyMounted && (oldComp = getInstance(el))) {
            if (JReact.DEBUG)
                oldHTML = el.get(0).outerHTML;
            //move component
            if (sibling) {
                nextSibling = sibling.next();
                if (!nextSibling || getInstanceKey(getInstance(nextSibling)) !== instanceKey) {
                    el.detach();
                    sibling.after(el);
                }
            }
            if (!oldComp.shouldComponentUpdate(comp.props, comp.state))
                return el;
            oldComp.componentWillReceiveProps(comp.props);
            updateProps(oldComp, el, true);
            oldComp.props = comp.props;
            updateProps(oldComp, el);
            comp = oldComp;
        }
        else {
            first = true;
            if (!alreadyMounted)
                el = jQuery('<' + comp.getTag() + '/>');
            comp.setElement(el);
            setInstance(el, comp);
            comp.componentWillMount();
            updateProps(comp, el);
            if (!alreadyMounted) {
                if (sibling)
                    sibling.after(el);
                else
                    mount.append(el);
            }
        }
        if (comp.props.templateID)
            comp.renderTemplate();
        else if (comp.props.dangerouslySetInnerHTML)
            el.html(comp.props.dangerouslySetInnerHTML.__html);
        else {
            renderResult = comp.render();
            if (renderResult)
                children.push(renderResult);
            else if (comp.props.children)
                children = comp.props.children;
            //create children hash
            children.forEach(function (child) {
                if (child instanceof Component)
                    childKeyElements[getInstanceKey(child)] = true;
            });
            //unmount non-existant children
            el.children().each(function () {
                var jc = jQuery(this);
                if (!childKeyElements[getInstanceKey(getInstance(jc))])
                    unmountElement(jc);
            });
            //render children
            comp.refs = {};
            children.forEach(function (child) {
                if (child instanceof Component) {
                    childSibling = render(child, el, childSibling);
                    if (Utils.testString(child.props.ref))
                        comp.refs[child.props.ref] = childSibling;
                }
                else
                    el.text(child);
            });
        }
        if (first)
            comp.componentDidMount();
        else
            comp.componentDidUpdate();
        if (JReact.DEBUG && !first && oldHTML === el.get(0).outerHTML) {
            console.log("rendered but same:\n" + comp.constructor.name + "\n" + getInstanceKey(comp) + "\n" + oldHTML);
            console.dir(el.get(0));
        }
        return el;
    }
    JReact.render = render;
    function renderDOM(comp, m) {
        var el = render(comp, m);
        m.children().each(function () {
            if (this !== el[0])
                unmountElement(jQuery(this));
        });
        return el;
    }
    JReact.renderDOM = renderDOM;
    function unmountElement(jc) {
        var old = getInstance(jc), promise;
        if (old) {
            promise = old.componentWillUnmount();
            old.element = null;
            old.state = null;
            old.refs = {};
        }
        if (promise)
            jQuery.when(promise).done(function (promise) { jc.remove; });
        else
            jc.remove();
    }
    JReact.unmountElement = unmountElement;
    var Component = (function () {
        function Component(props) {
            this.refs = {};
            var defaultProps = this.getDefaultProps();
            if (defaultProps)
                props = jQuery.extend(true, {}, defaultProps, props);
            this.props = props;
        }
        Component.prototype.getDefaultProps = function () {
            return null;
        };
        Component.prototype.getTag = function () {
            return 'span';
        };
        Component.prototype.getElement = function () {
            return this.element;
        };
        Component.prototype.setElement = function (element) {
            this.element = element;
        };
        Component.prototype.getState = function () {
            return this.state;
        };
        Component.prototype.setState = function (state) {
            this.state = state;
        };
        Component.prototype.render = function () {
            return null;
        };
        Component.prototype.renderTemplate = function () { };
        Component.prototype.reduce = function (state, action) {
            return state;
        };
        Component.prototype.shouldComponentUpdate = function (nextProps, nextState) {
            return (typeof nextState !== 'undefined' && !isSame(this.state, nextState)) || !isSame(this.props, nextProps);
        };
        Component.prototype.dispatch = function (action) {
            var nextState = this.reduce(this.state, action);
            if (this.shouldComponentUpdate(this.props, nextState)) {
                this.setState(nextState);
                var renderResult = this.render();
                if (renderResult)
                    JReact.renderDOM(renderResult, this.element);
                else
                    this.renderTemplate();
            }
        };
        Component.prototype.componentWillReceiveProps = function (nextProps) { };
        Component.prototype.componentWillMount = function () { };
        Component.prototype.componentDidMount = function () { };
        Component.prototype.componentWillUnmount = function () { };
        Component.prototype.componentDidUpdate = function () { };
        return Component;
    }());
    JReact.Component = Component;
    var ComponentDOM = (function (_super) {
        __extends(ComponentDOM, _super);
        function ComponentDOM(props, tag) {
            _super.call(this, props);
            this.tag = tag;
        }
        ComponentDOM.prototype.getTag = function () {
            return this.tag;
        };
        ComponentDOM.prototype.shouldComponentUpdate = function (nextProps, nextState) {
            if (!this.props.children && !nextProps.children)
                return false;
            if (this.props.children
                && this.props.children.length === 1
                && Utils.isStringOrNumber(this.props.children[0])
                && nextProps
                && nextProps.children.length === 1
                && Utils.isStringOrNumber(nextProps.children[0])
                && this.props.children[0] == nextProps.children[0])
                return false;
            return _super.prototype.shouldComponentUpdate.call(this, nextProps, nextState);
        };
        return ComponentDOM;
    }(Component));
    var AutoTemplate = (function (_super) {
        __extends(AutoTemplate, _super);
        function AutoTemplate(props) {
            _super.call(this, props);
        }
        AutoTemplate.prototype.getTag = function () {
            return this.props.tag;
        };
        AutoTemplate.prototype.getComponents = function () {
            return this.props.components;
        };
        AutoTemplate.prototype.getComponentByKey = function (key) {
            var components = this.getComponents();
            if (components)
                for (var _i = 0, components_1 = components; _i < components_1.length; _i++) {
                    var component = components_1[_i];
                    if (component.key === key)
                        return component;
                }
            return null;
        };
        AutoTemplate.prototype.getTemplateHTML = function () {
            return JReact.getTemplateContent(this.props.templateID);
        };
        AutoTemplate.prototype.renderTemplate = function () {
            var templateHTML = this.getTemplateHTML();
            this.preRenderTemplate();
            if (!Utils.isUndefined(templateHTML))
                this.getElement().html(templateHTML);
            this.postRenderTemplate();
        };
        AutoTemplate.prototype.preRenderTemplate = function () {
            var childKeyElements = {}, components = this.getComponents();
            //create children hash
            if (components)
                components.forEach(function (component) {
                    childKeyElements[JReact.getInstanceKeyFromTag(component.tag, component.key)] = true;
                });
            //unmount non-existant children
            this.getElement().children('[' + JReact.KEY + ']').each(function () {
                var jc = jQuery(this);
                if (!childKeyElements[JReact.getInstanceKey(JReact.getInstance(jc))])
                    JReact.unmountElement(jc);
            });
            this._preRenderTemplate();
        };
        AutoTemplate.prototype._preRenderTemplate = function () {
        };
        AutoTemplate.prototype.postRenderTemplate = function () {
            var _this = this;
            var components = this.getComponents(), sibling = null, templateHTML = this.getTemplateHTML();
            //render children
            this.refs = {};
            if (components)
                components.forEach(function (component) {
                    sibling = JReact.render(JReact.createElement(eval(component.nameSpace + "." + component.name), component), _this.getElement(), Utils.isUndefined(templateHTML) ? sibling : undefined);
                    _this.refs[component.key] = sibling;
                });
            this._postRenderTemplate();
        };
        AutoTemplate.prototype._postRenderTemplate = function () {
        };
        return AutoTemplate;
    }(JReact.Component));
    JReact.AutoTemplate = AutoTemplate;
    var templateCache = {};
    function getTemplateContent(id) {
        return templateCache[id];
    }
    JReact.getTemplateContent = getTemplateContent;
    function bootstrap(document) {
        var script, scriptType = 'text/html';
        for (var index = 0; index < document.scripts.length; index++) {
            script = document.scripts[index];
            if (script.type === scriptType && script.id)
                templateCache[script.id] = script.text;
        }
    }
    JReact.bootstrap = bootstrap;
})(JReact || (JReact = {}));
/// <reference path="./jreact.ts"/>
/// <reference path="../typings/tsd.d.ts"/>
var JReactComponents;
(function (JReactComponents) {
    var CounterActionType;
    (function (CounterActionType) {
        CounterActionType[CounterActionType["INCREMENT"] = 0] = "INCREMENT";
        CounterActionType[CounterActionType["DECREMENT"] = 1] = "DECREMENT";
        CounterActionType[CounterActionType["INCREMENT_ASYNC"] = 2] = "INCREMENT_ASYNC";
        CounterActionType[CounterActionType["DECREMENT_ASYNC"] = 3] = "DECREMENT_ASYNC";
    })(CounterActionType || (CounterActionType = {}));
    var Counter = (function (_super) {
        __extends(Counter, _super);
        function Counter(props) {
            _super.call(this, props);
        }
        //public shouldComponentUpdate(nextProps: any, nextState: any) {
        //  return !nextState || (nextState.times >= 0 && nextState.times <= 10);
        //}
        Counter.prototype.loading = function (loading, action) {
            if (loading === void 0) { loading = false; }
            switch (action.type) {
                case CounterActionType.INCREMENT_ASYNC:
                    return true;
                case CounterActionType.DECREMENT_ASYNC:
                    return true;
                default:
                    return false;
            }
        };
        Counter.prototype.times = function (times, action) {
            var _this = this;
            if (times === void 0) { times = 0; }
            switch (action.type) {
                case CounterActionType.INCREMENT:
                    return times >= 10 ? times : times + 1;
                case CounterActionType.DECREMENT:
                    return times <= 0 ? times : times - 1;
                case CounterActionType.INCREMENT_ASYNC:
                    setTimeout(function () {
                        _this.dispatch(new JReact.Action(CounterActionType.INCREMENT));
                    }, 1000);
                    return times;
                case CounterActionType.DECREMENT_ASYNC:
                    setTimeout(function () {
                        _this.dispatch(new JReact.Action(CounterActionType.DECREMENT));
                    }, 1000);
                default:
                    return times;
            }
        };
        Counter.prototype.reduce = function (state, action) {
            if (state === void 0) { state = {}; }
            return {
                times: this.times(state.times, action),
                loading: this.loading(state.loading, action)
            };
        };
        Counter.prototype.render = function () {
            var _this = this;
            return JReact.createElement('div', { className: 'counter-div' }, JReact.createElement('h2', { key: 1, className: 'counter-span' }, this.state.times + (this.state.loading ? '...' : '')), JReact.createElement('button', {
                key: 2,
                className: 'btn btn-primary',
                onClick: function () {
                    _this.dispatch(new JReact.Action(CounterActionType.DECREMENT_ASYNC));
                }
            }, 'DEC'), JReact.createElement('button', {
                key: 3,
                className: 'btn btn-primary',
                onClick: function () {
                    _this.dispatch(new JReact.Action(CounterActionType.INCREMENT_ASYNC));
                }
            }, 'INC'));
        };
        return Counter;
    }(JReact.Component));
    JReactComponents.Counter = Counter;
})(JReactComponents || (JReactComponents = {}));
/// <reference path="./jreact.ts"/>
/// <reference path="./utils.ts"/>
/// <reference path="../typings/tsd.d.ts"/>
var JReactComponents;
(function (JReactComponents) {
    var AbstractBaseWidget = (function (_super) {
        __extends(AbstractBaseWidget, _super);
        function AbstractBaseWidget(props) {
            _super.call(this, props);
            this.CONTAINER = 'jreact-widget-' + this.getWidgetName() + '-container';
        }
        AbstractBaseWidget.prototype.getWidgetName = function () {
            throw new Error('should override widget name');
        };
        AbstractBaseWidget.prototype.getContainer = function () {
            return JReact.createElement.bind(null, 'span');
        };
        AbstractBaseWidget.prototype.getContainerProps = function () {
            return {};
        };
        AbstractBaseWidget.prototype.shouldComponentUpdate = function (nextProps, nextState) {
            var update = !JReact.isSame(this.props.widgetOptions, nextProps.widgetOptions) || !JReact.isSame(this.state, nextState);
            if (!update && this.props.children !== nextProps.children) {
                update = (this.props.children != null && nextProps.children == null)
                    || (this.props.children == null && nextProps.children != null)
                    || (this.props.children != null && nextProps.children != null
                        && (this.props.children.length !== nextProps.children.length
                            || this.props.children.some(function (child, idx) {
                                var nextChild = nextProps.children[idx], same = (Utils.isStringOrNumber(child) && Utils.isStringOrNumber(nextChild) && child == nextChild)
                                    || ((child instanceof JReact.Component)
                                        && (nextChild instanceof JReact.Component)
                                        && child.constructor.name === nextChild.constructor.name
                                        && !child.shouldComponentUpdate(nextChild.props, nextChild.state));
                                return !same;
                            })));
            }
            if (!update) {
                this.props = nextProps;
                this.state = nextState;
            }
            return update;
        };
        AbstractBaseWidget.prototype.componentWillReceiveProps = function (nextProps) {
            this.componentWillUnmount();
        };
        AbstractBaseWidget.prototype.render = function () {
            return this.getContainer().apply(void 0, [jQuery.extend({
                className: this.CONTAINER,
                ref: this.CONTAINER
            }, this.getContainerProps())].concat(this.props.children));
        };
        return AbstractBaseWidget;
    }(JReact.Component));
    JReactComponents.AbstractBaseWidget = AbstractBaseWidget;
    var AbstractWidget = (function (_super) {
        __extends(AbstractWidget, _super);
        function AbstractWidget(props) {
            _super.call(this, props);
        }
        AbstractWidget.prototype.componentDidMount = function () {
            this.refs[this.CONTAINER][this.getWidgetName()](this.props.widgetOptions || {});
        };
        AbstractWidget.prototype.componentWillUnmount = function () {
            this.refs[this.CONTAINER][this.getWidgetName()]('destroy');
        };
        AbstractWidget.prototype.componentDidUpdate = function () {
            this.refs[this.CONTAINER][this.getWidgetName()](this.props.widgetOptions || {});
        };
        return AbstractWidget;
    }(AbstractBaseWidget));
    JReactComponents.AbstractWidget = AbstractWidget;
    var Resizable = (function (_super) {
        __extends(Resizable, _super);
        function Resizable(props) {
            _super.call(this, props);
        }
        Resizable.prototype.getWidgetName = function () {
            return 'resizable';
        };
        Resizable.prototype.getContainer = function () {
            return JReact.createElement.bind(null, 'div');
        };
        Resizable.prototype.onResizeStop = function (ui) {
            this.state = ui.size;
        };
        Resizable.prototype.getDefaultProps = function () {
            return {
                widgetOptions: {
                    grid: [1, 1],
                    stop: function (e, ui) {
                        JReact.getInstance(jQuery(e.target).parent()).onResizeStop(ui);
                    }
                }
            };
        };
        Resizable.prototype.getContainerProps = function () {
            if (this.state)
                return {
                    style: {
                        width: this.state.width,
                        height: this.state.height
                    }
                };
            return _super.prototype.getContainerProps.call(this);
        };
        return Resizable;
    }(AbstractWidget));
    JReactComponents.Resizable = Resizable;
    var Accordion = (function (_super) {
        __extends(Accordion, _super);
        function Accordion(props) {
            _super.call(this, props);
        }
        Accordion.prototype.getWidgetName = function () {
            return 'accordion';
        };
        return Accordion;
    }(AbstractWidget));
    JReactComponents.Accordion = Accordion;
    var LongPress = (function (_super) {
        __extends(LongPress, _super);
        function LongPress(props) {
            _super.call(this, props);
        }
        LongPress.prototype.getWidgetName = function () {
            return 'longpress';
        };
        LongPress.prototype.getDefaultProps = function () {
            return {
                widgetOptions: {
                    delay: 500,
                    shortCallback: JReact.NOOP,
                    longCallback: JReact.NOOP
                }
            };
        };
        LongPress.prototype.clearTimeout = function () {
            clearTimeout(LongPress.timeout);
            LongPress.timeout = null;
        };
        LongPress.prototype.onMouseDown = function (e) {
            var _this = this;
            if (e.button === 0)
                LongPress.timeout = setTimeout(function () {
                    _this.props.widgetOptions.longCallback.call(_this, e);
                    LongPress.timeout = null;
                }, this.props.widgetOptions.delay);
        };
        LongPress.prototype.onMouseUp = function (e) {
            if (e.button === 0 && LongPress.timeout != null) {
                this.clearTimeout();
                this.props.widgetOptions.shortCallback.call(this, e);
            }
        };
        LongPress.prototype.onMouseMove = function (e) {
            if (LongPress.timeout != null)
                this.clearTimeout();
        };
        //private onContextMenu(e: JQueryEventObject) {
        //  if (this.timeout == null && e.type !== 'mouseup') {
        //    this.props.widgetOptions.longCallback.call(this, e);
        //    e.preventDefault();
        //    e.stopPropagation();
        //    return false;
        //  }
        //}
        LongPress.prototype.getContainerProps = function () {
            return {
                //onContextMenu: this.onContextMenu.bind(this),
                onMouseDown: this.onMouseDown.bind(this),
                onMouseUp: this.onMouseUp.bind(this),
                onMouseMove: this.onMouseMove.bind(this),
                onTouchStart: this.onMouseDown.bind(this),
                onTouchEnd: this.onMouseUp.bind(this),
                onTouchMove: this.onMouseMove.bind(this)
            };
        };
        LongPress.timeout = null;
        return LongPress;
    }(AbstractBaseWidget));
    JReactComponents.LongPress = LongPress;
})(JReactComponents || (JReactComponents = {}));
//# sourceMappingURL=bundle.js.map