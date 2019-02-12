import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as JReact from '../jreact';
import * as Utils from '../utils';

import ReactElement = React.ReactElement;
import ReactElementType = Utils.ReactElementType;

export interface WrapperProps<E extends ReactElement<any, any>> extends JReact.Props {
  reactElement: E;
}

export default class Wrapper<E extends ReactElement<any, any>> extends JReact.Component<WrapperProps<E>> {

  private reactInstance: React.RefObject<ReactElementType<E>>;

  constructor(props: WrapperProps<E>) {
    super(props);
    this.reactInstance = React.createRef<ReactElementType<E>>();
  }

  public shouldComponentUpdate(nextProps: WrapperProps<E>): boolean {
    return true;
  }

  componentDidUpdate() {
    this.renderReactElement();
  }

  componentWillUnmount() {
    this.reactInstance.current.componentWillUnmount();
  }

  componentDidMount() {
    this.renderReactElement();
  }

  private renderReactElement() {
    let clone = React.createElement(
      this.props.reactElement.type,
      Utils.extend(this.props.reactElement.props, { ref: this.reactInstance }),
      this.props.reactElement.props.children
    );
    ReactDOM.render(clone, this.getElement()[0]);
  }

  public render() {
    return [] as JReact.ComponentArray;
  }
}
