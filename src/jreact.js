var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/// <reference path="../typings/tsd.d.ts"/>
var JReact;
(function (JReact) {
    'use strict';
    JReact.DEBUG = false;
    var STYLE = 'style';
    var KEY = 'data-key';
    var INSTANCE = 'instance';
    var ATTRIBUTE_MAP = {
        key: KEY,
        style: STYLE,
        className: 'class',
        onChange: 'change',
        onClick: 'click',
        onMouseUp: 'mouseup',
        onMouseDown: 'mousedown',
        onMouseMove: 'mousemove',
        onTouchStart: 'touchstart',
        onTouchEnd: 'touchend',
        onTouchMove: 'touchmove',
        onContextMenu: 'contextmenu'
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
    var SPECIAL_CHARS_REGEXP = /([\:\-\_]+(.))/g;
    function camelCase(name) {
        return name
            .replace(SPECIAL_CHARS_REGEXP, function (_, separator, letter, offset) {
            return offset ? letter.toUpperCase() : letter;
        });
    }
    JReact.camelCase = camelCase;
    var SNAKE_CASE_REGEXP = /[A-Z]/g;
    function snake_case(name, separator) {
        if (separator === void 0) { separator = '_'; }
        return name.replace(SNAKE_CASE_REGEXP, function (letter, pos) {
            return (pos ? separator : '') + letter.toLowerCase();
        });
    }
    JReact.snake_case = snake_case;
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
    JReact.nextUid = nextUid;
    function getInstance(el) {
        //return el.triggerHandler(SELF);
        return el.data(INSTANCE);
    }
    JReact.getInstance = getInstance;
    function setInstance(el, comp) {
        el.data(INSTANCE, comp);
        //el.bind(SELF, function() { return comp });
    }
    function getInstanceKey(comp) {
        var componentKey = comp.getTag(), key = comp.props.key;
        if (testString(key))
            componentKey += '[' + KEY + '=' + key + ']';
        return componentKey;
    }
    function isSame(myProps, nextProps) {
        if (myProps === nextProps)
            return true;
        if (Object.keys(myProps).length === Object.keys(nextProps).length)
            return Object.keys(myProps).every(function (prop) {
                return myProps[prop] === nextProps[prop];
            });
        return false;
    }
    JReact.isSame = isSame;
    function noop() { }
    JReact.noop = noop;
    function testString(value) {
        return value != null && value !== '';
    }
    JReact.testString = testString;
    function isString(value) {
        return typeof value === "string";
    }
    JReact.isString = isString;
    function isNumber(value) {
        return typeof value === "number";
    }
    JReact.isNumber = isNumber;
    function isStringOrNumber(value) {
        return isString(value) || isNumber(value);
    }
    JReact.isStringOrNumber = isStringOrNumber;
    function createElement(jrc, props) {
        var args = [];
        for (var _i = 2; _i < arguments.length; _i++) {
            args[_i - 2] = arguments[_i];
        }
        var childKeys = {};
        if (args.length > 1) {
            if (isStringOrNumber(args[0]))
                throw new Error('multiple children with string or number');
            args.forEach(function (child) {
                if (isStringOrNumber(child))
                    return;
                var comp = child, componentKey;
                if (!testString(comp.props.key))
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
                else {
                    if (remove)
                        el.removeAttr(keyMap);
                    else
                        el.attr(keyMap, value);
                }
            }
        }, comp);
    }
    function render(comp, mount, sibling) {
        var childSibling, nextSibling, renderResult, oldComp, el, first = false, children = [], childKeyElements = {}, instanceKey = getInstanceKey(comp), oldHTML;
        el = mount.children(instanceKey);
        if (el.length) {
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
            oldComp = getInstance(el);
            if (!oldComp.shouldComponentUpdate(comp.props, comp.state))
                return el;
            if (typeof comp.state !== 'undefined')
                oldComp.state = comp.state;
            oldComp.componentWillReceiveProps(comp.props);
            updateProps(oldComp, el, true);
            oldComp.props = comp.props;
            updateProps(oldComp, el);
            comp = oldComp;
        }
        else {
            first = true;
            el = jQuery('<' + comp.getTag() + '/>');
            comp.setElement(el);
            setInstance(el, comp);
            comp.componentWillMount();
            updateProps(comp, el);
            if (sibling)
                sibling.after(el);
            else
                mount.prepend(el);
        }
        if (comp.props.dangerouslySetInnerHTML)
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
            children.forEach(function (child) {
                if (child instanceof Component) {
                    childSibling = render(child, el, childSibling);
                    if (testString(child.props.ref))
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
    function renderDOM(comp, m) {
        var el = render(comp, m);
        m.children().each(function () {
            if (this !== el[0])
                unmountElement(jQuery(this));
        });
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
    var Component = (function () {
        function Component(props) {
            this.refs = {};
            var defaultProps = this.getDefaultProps();
            if (defaultProps)
                props = jQuery.extend(true, {}, defaultProps, props);
            this.props = props;
            if (typeof props.state !== 'undefined')
                this.state = props.state;
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
                JReact.renderDOM(this.render(), this.element);
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
                && isStringOrNumber(this.props.children[0])
                && nextProps
                && nextProps.children.length === 1
                && isStringOrNumber(nextProps.children[0])
                && this.props.children[0] == nextProps.children[0])
                return false;
            return _super.prototype.shouldComponentUpdate.call(this, nextProps, nextState);
        };
        return ComponentDOM;
    }(Component));
})(JReact || (JReact = {}));
//# sourceMappingURL=jreact.js.map