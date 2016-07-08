/// <reference path="../typings/tsd.d.ts"/>
module JReact {
  'use strict';

  export var DEBUG: boolean = false;

  const STYLE: string = 'style';
  const KEY: string = 'data-key';
  const INSTANCE: string = 'instance';

  var ATTRIBUTE_MAP: any = {
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
  export class Action<A, L> {
    constructor(
      public type: A,
      public payload?: L,
      public error?: boolean,
      public meta?: any) {
    }
  }

  const SPECIAL_CHARS_REGEXP = /([\:\-\_]+(.))/g;
  export function camelCase(name: string) {
    return name
      .replace(SPECIAL_CHARS_REGEXP, function(_, separator, letter, offset) {
        return offset ? letter.toUpperCase() : letter;
      });
  }

  const SNAKE_CASE_REGEXP = /[A-Z]/g;
  export function snake_case(name: string, separator = '_') {
    return name.replace(SNAKE_CASE_REGEXP, function(letter, pos) {
      return (pos ? separator : '') + letter.toLowerCase();
    });
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
    var index = uid.length, digit: number;
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

  export function getInstance<P extends Props>(el: JQuery): Component<P, any, any, any> {
    //return el.triggerHandler(SELF);
    return el.data(INSTANCE);
  }

  function setInstance<P extends Props>(el: JQuery, comp: Component<P, any, any, any>) {
    el.data(INSTANCE, comp);
    //el.bind(SELF, function() { return comp });
  }

  function getInstanceKey<P extends Props>(comp: Component<P, any, any, any>): string {

    var componentKey = comp.getTag(),
      key = comp.props.key;

    if (testString(key))
      componentKey += '[' + KEY + '=' + key + ']';

    return componentKey;
  }

  export function isSame(myProps: any, nextProps: any): boolean {
    if (myProps === nextProps)
      return true;

    if (Object.keys(myProps).length === Object.keys(nextProps).length)
      return Object.keys(myProps).every(function(prop) {
        return myProps[prop] === nextProps[prop];
      });

    return false;
  }

  export function noop() { }

  export function testString(value: any): boolean {
    return value != null && value !== '';
  }

  export function isString(value: any): boolean {
    return typeof value === "string";
  }

  export function isNumber(value: any): boolean {
    return typeof value === "number";
  }

  export function isStringOrNumber(value: any): boolean {
    return isString(value) || isNumber(value);
  }

  export function createElement<P extends Props, C extends Component<P, any, any, any>>(
    jrc: { new (props: P): C },
    props: P, ...args: ComponentArray): C;

  export function createElement<P extends DOMAttributes>(
    jrc: string, props: P, ...args: ComponentArray): ComponentDOM<P>;

  export function createElement<P extends Props, C extends Component<P, any, any, any>>(
    jrc: string|{ new (props: P): C },
    props: P,
    ...args: ComponentArray): C|ComponentDOM<P> {
    var childKeys: any = {};

    if (args.length > 1) {

      if (isStringOrNumber(args[0]))
        throw new Error('multiple children with string or number');

      args.forEach(function(child) {

        if (isStringOrNumber(child))
          return;

        var comp = <Component<P, any, any, any>>child,
          componentKey: string;

        if (!testString(comp.props.key))
          throw new Error('partially defined child prop keys: ' + jrc);

        componentKey = getInstanceKey(comp);

        if (childKeys.hasOwnProperty(componentKey))
          throw new Error('duplicate child prop keys: ' + jrc);
        else childKeys[componentKey] = true;
      });
    }

    if (!props) props = <P>{};

    props.children = args.length ? args : undefined;

    if (typeof jrc === 'function')
      return new jrc(props);
    else
      return new ComponentDOM(props, <string>jrc);
  }

  function updateProps(comp: any, el: JQuery, remove?: boolean) {
    Object.keys(comp.props).forEach(function(key) {
      var keyMap: string, value = comp.props[key];
      if (ATTRIBUTE_MAP.hasOwnProperty(key)) {

        keyMap = ATTRIBUTE_MAP[key];

        if (typeof value === 'function') {
          if (remove)
            el.unbind(keyMap);
          else
            el.bind(keyMap, value);
        }
        else if (key === STYLE) {
          Object.keys(value).forEach((style) => {
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

  function render<P extends Props>(comp: Component<P, any, any, any>, mount: JQuery, sibling?: JQuery): JQuery {
    var childSibling: JQuery,
      nextSibling: JQuery,
      renderResult: Component<any, any, any, any>,
      oldComp: Component<any, any, any, any>,
      el: JQuery,
      first = false,
      children: ComponentArray = [],
      childKeyElements: { [index: string]: boolean } = {},
      instanceKey: string = getInstanceKey(comp),
      oldHTML: string;

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

    } else {

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
      children.forEach((child) => {
        if (child instanceof Component)
          childKeyElements[getInstanceKey(child)] = true;
      });

      //unmount non-existant children
      el.children().each(function() {
        var jc = jQuery(this);
        if (!childKeyElements[getInstanceKey(getInstance(jc))])
          unmountElement(jc);
      });

      //render children
      children.forEach(function(child) {
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
      console.log(`rendered but same:\n${(<any>comp.constructor).name}\n${getInstanceKey(comp) }\n${oldHTML}`);
      console.dir(el.get(0));
    }

    return el;
  }

  export function renderDOM<P extends Props>(comp: Component<P, any, any, any>, m: JQuery) {
    var el: JQuery = render(comp, m);

    m.children().each(function() {
      if (this !== el[0])
        unmountElement(jQuery(this));
    });
  }

  function unmountElement(jc: JQuery) {
    var old = getInstance(jc), promise: any;
    if (old) {
      promise = old.componentWillUnmount();
      old.element = null;
      old.state = null;
      old.refs = {};
    }
    if (promise)
      jQuery.when(promise).done((promise) => { jc.remove });
    else jc.remove();
  }

  type Key = string | number;
  type ComponentArray = Array<string|number|Component<any, any, any, any>>;

  export interface Props {
    children?: ComponentArray;
    key?: Key;
    ref?: string;
    className?: string;
    state?: any;
    style?: React.CSSProperties;
    dangerouslySetInnerHTML?: {
      __html: string;
    };
  }

  export class Component<P extends Props, S, A, L> {
    public element: JQuery;
    public props: P;
    public state: S;
    public refs: { [index: string]: JQuery } = {};

    constructor(props: P) {
      let defaultProps = this.getDefaultProps();
      if (defaultProps)
        props = jQuery.extend(true, {}, defaultProps, props);
      this.props = props;
      if (typeof props.state !== 'undefined')
        this.state = props.state;
    }

    protected getDefaultProps(): P {
      return null;
    }

    public getTag(): string {
      return 'span';
    }

    public getElement(): JQuery {
      return this.element;
    }

    public setElement(element: JQuery) {
      this.element = element;
    }

    public getState(): any {
      return this.state;
    }

    public setState(state: S) {
      this.state = state;
    }

    public render<T extends Props>(): Component<T, any, any, any> {
      return null;
    }

    public reduce(state: S, action: Action<A, L>): S {
      return state;
    }

    public shouldComponentUpdate(nextProps: P, nextState: S): boolean {
      return (typeof nextState !== 'undefined' && !isSame(this.state, nextState)) || !isSame(this.props, nextProps);
    }

    public dispatch(action: Action<A, L>): void {
      let nextState: S = this.reduce(this.state, action);
      if(this.shouldComponentUpdate(this.props, nextState)) {
        this.setState(nextState);
        JReact.renderDOM(this.render(), this.element);
      }
    }

    public componentWillReceiveProps(nextProps: P) { }
    public componentWillMount() { }
    public componentDidMount() { }
    public componentWillUnmount(): void|any { }
    public componentDidUpdate() { }
  }

  class ComponentDOM<P extends Props> extends Component<P, any, any, any> {

    constructor(props: P, public tag: string) {
      super(props);
    }

    public getTag(): string {
      return this.tag;
    }

    public shouldComponentUpdate(nextProps: P, nextState: any): boolean {

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

      return super.shouldComponentUpdate(nextProps, nextState);
    }
  }

  export interface JQueryEventHandler {
    (e: JQueryEventObject): any
  }

  export interface DOMAttributes extends Props {
    onClick?: JQueryEventHandler;
    onChange?: JQueryEventHandler;
    onMouseUp?: JQueryEventHandler;
    onMouseDown?: JQueryEventHandler;
    onMouseMove?: JQueryEventHandler;
    onTouchStart?: JQueryEventHandler;
    onTouchEnd?: JQueryEventHandler;
    onTouchMove?: JQueryEventHandler;
    onContextMenu?: JQueryEventHandler;
  }
  
  export interface DomFactory {
    (props: DOMAttributes, ...args: ComponentArray): ComponentDOM<DOMAttributes>
  }
}
