import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as JReact from '../jreact';
import * as Utils from '../utils';

import ReactElement = React.ReactElement;

export interface WrapperProps<E extends ReactElement<any, any>> extends JReact.Props {
  reactElement: E;
  children: never;
}

export default class Wrapper<E extends ReactElement<any, any>> extends JReact.Component<WrapperProps<E>> {

  private reactInstance = React.createRef<Utils.ReactElementType<E>>();

  constructor(props: WrapperProps<E>) {
    super(props);
  }

  shouldComponentUpdate(nextProps: WrapperProps<E>) {
    return this.reactInstance.current.shouldComponentUpdate(nextProps.reactElement.props);
  }

  public componentWillMount() {
    this.reactInstance.current.componentWillMount();
  }

  componentWillUnmount() {
    this.reactInstance.current.componentWillUnmount();
  }

  componentDidMount() {
    this.props.reactElement.props.ref = this.reactInstance;
    ReactDOM.render(this.props.reactElement, this.getElement()[0]);
  }

  public render() {
    return [] as JReact.ComponentArray;
  }
}
