/// <reference path="../jreact.ts"/>
import * as JReact from '../jreact';

export interface CounterProps extends JReact.Props {
  times?: number,
}

export interface CounterState extends CounterProps {
  loading?: boolean
}

enum CounterActionType {
  INCREMENT,
  DECREMENT,
  INCREMENT_ASYNC,
  DECREMENT_ASYNC
}

export default class Counter extends JReact.Component<CounterProps, CounterState, CounterActionType> {

  constructor(props: CounterProps) {
    super(props);
    this.state = {
      times: this.props.times,
      loading: false,
    }
  }

  private loading(loading: boolean = false, action: JReact.Action<CounterActionType, any>): boolean {
    switch (action.type) {
      case CounterActionType.INCREMENT_ASYNC:
        return true;
      case CounterActionType.DECREMENT_ASYNC:
        return true;
      default:
        return false;
    }
  }

  // noinspection FunctionWithMultipleReturnPointsJS
  private times(times: number = 0, action: JReact.Action<CounterActionType, any>): number {
    // noinspection FallThroughInSwitchStatementJS
    switch (action.type) {
      case CounterActionType.INCREMENT:
        return times + 1;
      case CounterActionType.DECREMENT:
        return times - 1;
      case CounterActionType.INCREMENT_ASYNC:
        // noinspection MagicNumberJS
        setTimeout(() => {
          this.dispatch(new JReact.Action(CounterActionType.INCREMENT));
        }, 1000);
        return times;
      case CounterActionType.DECREMENT_ASYNC:
        // noinspection MagicNumberJS
        setTimeout(() => {
          this.dispatch(new JReact.Action(CounterActionType.DECREMENT));
        }, 1000);
      default:
        return times;
    }
  }

  public reduce(state: CounterState = {}, action: JReact.Action<CounterActionType, any>): CounterState {
    return {
      times: this.times(state.times, action),
      loading: this.loading(state.loading, action)
    };
  }

  public render() {
    return JReact.createElement('div', {className: 'counter-div'},
      JReact.createElement('h2', {
        key: 1,
        className: 'counter-span'
      }, this.state.times + (this.state.loading ? '...' : '')),

      JReact.createElement('button', {
        key: 2,
        className: 'btn btn-primary',
        click: () => {
          this.dispatch(new JReact.Action(CounterActionType.DECREMENT_ASYNC));
        }
      }, 'DEC'),

      JReact.createElement('button', {
        key: 3,
        className: 'btn btn-primary',
        click: () => {
          this.dispatch(new JReact.Action(CounterActionType.INCREMENT_ASYNC));
        }
      } as JReact.DOMAttributes, 'INC')
    );
  }
}
