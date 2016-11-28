/// <reference path="../typings/tsd.d.ts"/>
/// <reference path="./utils.ts"/>
/**
 * @author SYESILDAG
 * https://github.com/syesildag/jreact
 */
module JReact {
  'use strict';

  export var DEBUG: boolean = false;

  const INSTANCE: string = 'instance';

  export const KEY: string = 'data-key';
  const STYLE: string = 'style';
  const CLASS: string = 'class';

  var ATTRIBUTE_MAP: any = {
    key: KEY,
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
  export class Action<A, L> {
    constructor(
      public type: A,
      public payload?: L,
      public error?: boolean,
      public meta?: any) {
    }
  }

  export function getInstance<P extends Props>(el: JQuery): Component<P, any, any, any> {
    return el.data(INSTANCE);
  }

  function setInstance<P extends Props>(el: JQuery, comp: Component<P, any, any, any>) {
    el.data(INSTANCE, comp);
  }

  export function getInstanceKey<P extends Props>(comp: Component<P, any, any, any>): string {
    return getInstanceKeyFromTag(comp.getTag(), comp.props.key);
  }

  export function getInstanceKeyFromTag(tag: string, key: Key): string {
    var componentKey = tag;

    if (Utils.testString(key))
      componentKey += '[' + KEY + '=' + key + ']';

    return componentKey;
  }

  export function isSame(myProps: any, nextProps: any): boolean {
    if (myProps === nextProps)
      return true;

    if (Object.keys(myProps).length === Object.keys(nextProps).length)
      return Object.keys(myProps).every(function(prop) {
        return Utils.isFunction(myProps[prop]) || myProps[prop] === nextProps[prop];
      });

    return false;
  }

  export function NOOP() { }

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

      if (Utils.isStringOrNumber(args[0]))
        throw new Error('multiple children with string or number');

      args.forEach(function(child) {

        if (Utils.isStringOrNumber(child))
          return;

        var comp = <Component<P, any, any, any>>child,
          componentKey: string;

        if (!Utils.testString(comp.props.key))
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
          Object.keys(value).forEach(style => {
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

  export function render<P extends Props>(comp: Component<P, any, any, any>, mount: JQuery, sibling?: JQuery): JQuery {
    var childSibling: JQuery,
      nextSibling: JQuery,
      renderResult: Component<any, any, any, any>,
      oldComp: Component<any, any, any, any>,
      el: JQuery,
      first = false,
      alreadyMounted = false,
      children: ComponentArray = [],
      childKeyElements: { [index: string]: boolean } = {},
      instanceKey: string = getInstanceKey(comp),
      oldHTML: string;

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

    } else {

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
      comp.refs = {};
      children.forEach(function(child) {
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
      console.log(`rendered but same:\n${(<any>comp.constructor).name}\n${getInstanceKey(comp) }\n${oldHTML}`);
      console.dir(el.get(0));
    }

    return el;
  }

  export function renderDOM<P extends Props>(comp: Component<P, any, any, any>, m: JQuery): JQuery {
    var el: JQuery = render(comp, m);

    m.children().each(function() {
      if (this !== el[0])
        unmountElement(jQuery(this));
    });

    return el;
  }

  export function unmountElement(jc: JQuery) {
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

  export type Key = string | number;
  export type ComponentArray = Array<string|number|Component<any, any, any, any>>;

  export interface Props {
    children?: ComponentArray;
    key?: Key;
    ref?: string;
    className?: string;
    templateID?: string;
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

    protected getState(): any {
      return this.state;
    }

    protected setState(state: S) {
      this.state = state;
    }

    public render<T extends Props>(): Component<T, any, any, any> {
      return null;
    }

    public renderTemplate() { }

    protected reduce(state: S, action: Action<A, L>): S {
      return state;
    }

    public shouldComponentUpdate(nextProps: P, nextState: S): boolean {
      return (typeof nextState !== 'undefined' && !isSame(this.state, nextState)) || !isSame(this.props, nextProps);
    }

    protected dispatch(action: Action<A, L>): void {
      let nextState: S = this.reduce(this.state, action);
      if (this.shouldComponentUpdate(this.props, nextState)) {
        this.setState(nextState);
        let renderResult = this.render();
        if (renderResult)
          JReact.renderDOM(renderResult, this.element);
        else this.renderTemplate();
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
        && Utils.isStringOrNumber(this.props.children[0])
        && nextProps
        && nextProps.children.length === 1
        && Utils.isStringOrNumber(nextProps.children[0])
        && this.props.children[0] == nextProps.children[0])
        return false;

      return super.shouldComponentUpdate(nextProps, nextState);
    }
  }

  export interface AutoTemplateProps<D, T, C extends AutoTemplateProps<T, any, any>> extends JReact.Props {
    name?: string;
    nameSpace?: string;
    tag?: string;
    data?: D;
    components?: Array<C>;
  }

  export class AutoTemplate<D, T, P extends AutoTemplateProps<D, T, any>, S, A, L> extends JReact.Component<P, S, A, L> {

    constructor(props: P) {
      super(props);
    }

    public getTag(): string {
      return this.props.tag;
    }

    protected getComponents(): Array<AutoTemplateProps<T, any, any>> {
      return this.props.components;
    }

    protected getComponentByKey(key: Key): AutoTemplateProps<T, any, any> {
      let components = this.getComponents();

      if (components)
        for (let component of components)
          if (component.key === key)
            return component;

      return null;
    }

    protected getTemplateHTML(): string {
      return JReact.getTemplateContent(this.props.templateID);
    }

    public renderTemplate() {
      let templateHTML = this.getTemplateHTML();
      this.preRenderTemplate();
      if (!Utils.isUndefined(templateHTML))
        this.getElement().html(templateHTML);
      this.postRenderTemplate();
    }

    protected preRenderTemplate() {
      let childKeyElements: { [index: string]: boolean } = {}, components = this.getComponents();
      
      //create children hash
      if (components)
        components.forEach(component => {
          childKeyElements[JReact.getInstanceKeyFromTag(component.tag, component.key)] = true;
        });
        
      //unmount non-existant children
      this.getElement().children('[' + JReact.KEY + ']').each(function() {
        var jc = jQuery(this);
        if (!childKeyElements[JReact.getInstanceKey(JReact.getInstance(jc))])
          JReact.unmountElement(jc);
      });

      this._preRenderTemplate();
    }

    protected _preRenderTemplate() {
    }

    protected postRenderTemplate() {

      let components = this.getComponents(), sibling: JQuery = null, templateHTML = this.getTemplateHTML();

      //render children
      this.refs = {};
      if (components)
        components.forEach(component => {
          sibling = JReact.render(JReact.createElement(eval(component.nameSpace + "." + component.name), component), this.getElement(), Utils.isUndefined(templateHTML) ? sibling : undefined);
          this.refs[component.key] = sibling;
        });

      this._postRenderTemplate();
    }

    protected _postRenderTemplate() {
    }
  }

  export interface JQueryEventHandler {
    (e: JQueryEventObject): any
  }

  export interface DOMAttributes extends Props {
    colspan?: number;
    change?: JQueryEventHandler;
    click?: JQueryEventHandler;
    mouseup?: JQueryEventHandler;
    mousedown?: JQueryEventHandler;
    mousemove?: JQueryEventHandler;
    touchstart?: JQueryEventHandler;
    touchend?: JQueryEventHandler;
    touchmove?: JQueryEventHandler;
    contextmenu?: JQueryEventHandler;
  }

  export interface DomFactory {
    (props: DOMAttributes, ...args: ComponentArray): ComponentDOM<DOMAttributes>
  }

  let templateCache: { [index: string]: string } = {};

  export function getTemplateContent(id: string) {
    return templateCache[id];
  }

  export function bootstrap(document: Document) {
    var script: HTMLScriptElement, scriptType = 'text/html';
    for (var index = 0; index < document.scripts.length; index++) {
      script = document.scripts[index] as HTMLScriptElement;
      if (script.type === scriptType && script.id)
        templateCache[script.id] = script.text;
    }
  }
}
