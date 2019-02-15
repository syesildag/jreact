
/**
 * @author SYESILDAG
 *
 */

import * as React from "react";
import * as ReactDOM from 'react-dom';
import * as Utils from '../utils';
import * as JReact from '../jreact';
import Wrap, {IWrap} from "./abstractWrapper";

import ReactElementProps = Utils.ReactElementProps;

import ReactInstance = Utils.ReactInstance;

export interface WrapperProps<E extends React.ReactElement<any> = React.ReactElement<any>> extends JReact.Props {
  element: E;
}

@Wrap
export default class Wrapper<E extends React.ReactElement<any> = React.ReactElement<any>> extends JReact.Component<WrapperProps<E>> implements IWrap {

  private readonly reactInstance: React.RefObject<ReactInstance<ReactElementProps<E>>>;

  constructor(props: WrapperProps<E>) {
    super(props);
    this.reactInstance = React.createRef<ReactInstance<ReactElementProps<E>>>();
  }

  private getRootElement() {
    return this.getElement()[0];
  }

  unmountElement() {
    ReactDOM.unmountComponentAtNode(this.getRootElement());
  }

  renderElement() {
    let clone = React.createElement(
      this.props.element.type,
      Utils.extend(this.props.element.props, {ref: this.reactInstance}),
      this.props.element.props.children
    );
    ReactDOM.render(clone, this.getElement()[0]);
  }

  public render() {
    return [] as JReact.ComponentArray;
  }
}
