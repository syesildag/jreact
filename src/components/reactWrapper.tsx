///<reference path="../utils.ts"/>

/**
 * @author SYESILDAG
 *
 */

import * as React from "react";
import * as JReact from '../jreact';

export interface WrapperProps<E extends JReact.Component<any> = JReact.Component<any>> {
  element: E;
}

// noinspection JSUnusedGlobalSymbols
export default class Wrapper<E extends JReact.Component<any> = JReact.Component<any>> extends React.Component<WrapperProps<E>> {

  private jQueryElement: JQuery;

  private readonly spanElementRef: React.RefObject<HTMLSpanElement>;

  constructor(props: WrapperProps<E>) {
    super(props);

    this.spanElementRef = React.createRef();
  }

  private getSpanElement() {
    return jQuery(this.spanElementRef.current);
  }

  public shouldComponentUpdate(nextProps: WrapperProps<E>): boolean {
    return true;
  }

  componentWillUpdate(nextProps: Readonly<WrapperProps<E>>) {
    this.unmountElement();
  }

  componentWillUnmount() {
    this.unmountElement();
  }

  private unmountElement() {
    JReact.unmountElement(this.getSpanElement());
  }

  componentDidUpdate() {
    this.renderReactElement();
  }

  componentDidMount() {
    this.renderReactElement();
  }

  private renderReactElement() {
    // noinspection AssignmentResultUsedJS
    this.props.element.props = {...this.props.element.props, ...{ref: (el: JQuery) => this.jQueryElement = el}};
    JReact.render(this.props.element, this.getSpanElement());
  }

  public render() {
    return <span ref={this.spanElementRef}/>;
  }
}
