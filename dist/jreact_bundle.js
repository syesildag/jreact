/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/jreact.ts");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/jreact.ts":
/*!***********************!*\
  !*** ./src/jreact.ts ***!
  \***********************/
/*! no static exports found */
/***/ (function(module, exports) {

/// <reference path="./utils.ts"/>
/// <reference path="./rslPromise.ts"/>
/**
 * @author SYESILDAG
 * https://github.com/syesildag/jreact
 */
var JReact;
(function (JReact) {
    'use strict';
    JReact.DEBUG = false;
    JReact.TEST = false;
    JReact.INSTANCE = 'instance';
    JReact.DATA_KEY = 'data-key';
    JReact.RSL_VALID_REQUIRED = 'rsl-valid-required';
    JReact.RSL_INVALID_REQUIRED = 'rsl-invalid-required';
    JReact.RSL_VALID_PATTERN = 'rsl-valid-pattern';
    JReact.RSL_INVALID_PATTERN = 'rsl-invalid-pattern';
    JReact.DATA_FIXED_ITEM = 'data-fixed-item';
    JReact.DATA_REQUIRED = 'data-required';
    JReact.DATA_PATTERN = 'data-pattern';
    JReact.VALUE = '_value';
    const STYLE = 'style';
    const CLASS = 'class';
    let ATTRIBUTE_MAP = {
        key: JReact.DATA_KEY,
        className: CLASS
    };
    [STYLE,
        JReact.VALUE,
        JReact.DATA_REQUIRED,
        JReact.DATA_PATTERN,
        'size',
        'maxlength',
        'id',
        'change',
        'checked',
        'click',
        'colspan',
        'contextmenu',
        'disabled',
        'selected',
        'mousedown',
        'mousemove',
        'mouseup',
        'touchend',
        'touchmove',
        'touchstart',
        'type',
        'value',
        'placeholder',
        'title',
        'href',
        'name'
    ].forEach(key => ATTRIBUTE_MAP[key] = key);
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
    class Action {
        constructor(type, payload, error, meta) {
            this.type = type;
            this.payload = payload;
            this.error = error;
            this.meta = meta;
        }
    }
    JReact.Action = Action;
    function getInstance(el) {
        return el.data(JReact.INSTANCE);
    }
    JReact.getInstance = getInstance;
    function setInstance(el, comp) {
        el.data(JReact.INSTANCE, comp);
    }
    function getInstanceKey(comp) {
        return getInstanceKeyFromTag(comp.getTag(), comp.props.key);
    }
    JReact.getInstanceKey = getInstanceKey;
    function getInstanceKeyFromTag(tag, key) {
        let componentKey = tag;
        if (Utils.testString(key))
            componentKey += '[' + JReact.DATA_KEY + '=' + key + ']';
        return componentKey;
    }
    JReact.getInstanceKeyFromTag = getInstanceKeyFromTag;
    function isSame(myProps, nextProps) {
        if (myProps === nextProps || (myProps == null && nextProps == null))
            return true;
        if (myProps == null && nextProps != null)
            return false;
        if (myProps != null && nextProps == null)
            return false;
        if (Object.keys(myProps).length !== Object.keys(nextProps).length)
            return false;
        return Object.keys(myProps).every(function (prop) {
            return myProps[prop] === nextProps[prop];
        });
    }
    JReact.isSame = isSame;
    function NOOP() {
    }
    JReact.NOOP = NOOP;
    function createElement(jrc, props, ...args) {
        let childKeys = {};
        if (args.length > 1) {
            if (Utils.isStringOrNumber(args[0]))
                throw new Error('multiple children with string or number');
            args.forEach(function (child) {
                if (Utils.isStringOrNumber(child))
                    return;
                let comp = child, componentKey;
                if (comp.props.key == null)
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
        props.children = args;
        if (typeof jrc === 'function')
            return new jrc(props);
        else
            return new ComponentDOM(props, jrc);
    }
    JReact.createElement = createElement;
    function updateProps(comp, el, remove) {
        Object.keys(comp.props).forEach(function (key) {
            let keyMap, value = comp.props[key];
            if (ATTRIBUTE_MAP.hasOwnProperty(key)) {
                keyMap = ATTRIBUTE_MAP[key];
                if (typeof value === 'function') {
                    if (remove)
                        el.unbind(keyMap);
                    else
                        el.bind(keyMap, value);
                }
                else if (key === STYLE) {
                    Object.keys(value).forEach(style => {
                        el.css(style, remove ? '' : value[style]);
                    });
                }
                else if (key === JReact.VALUE) {
                    if (remove)
                        el.val(null);
                    else
                        el.val(value);
                }
                else if (remove) {
                    if (Utils.isBoolean(value))
                        el.prop(keyMap, false);
                    else
                        el.removeAttr(keyMap);
                }
                else {
                    if (Utils.isBoolean(value))
                        el.prop(keyMap, value);
                    else
                        el.attr(keyMap, value);
                }
            }
        }, comp);
    }
    function render(comp, mount, sibling) {
        let childSibling, nextSibling, renderResult, oldComp, prevProps, prevState, el, first = false, alreadyMounted = false, children = [], childKeyElements = {}, instanceKey = getInstanceKey(comp), oldHTML;
        el = mount.children(instanceKey);
        alreadyMounted = el.length > 0;
        if (alreadyMounted && (oldComp = getInstance(el))) {
            if (JReact.DEBUG)
                oldHTML = el.get(0).outerHTML;
            //move component
            if (sibling) {
                nextSibling = sibling.next();
                if (nextSibling.length == 0 || getInstanceKey(getInstance(nextSibling)) !== instanceKey) {
                    el.detach();
                    sibling.after(el);
                }
            }
            if (!oldComp.shouldComponentUpdate(comp.props, comp.state))
                return el;
            prevState = oldComp.state;
            oldComp.componentWillReceiveProps(comp.props);
            updateProps(oldComp, el, true);
            prevProps = oldComp.props;
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
        if (comp instanceof AutoTemplate)
            comp.renderTemplate();
        else if (comp.props.dangerouslySetInnerHTML)
            el.html(comp.props.dangerouslySetInnerHTML.__html);
        else {
            renderResult = comp.render();
            if (renderResult) {
                if (Utils.isArray(renderResult))
                    children.push(...renderResult);
                else
                    children.push(renderResult);
            }
            else
                children = comp.props.children;
            //create children hash
            children.forEach((child) => {
                if (child instanceof Component)
                    childKeyElements[getInstanceKey(child)] = true;
            });
            //unmount non-existant children
            el.children().each(function () {
                let jEl = jQuery(this), inst = getInstance(jEl);
                if ((!inst || !childKeyElements[getInstanceKey(inst)]) && !jEl.is('[' + JReact.DATA_FIXED_ITEM + ']'))
                    unmountElement(jEl);
            });
            //render children
            comp.refs = {};
            children.forEach(function (child) {
                if (child instanceof Component) {
                    childSibling = render(child, el, childSibling);
                    if (child.props.ref != null) {
                        if (Utils.isFunction(child.props.ref))
                            child.props.ref.call(comp, childSibling);
                        else if (child.props.ref != '')
                            comp.refs[child.props.ref] = childSibling;
                    }
                }
                else
                    el.text(child);
            });
        }
        if (first)
            comp.componentDidMount();
        else
            comp.componentDidUpdate(prevProps, prevState);
        if (JReact.DEBUG && !first && oldHTML === el.get(0).outerHTML) {
            console.log(`rendered but same:\n${comp.constructor.name}\n${getInstanceKey(comp)}\n${oldHTML}`);
            console.dir(el.get(0));
        }
        return el;
    }
    JReact.render = render;
    function renderDOM(comp, m) {
        let el = render(comp, m);
        m.children().each(function () {
            if (this !== el[0])
                unmountElement(jQuery(this));
        });
        return el;
    }
    JReact.renderDOM = renderDOM;
    function unmountElement(jc, bDoNotRemove) {
        let old = getInstance(jc);
        if (old)
            old.componentWillUnmount();
        if (bDoNotRemove)
            jc.html(null);
        else
            jc.remove();
    }
    class Component {
        constructor(props) {
            this.refs = {};
            let defaultProps = this.getDefaultProps();
            if (defaultProps)
                props = jQuery.extend(true, {}, defaultProps, props);
            this.props = props;
        }
        getDefaultProps() {
            return null;
        }
        getTag() {
            return 'span';
        }
        getElement() {
            return this.element;
        }
        setElement(element) {
            this.element = element;
        }
        _getState() {
            return this.state;
        }
        _setState(state) {
            this.state = state;
        }
        render() {
            return null;
        }
        renderTemplate() {
            throw new Error("must be overloaded");
        }
        reduce(state, action) {
            return state;
        }
        shouldComponentUpdate(nextProps, nextState) {
            return !isSame(this.state, nextState) || !isSame(this.props, nextProps);
        }
        dispatch(action) {
            this.setState(this.reduce(this.state, action));
        }
        setState(nextState) {
            if (this.shouldComponentUpdate(this.props, nextState)) {
                this._setState(nextState);
                if (!JReact.TEST) {
                    let renderResult = this.render();
                    if (renderResult) {
                        if (Utils.isArray(renderResult))
                            render(JReact.createElement(this.constructor, this.props, ...renderResult), this.element.parent());
                        else
                            renderDOM(renderResult, this.element);
                    }
                    else
                        this.renderTemplate();
                }
            }
        }
        componentWillReceiveProps(nextProps) {
        }
        componentWillMount() {
        }
        componentDidMount() {
        }
        componentWillUnmount() {
        }
        componentDidUpdate(prevProps, prevState) {
        }
    }
    JReact.Component = Component;
    class ComponentDOM extends Component {
        constructor(props, tag) {
            super(props);
            this.tag = tag;
        }
        getTag() {
            return this.tag;
        }
    }
    JReact.ComponentDOM = ComponentDOM;
    class AutoTemplate extends Component {
        constructor(props) {
            super(props);
        }
        getTag() {
            return this.props.tag;
        }
        getComponents() {
            return this.props.components;
        }
        getComponentByKey(key) {
            return getPropByKey(key, this.getComponents());
        }
        getTemplateHTML() {
            return getTemplateContent(this.props.templateID);
        }
        renderTemplate() {
            let templateHTML = this.getTemplateHTML(), el = this.getElement();
            this.preRenderTemplate();
            if (!Utils.isUndefined(templateHTML) && !el.html())
                el.html(templateHTML);
            this.postRenderTemplate();
        }
        preRenderTemplate() {
            this._preRenderTemplate();
            let childKeyElements = {}, components = this.getComponents(), templateHTML = this.getTemplateHTML();
            //create children hash
            if (components)
                components.forEach(component => {
                    childKeyElements[getInstanceKeyFromTag(component.tag, component.key)] = true;
                });
            //unmount non-existant children
            this.getElement().children('[' + JReact.DATA_KEY + ']').each(function () {
                let jEl = jQuery(this), inst = getInstance(jEl);
                if (!inst || !childKeyElements[getInstanceKey(inst)])
                    unmountElement(jEl, !Utils.isUndefined(templateHTML));
            });
        }
        _preRenderTemplate() {
        }
        postRenderTemplate() {
            let components = this.getComponents(), sibling = null, templateHTML = this.getTemplateHTML();
            //render children
            this.refs = {};
            if (components)
                components.forEach(component => {
                    sibling = render(createElement(evalComponent(component), component), this.getElement(), Utils.isUndefined(templateHTML) ? sibling : undefined);
                    this.refs[component.key] = sibling;
                });
            this._postRenderTemplate();
        }
        _postRenderTemplate() {
        }
    }
    JReact.AutoTemplate = AutoTemplate;
    function evalComponent(props) {
        return eval(props.nameSpace + "." + props.name);
    }
    class StatelessAutoTemplate extends AutoTemplate {
        constructor(props) {
            super(props);
        }
    }
    JReact.StatelessAutoTemplate = StatelessAutoTemplate;
    function getDynamicComponent(key, dynProps) {
        return getPropByKey(key, dynProps.data.dynamicComponents);
    }
    JReact.getDynamicComponent = getDynamicComponent;
    function getPropByKey(key, props) {
        if (props)
            for (let component of props)
                if (component.key == key)
                    return component;
        return null;
    }
    JReact.getPropByKey = getPropByKey;
    class DynamicStatelessAutoTemplate extends StatelessAutoTemplate {
        constructor(props) {
            super(props);
        }
        getDynamicComponentByKey(key) {
            return getPropByKey(key, this.props.data.dynamicComponents);
        }
    }
    JReact.DynamicStatelessAutoTemplate = DynamicStatelessAutoTemplate;
    class ComponentController {
        constructor(state, ...converters) {
            this.state = state;
            this.converters = converters;
        }
        dispatch(action) {
            let actionHandler = this.getActionHandler(action.type), oldState = Utils.extend(this.state);
            this.state = actionHandler.reduce(this, action);
            if (Utils.isFunction(actionHandler.preRenderTemplate)) {
                this.preRenderStart(action);
                actionHandler.preRenderTemplate(this, action).then((newState) => {
                    this.state = newState;
                    this.render(actionHandler, action);
                    this.preRenderSuccess(action, oldState, newState);
                    this.preRenderFinally(action, oldState, newState);
                }, (error) => {
                    this.state = oldState;
                    this.preRenderError(action, oldState, error);
                    this.preRenderFinally(action, oldState, error);
                });
            }
            else
                this.render(actionHandler, action);
        }
        render(actionHandler, action) {
            if (JReact.TEST)
                return;
            for (let converter of this.converters) {
                let component = converter.getComponent();
                let newProps = converter.convert(this.state);
                render(JReact.createElement(component.constructor, newProps), component.getElement().parent());
            }
            if (Utils.isFunction(actionHandler.postRenderTemplate))
                actionHandler.postRenderTemplate(this, action);
        }
        getState() {
            return this.state;
        }
        getActionHandler(actionType) {
            throw new Error('getActionHandler should be overridden');
        }
        preRenderStart(action) {
        }
        preRenderSuccess(action, oldState, newState) {
        }
        preRenderError(action, oldState, error) {
        }
        preRenderFinally(action, oldState, newStateOrError) {
        }
    }
    JReact.ComponentController = ComponentController;
    class SingleComponentController extends ComponentController {
        constructor(component) {
            super(component.props, new SingleComponentConverter(component));
        }
    }
    JReact.SingleComponentController = SingleComponentController;
    class SingleComponentConverter {
        constructor(component) {
            this.component = component;
        }
        getComponent() {
            return this.component;
        }
        convert(state) {
            return state;
        }
    }
    JReact.SingleComponentConverter = SingleComponentConverter;
    function hasInvalidPattern(el) {
        return el.hasClass(JReact.RSL_INVALID_PATTERN);
    }
    JReact.hasInvalidPattern = hasInvalidPattern;
    function hasInvalidRequired(el) {
        return el.hasClass(JReact.RSL_INVALID_REQUIRED);
    }
    JReact.hasInvalidRequired = hasInvalidRequired;
    let templateCache = {};
    function getTemplateContent(id) {
        return templateCache[id];
    }
    JReact.getTemplateContent = getTemplateContent;
    function bootstrap(document) {
        let script, scriptType = 'text/html';
        for (let index = 0; index < document.scripts.length; index++) {
            script = document.scripts[index];
            if (script.type === scriptType && script.id)
                templateCache[script.id] = script.text;
        }
    }
    JReact.bootstrap = bootstrap;
})(JReact || (JReact = {}));


/***/ })

/******/ });
//# sourceMappingURL=jreact_bundle.js.map