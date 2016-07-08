/// <reference path="./jreact.ts"/>
/// <reference path="../typings/tsd.d.ts"/>
module JReactComponents {

  interface CounterProps extends JReact.Props {
    state?: CounterState
  }

  interface CounterState {
    times?: number,
    loading?: boolean
  }

  enum CounterActionType {
    INCREMENT,
    DECREMENT,
    INCREMENT_ASYNC,
    DECREMENT_ASYNC
  }

  export class Counter extends JReact.Component<CounterProps, CounterState, CounterActionType, any> {
    
    constructor(props: CounterProps) {
      super(props);
    }
    
    //public shouldComponentUpdate(nextProps: any, nextState: any) {
    //  return !nextState || (nextState.times >= 0 && nextState.times <= 10);
    //}
    
    private loading(loading: boolean = false, action: JReact.Action<CounterActionType, any>) : boolean {
      switch (action.type) {
        case CounterActionType.INCREMENT_ASYNC:
          return true;
        case CounterActionType.DECREMENT_ASYNC:
          return true;
        default:
          return false;
      }
    }
    
    private times(times: number = 0, action: JReact.Action<CounterActionType, any>) : number {
      switch (action.type) {
        case CounterActionType.INCREMENT:
          return times >= 10 ? times : times + 1;
        case CounterActionType.DECREMENT:
          return times <= 0 ? times : times - 1;
        case CounterActionType.INCREMENT_ASYNC:
          setTimeout(() => {
            this.dispatch(new JReact.Action(CounterActionType.INCREMENT));
          }, 1000);
          return times;
        case CounterActionType.DECREMENT_ASYNC:
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
      return JReact.createElement('div', { className: 'counter-div' },
        JReact.createElement('h2', { key: 1, className: 'counter-span' }, this.state.times + (this.state.loading ? '...' : '')),
        
        JReact.createElement('button', {
          key: 2,
          className: 'btn btn-primary',
          onClick: () => {
            this.dispatch(new JReact.Action(CounterActionType.DECREMENT_ASYNC));
          }
        }, 'DEC'),
        
        JReact.createElement('button', {
          key: 3,
          className: 'btn btn-primary',
          onClick: () => {
            this.dispatch(new JReact.Action(CounterActionType.INCREMENT_ASYNC));
          }
        }, 'INC')
        );
    }
  }
}
