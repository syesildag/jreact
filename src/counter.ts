/// <reference path="../typings/tsd.d.ts"/>
module Serkan {
  'use strict';

  export const ENTER_KEY = 13;
  export const ESCAPE_KEY = 27;

  export const KEY_CODE = {
    ENTER: 13,
    ESCAPE: 27,
    SPACE: 32,
    LEFT_ARROW: 37,
    UP_ARROW: 38,
    RIGHT_ARROW: 39,
    DOWN_ARROW: 40
  };

  export const FREEZER_TODOS = 'freezerTodos';
  export const LAG = 500;

  export enum Status { EDITING, READY, LOADING, DELETING, UPDATING };
  export enum Filter { ALL, COMPLETED, ACTIVE };

  export interface CounterState {
    clickCount: number;
  }

  export interface CounterProps {
    initialClickCount: number;
  }

  export class Counter extends React.Component<CounterProps, CounterState> {

    constructor(props: CounterProps, context: any) {
      super(props, context);
      debugger;
      this.state = { clickCount: props && props.initialClickCount ? props.initialClickCount : 0 };
    }

    handleClick() {
      var p = new Promise((resolve, reject) => {
        setTimeout(function(cc: number) {
          this.setState({ clickCount: cc + 1 });
          resolve('finished handleClick...');
        }.bind(this), 500, this.state.clickCount);
      });

      console.log('clicked...');

      p.then((s: string) => { console.log("resolve: " + s); })
        .catch((e: any) => { console.log("reject: " + JSON.stringify(e)); });
    }

    componentWillMount() {
      //Invoked once, both on the client and server, immediately before the initial rendering occurs.
      //If you call setState within this method, render() will see the updated state and will be executed only once despite the state change.
      debugger;
      console.log('componentWillMount');
    }

    componentDidMount() {
      //Invoked once, only on the client (not on the server), immediately after the initial rendering occurs.
      //At this point in the lifecycle, you can access any refs to your children (e.g., to access the underlying DOM representation).
      //The componentDidMount() method of child components is invoked before that of parent components.
      //If you want to integrate with other JavaScript frameworks, set timers using setTimeout or setInterval, or send AJAX requests, perform those operations in this method.
      debugger;
      console.log('componentDidMount');
    }

    componentWillReceiveProps(nextProps: CounterProps, nextContext: any) {
      //Invoked when a component is receiving new props.
      //This method is not called for the initial render.
      //Use this as an opportunity to react to a prop transition before render() is called by updating the state using this.setState().
      //The old props can be accessed via this.props. Calling this.setState() within this function will not trigger an additional render.
      debugger;
      console.log('componentWillReceiveProps ' + JSON.stringify(nextProps) + '-' + JSON.stringify(nextContext));
    }

    shouldComponentUpdate(nextProps: CounterProps, nextState: CounterState, nextContext: any) {
      //Invoked before rendering when new props or state are being received.This method is not called for the initial render or when forceUpdate is used.
      //Use this as an opportunity to return false when you're certain that the transition to the new props and state will not require a component update.
      //If shouldComponentUpdate returns false, then render() will be completely skipped until the next state change.In addition, componentWillUpdate and componentDidUpdate will not be called.
      //By default, shouldComponentUpdate always returns true to prevent subtle bugs when state is mutated in place, but if you are careful to always treat state as immutable and to read only from props and state in render() then you can override shouldComponentUpdate with an implementation that compares the old props and state to their replacements.
      //If performance is a bottleneck, especially with dozens or hundreds of components, use shouldComponentUpdate to speed up your app.
      debugger;
      console.log('shouldComponentUpdate ' + JSON.stringify(nextProps) + '-' + JSON.stringify(nextState) + '-' + JSON.stringify(nextContext));
      return nextState.clickCount < 11;
    }

    componentWillUpdate(nextProps: CounterProps, nextState: CounterState, nextContext: any) {
      //Invoked immediately before rendering when new props or state are being received. This method is not called for the initial render.
      //Use this as an opportunity to perform preparation before an update occurs.
      debugger;
      console.log('componentWillUpdate ' + JSON.stringify(nextProps) + '-' + JSON.stringify(nextState) + '-' + JSON.stringify(nextContext));
    }

    componentDidUpdate(prevProps: CounterProps, prevState: CounterState, prevContext: any) {
      //Invoked immediately after the component's updates are flushed to the DOM. This method is not called for the initial render.
      //Use this as an opportunity to operate on the DOM when the component has been updated.
      debugger;
      console.log('componentDidUpdate ' + JSON.stringify(prevProps) + '-' + JSON.stringify(prevState) + '-' + JSON.stringify(prevContext));
    }

    componentWillUnmount() {
      //Invoked immediately before a component is unmounted from the DOM.
      //Perform any necessary cleanup in this method, such as invalidating timers or cleaning up any DOM elements that were created in componentDidMount.
      debugger;
      console.log('componentWillUnmount');
    }

    render() {
      //      return (
      //        <h2 className="xxx" onClick={this.handleClick.bind(this)}>
      //          <span>
      //            Click me! Number of clicks: {this.state.clickCount}
      //          </span>
      //          <svg width="30" height="30">
      //            <circle r={10 + this.state.clickCount} cx="15" cy = "15" />
      //          </svg>
      //        </h2>
      //      );
      debugger;
      return React.DOM.h2({ className: 'xxx', onClick: this.handleClick.bind(this) },
        React.DOM.span({}, 'Click me! Number of clicks: ' + this.state.clickCount),
        React.DOM.svg({ width: 30, height: 30 }, React.DOM.circle({ r: 10 + this.state.clickCount, cx: 15, cy: 15 })));
      //React.DOM.span({ dangerouslySetInnerHTML: { __html: React.renderToString(React.DOM.svg({ width: 30, height: 30 }, React.DOM.circle({ r: 10 + this.state.clickCount, cx: 15, cy: 15 }))) } }));
    }
  }

  //Counter.propTypes = {
  //  initialClickCount: React.PropTypes.number.isRequired
  //};

  //Counter.defaultProps = {
  //  initialClickCount: 0
  //};
}
