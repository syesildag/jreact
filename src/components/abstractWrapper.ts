///<reference path="../functions.ts"/>

/**
 * @author SYESILDAG
 *
 */

export interface IWrap {

  unmountElement(): void;

  renderElement(): void;
}

export default function Wrap<T extends Functions.Constructor<IWrap>>(Base: T) {
  return class extends Base {

    constructor(...args: any[]) {
      super(...args);
    }

    shouldComponentUpdate(nextProps: any): boolean {
      return true;
    }

    componentWillReceiveProps(nextProps: any) {
      this.unmountElement();
    }

    componentWillUpdate(nextProps: any) {
      this.unmountElement();
    }

    componentWillUnmount() {
      this.unmountElement();
    }

    componentDidUpdate() {
      this.renderElement();
    }

    componentDidMount() {
      this.renderElement();
    }
  }
}
