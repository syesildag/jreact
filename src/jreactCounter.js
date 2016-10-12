var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/// <reference path="./jreact.ts"/>
/// <reference path="../typings/tsd.d.ts"/>
var JReactComponents;
(function (JReactComponents) {
    var CounterActionType;
    (function (CounterActionType) {
        CounterActionType[CounterActionType["INCREMENT"] = 0] = "INCREMENT";
        CounterActionType[CounterActionType["DECREMENT"] = 1] = "DECREMENT";
        CounterActionType[CounterActionType["INCREMENT_ASYNC"] = 2] = "INCREMENT_ASYNC";
        CounterActionType[CounterActionType["DECREMENT_ASYNC"] = 3] = "DECREMENT_ASYNC";
    })(CounterActionType || (CounterActionType = {}));
    var Counter = (function (_super) {
        __extends(Counter, _super);
        function Counter(props) {
            _super.call(this, props);
        }
        //public shouldComponentUpdate(nextProps: any, nextState: any) {
        //  return !nextState || (nextState.times >= 0 && nextState.times <= 10);
        //}
        Counter.prototype.loading = function (loading, action) {
            if (loading === void 0) { loading = false; }
            switch (action.type) {
                case CounterActionType.INCREMENT_ASYNC:
                    return true;
                case CounterActionType.DECREMENT_ASYNC:
                    return true;
                default:
                    return false;
            }
        };
        Counter.prototype.times = function (times, action) {
            var _this = this;
            if (times === void 0) { times = 0; }
            switch (action.type) {
                case CounterActionType.INCREMENT:
                    return times >= 10 ? times : times + 1;
                case CounterActionType.DECREMENT:
                    return times <= 0 ? times : times - 1;
                case CounterActionType.INCREMENT_ASYNC:
                    setTimeout(function () {
                        _this.dispatch(new JReact.Action(CounterActionType.INCREMENT));
                    }, 1000);
                    return times;
                case CounterActionType.DECREMENT_ASYNC:
                    setTimeout(function () {
                        _this.dispatch(new JReact.Action(CounterActionType.DECREMENT));
                    }, 1000);
                default:
                    return times;
            }
        };
        Counter.prototype.reduce = function (state, action) {
            if (state === void 0) { state = {}; }
            return {
                times: this.times(state.times, action),
                loading: this.loading(state.loading, action)
            };
        };
        Counter.prototype.render = function () {
            var _this = this;
            return JReact.createElement('div', { className: 'counter-div' }, JReact.createElement('h2', { key: 1, className: 'counter-span' }, this.state.times + (this.state.loading ? '...' : '')), JReact.createElement('button', {
                key: 2,
                className: 'btn btn-primary',
                onClick: function () {
                    _this.dispatch(new JReact.Action(CounterActionType.DECREMENT_ASYNC));
                }
            }, 'DEC'), JReact.createElement('button', {
                key: 3,
                className: 'btn btn-primary',
                onClick: function () {
                    _this.dispatch(new JReact.Action(CounterActionType.INCREMENT_ASYNC));
                }
            }, 'INC'));
        };
        return Counter;
    }(JReact.Component));
    JReactComponents.Counter = Counter;
})(JReactComponents || (JReactComponents = {}));
//# sourceMappingURL=jreactCounter.js.map