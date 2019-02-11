import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as JReact from '../jreact';

import ReactElement = React.ReactElement;

export interface WrapperProps<E extends ReactElement<any, any>> extends JReact.Props {
  reactElement: E;
}

export default class Wrapper<E extends ReactElement<any, any>> extends JReact.Component<WrapperProps<E>> {

  constructor(props: WrapperProps<E>) {
    super(props);
  }

  public shouldComponentUpdate(nextProps: WrapperProps<E>): boolean {
    return true;
  }

  componentDidUpdate() {
    this.renderReactElement();
  }

  componentDidMount() {
    this.renderReactElement();
  }

  private renderReactElement() {
    ReactDOM.render(this.props.reactElement, this.getElement()[0]);
  }

  public render() {
    return [] as JReact.ComponentArray;
  }
}
