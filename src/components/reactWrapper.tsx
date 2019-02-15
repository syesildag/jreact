/**
 * @author SYESILDAG
 *
 */

import * as React from "react";
import * as JReact from "../jreact";
import Wrap, {IWrap} from "./abstractWrapper";

export interface WrapperProps<E extends JReact.Component<any> = JReact.Component<any>> {
  element: E;
}

@Wrap
export default class Wrapper<E extends JReact.Component<any> = JReact.Component<any>> extends React.Component<WrapperProps<E>> implements IWrap {

  private jQueryElement: JQuery;

  private readonly spanElementRef: React.RefObject<HTMLSpanElement>;

  constructor(props: WrapperProps<E>) {
    super(props);

    this.spanElementRef = React.createRef();
  }

  private getRootElement() {
    return jQuery(this.spanElementRef.current);
  }

  unmountElement() {
    JReact.unmountElement(this.getRootElement());
  }

  renderElement() {
    // noinspection AssignmentResultUsedJS
    this.props.element.props = {...this.props.element.props, ...{ref: (el: JQuery) => this.jQueryElement = el}};
    JReact.render(this.props.element, this.getRootElement());
  }

  public render() {
    return <span ref={this.spanElementRef}/>;
  }
}
