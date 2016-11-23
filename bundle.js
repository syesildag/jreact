var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/// <reference path="../typings/tsd.d.ts"/>
var JReact;
(function (JReact) {
    'use strict';
    JReact.DEBUG = false;
    var STYLE = 'style';
    var KEY = 'data-key';
    var INSTANCE = 'instance';
    var ATTRIBUTE_MAP = {
        key: KEY,
        style: STYLE,
        className: 'class',
        onChange: 'change',
        onClick: 'click',
        onMouseUp: 'mouseup',
        onMouseDown: 'mousedown',
        onMouseMove: 'mousemove',
        onTouchStart: 'touchstart',
        onTouchEnd: 'touchend',
        onTouchMove: 'touchmove',
        onContextMenu: 'contextmenu'
    };
    /**
     * FSA-compliant action.
     * @see https://github.com/acdlite/flux-standard-action
     *
     * @param {string} type
     * @param {object} payload
     * @param {boolean} error
     * @param {object} meta
     * @return {object} Action
     */
    var Action = (function () {
        function Action(type, payload, error, meta) {
            this.type = type;
            this.payload = payload;
            this.error = error;
            this.meta = meta;
        }
        return Action;
    }());
    JReact.Action = Action;
    var SPECIAL_CHARS_REGEXP = /([\:\-\_]+(.))/g;
    function camelCase(name) {
        return name
            .replace(SPECIAL_CHARS_REGEXP, function (_, separator, letter, offset) {
            return offset ? letter.toUpperCase() : letter;
        });
    }
    JReact.camelCase = camelCase;
    var SNAKE_CASE_REGEXP = /[A-Z]/g;
    function snake_case(name, separator) {
        if (separator === void 0) { separator = '_'; }
        return name.replace(SNAKE_CASE_REGEXP, function (letter, pos) {
            return (pos ? separator : '') + letter.toLowerCase();
        });
    }
    JReact.snake_case = snake_case;
    /**
     * A consistent way of creating unique IDs in angular. The ID is a sequence of alpha numeric
     * characters such as '012ABC'. The reason why we are not using simply a number counter is that
     * the number string gets longer over time, and it can also overflow, where as the nextId
     * will grow much slower, it is a string, and it will never overflow.
     *
     * @returns {string} an unique alpha-numeric string
     */
    var uid = ['0', '0', '0'];
    function nextUid() {
        var index = uid.length, digit;
        while (index--) {
            digit = uid[index].charCodeAt(0);
            if (digit == 57 /*'9'*/) {
                uid[index] = 'A';
                return uid.join('');
            }
            if (digit == 90 /*'Z'*/) {
                uid[index] = '0';
            }
            else {
                uid[index] = String.fromCharCode(digit + 1);
                return uid.join('');
            }
        }
        uid.unshift('0');
        return uid.join('');
    }
    JReact.nextUid = nextUid;
    function getInstance(el) {
        //return el.triggerHandler(SELF);
        return el.data(INSTANCE);
    }
    JReact.getInstance = getInstance;
    function setInstance(el, comp) {
        el.data(INSTANCE, comp);
        //el.bind(SELF, function() { return comp });
    }
    function getInstanceKey(comp) {
        var componentKey = comp.getTag(), key = comp.props.key;
        if (testString(key))
            componentKey += '[' + KEY + '=' + key + ']';
        return componentKey;
    }
    function isSame(myProps, nextProps) {
        if (myProps === nextProps)
            return true;
        if (Object.keys(myProps).length === Object.keys(nextProps).length)
            return Object.keys(myProps).every(function (prop) {
                return myProps[prop] === nextProps[prop];
            });
        return false;
    }
    JReact.isSame = isSame;
    function noop() { }
    JReact.noop = noop;
    function testString(value) {
        return value != null && value !== '';
    }
    JReact.testString = testString;
    function isString(value) {
        return typeof value === "string";
    }
    JReact.isString = isString;
    function isNumber(value) {
        return typeof value === "number";
    }
    JReact.isNumber = isNumber;
    function isStringOrNumber(value) {
        return isString(value) || isNumber(value);
    }
    JReact.isStringOrNumber = isStringOrNumber;
    function createElement(jrc, props) {
        var args = [];
        for (var _i = 2; _i < arguments.length; _i++) {
            args[_i - 2] = arguments[_i];
        }
        var childKeys = {};
        if (args.length > 1) {
            if (isStringOrNumber(args[0]))
                throw new Error('multiple children with string or number');
            args.forEach(function (child) {
                if (isStringOrNumber(child))
                    return;
                var comp = child, componentKey;
                if (!testString(comp.props.key))
                    throw new Error('partially defined child prop keys: ' + jrc);
                componentKey = getInstanceKey(comp);
                if (childKeys.hasOwnProperty(componentKey))
                    throw new Error('duplicate child prop keys: ' + jrc);
                else
                    childKeys[componentKey] = true;
            });
        }
        if (!props)
            props = {};
        props.children = args.length ? args : undefined;
        if (typeof jrc === 'function')
            return new jrc(props);
        else
            return new ComponentDOM(props, jrc);
    }
    JReact.createElement = createElement;
    function updateProps(comp, el, remove) {
        Object.keys(comp.props).forEach(function (key) {
            var keyMap, value = comp.props[key];
            if (ATTRIBUTE_MAP.hasOwnProperty(key)) {
                keyMap = ATTRIBUTE_MAP[key];
                if (typeof value === 'function') {
                    if (remove)
                        el.unbind(keyMap);
                    else
                        el.bind(keyMap, value);
                }
                else if (key === STYLE) {
                    Object.keys(value).forEach(function (style) {
                        el.css(style, remove ? '' : value[style]);
                    });
                }
                else {
                    if (remove)
                        el.removeAttr(keyMap);
                    else
                        el.attr(keyMap, value);
                }
            }
        }, comp);
    }
    function render(comp, mount, sibling) {
        var childSibling, nextSibling, renderResult, oldComp, el, first = false, children = [], childKeyElements = {}, instanceKey = getInstanceKey(comp), oldHTML;
        el = mount.children(instanceKey);
        if (el.length) {
            if (JReact.DEBUG)
                oldHTML = el.get(0).outerHTML;
            //move component
            if (sibling) {
                nextSibling = sibling.next();
                if (!nextSibling || getInstanceKey(getInstance(nextSibling)) !== instanceKey) {
                    el.detach();
                    sibling.after(el);
                }
            }
            oldComp = getInstance(el);
            if (!oldComp.shouldComponentUpdate(comp.props, comp.state))
                return el;
            if (typeof comp.state !== 'undefined')
                oldComp.state = comp.state;
            oldComp.componentWillReceiveProps(comp.props);
            updateProps(oldComp, el, true);
            oldComp.props = comp.props;
            updateProps(oldComp, el);
            comp = oldComp;
        }
        else {
            first = true;
            el = jQuery('<' + comp.getTag() + '/>');
            comp.setElement(el);
            setInstance(el, comp);
            comp.componentWillMount();
            updateProps(comp, el);
            if (sibling)
                sibling.after(el);
            else
                mount.prepend(el);
        }
        if (comp.props.dangerouslySetInnerHTML)
            el.html(comp.props.dangerouslySetInnerHTML.__html);
        else {
            renderResult = comp.render();
            if (renderResult)
                children.push(renderResult);
            else if (comp.props.children)
                children = comp.props.children;
            //create children hash
            children.forEach(function (child) {
                if (child instanceof Component)
                    childKeyElements[getInstanceKey(child)] = true;
            });
            //unmount non-existant children
            el.children().each(function () {
                var jc = jQuery(this);
                if (!childKeyElements[getInstanceKey(getInstance(jc))])
                    unmountElement(jc);
            });
            //render children
            children.forEach(function (child) {
                if (child instanceof Component) {
                    childSibling = render(child, el, childSibling);
                    if (testString(child.props.ref))
                        comp.refs[child.props.ref] = childSibling;
                }
                else
                    el.text(child);
            });
        }
        if (first)
            comp.componentDidMount();
        else
            comp.componentDidUpdate();
        if (JReact.DEBUG && !first && oldHTML === el.get(0).outerHTML) {
            console.log("rendered but same:\n" + comp.constructor.name + "\n" + getInstanceKey(comp) + "\n" + oldHTML);
            console.dir(el.get(0));
        }
        return el;
    }
    function renderDOM(comp, m) {
        var el = render(comp, m);
        m.children().each(function () {
            if (this !== el[0])
                unmountElement(jQuery(this));
        });
    }
    JReact.renderDOM = renderDOM;
    function unmountElement(jc) {
        var old = getInstance(jc), promise;
        if (old) {
            promise = old.componentWillUnmount();
            old.element = null;
            old.state = null;
            old.refs = {};
        }
        if (promise)
            jQuery.when(promise).done(function (promise) { jc.remove; });
        else
            jc.remove();
    }
    var Component = (function () {
        function Component(props) {
            this.refs = {};
            var defaultProps = this.getDefaultProps();
            if (defaultProps)
                props = jQuery.extend(true, {}, defaultProps, props);
            this.props = props;
            if (typeof props.state !== 'undefined')
                this.state = props.state;
        }
        Component.prototype.getDefaultProps = function () {
            return null;
        };
        Component.prototype.getTag = function () {
            return 'span';
        };
        Component.prototype.getElement = function () {
            return this.element;
        };
        Component.prototype.setElement = function (element) {
            this.element = element;
        };
        Component.prototype.getState = function () {
            return this.state;
        };
        Component.prototype.setState = function (state) {
            this.state = state;
        };
        Component.prototype.render = function () {
            return null;
        };
        Component.prototype.reduce = function (state, action) {
            return state;
        };
        Component.prototype.shouldComponentUpdate = function (nextProps, nextState) {
            return (typeof nextState !== 'undefined' && !isSame(this.state, nextState)) || !isSame(this.props, nextProps);
        };
        Component.prototype.dispatch = function (action) {
            var nextState = this.reduce(this.state, action);
            if (this.shouldComponentUpdate(this.props, nextState)) {
                this.setState(nextState);
                JReact.renderDOM(this.render(), this.element);
            }
        };
        Component.prototype.componentWillReceiveProps = function (nextProps) { };
        Component.prototype.componentWillMount = function () { };
        Component.prototype.componentDidMount = function () { };
        Component.prototype.componentWillUnmount = function () { };
        Component.prototype.componentDidUpdate = function () { };
        return Component;
    }());
    JReact.Component = Component;
    var ComponentDOM = (function (_super) {
        __extends(ComponentDOM, _super);
        function ComponentDOM(props, tag) {
            _super.call(this, props);
            this.tag = tag;
        }
        ComponentDOM.prototype.getTag = function () {
            return this.tag;
        };
        ComponentDOM.prototype.shouldComponentUpdate = function (nextProps, nextState) {
            if (!this.props.children && !nextProps.children)
                return false;
            if (this.props.children
                && this.props.children.length === 1
                && isStringOrNumber(this.props.children[0])
                && nextProps
                && nextProps.children.length === 1
                && isStringOrNumber(nextProps.children[0])
                && this.props.children[0] == nextProps.children[0])
                return false;
            return _super.prototype.shouldComponentUpdate.call(this, nextProps, nextState);
        };
        return ComponentDOM;
    }(Component));
})(JReact || (JReact = {}));
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
//Counter.propTypes = {
//  initialClickCount: React.PropTypes.number.isRequired
//};
//Counter.defaultProps = {
//  initialClickCount: 0
//};
//TodoFooter.propTypes = {
//  count: React.PropTypes.number.isRequired,
//  completedCount: React.PropTypes.number.isRequired
//};
//TodoFooter.defaultProps = {
//  count: 0,
//  completedCount: 0,
//  nowShowing: Counter.Filter.ALL
//};
/*
  TodoList.propTypes = {
    count: React.PropTypes.number.isRequired,
    completedCount: React.PropTypes.number.isRequired
  };
*/
//TodoList.defaultProps = {
//  todos: [],
//  filter: ''
//};
/// <reference path="../typings/react/react.d.ts"/>
/// <reference path="../typings/es6-promise/es6-promise.d.ts"/>
/// <reference path="./counter.ts"/>
/// <reference path="./state.ts"/>
var JReactComponents;
(function (JReactComponents) {
    var Todo = (function (_super) {
        __extends(Todo, _super);
        function Todo(props) {
            _super.call(this, props);
        }
        Todo.prototype.componentDidMount = function () {
            this.refs[Todo.TODO_DIV].effect('highlight');
        };
        Todo.prototype.componentDidUpdate = function () {
            this.refs[Todo.TODO_DIV].effect('highlight');
        };
        Todo.prototype.render = function () {
            var _a = this.props, todo = _a.todo, todoClick = _a.todoClick;
            return JReact.createElement('div', {
                className: Todo.TODO_DIV + (todo.selected ? ' selected' : ''),
                style: {
                    backgroundColor: 'beige'
                },
                ref: Todo.TODO_DIV,
                onClick: function (e) {
                    if (todoClick)
                        todoClick.call(this, e, todo.message);
                }
            }, JReact.createElement('span', { className: 'todo-span', ref: 'todo-span' }, todo.message));
        };
        Todo.TODO_DIV = 'todo-div';
        return Todo;
    }(JReact.Component));
    JReactComponents.Todo = Todo;
})(JReactComponents || (JReactComponents = {}));
/// <reference path="./jreact.ts"/>
/// <reference path="../typings/tsd.d.ts"/>
var JReactComponents;
(function (JReactComponents) {
    var AbstractBaseWidget = (function (_super) {
        __extends(AbstractBaseWidget, _super);
        function AbstractBaseWidget(props) {
            _super.call(this, props);
            this.CONTAINER = 'jreact-widget-' + this.getWidgetName() + '-container';
        }
        AbstractBaseWidget.prototype.getWidgetName = function () {
            throw new Error('should override widget name');
        };
        AbstractBaseWidget.prototype.getContainer = function () {
            return JReact.createElement.bind(null, 'span');
        };
        AbstractBaseWidget.prototype.getContainerProps = function () {
            return {};
        };
        AbstractBaseWidget.prototype.shouldComponentUpdate = function (nextProps, nextState) {
            var update = !JReact.isSame(this.props.widgetOptions, nextProps.widgetOptions) || !JReact.isSame(this.state, nextState);
            if (!update && this.props.children !== nextProps.children) {
                update = (this.props.children != null && nextProps.children == null)
                    || (this.props.children == null && nextProps.children != null)
                    || (this.props.children != null && nextProps.children != null
                        && (this.props.children.length !== nextProps.children.length
                            || this.props.children.some(function (child, idx) {
                                var nextChild = nextProps.children[idx], same = (JReact.isStringOrNumber(child) && JReact.isStringOrNumber(nextChild) && child == nextChild)
                                    || ((child instanceof JReact.Component)
                                        && (nextChild instanceof JReact.Component)
                                        && child.constructor.name === nextChild.constructor.name
                                        && !child.shouldComponentUpdate(nextChild.props, nextChild.state));
                                return !same;
                            })));
            }
            if (!update) {
                this.props = nextProps;
                this.state = nextState;
            }
            return update;
        };
        AbstractBaseWidget.prototype.componentWillReceiveProps = function (nextProps) {
            this.componentWillUnmount();
        };
        AbstractBaseWidget.prototype.render = function () {
            return this.getContainer().apply(void 0, [jQuery.extend({
                className: this.CONTAINER,
                ref: this.CONTAINER
            }, this.getContainerProps())].concat(this.props.children));
        };
        return AbstractBaseWidget;
    }(JReact.Component));
    JReactComponents.AbstractBaseWidget = AbstractBaseWidget;
    var AbstractWidget = (function (_super) {
        __extends(AbstractWidget, _super);
        function AbstractWidget(props) {
            _super.call(this, props);
        }
        AbstractWidget.prototype.componentDidMount = function () {
            this.refs[this.CONTAINER][this.getWidgetName()](this.props.widgetOptions || {});
        };
        AbstractWidget.prototype.componentWillUnmount = function () {
            this.refs[this.CONTAINER][this.getWidgetName()]('destroy');
        };
        AbstractWidget.prototype.componentDidUpdate = function () {
            this.refs[this.CONTAINER][this.getWidgetName()](this.props.widgetOptions || {});
        };
        return AbstractWidget;
    }(AbstractBaseWidget));
    JReactComponents.AbstractWidget = AbstractWidget;
    var Resizable = (function (_super) {
        __extends(Resizable, _super);
        function Resizable(props) {
            _super.call(this, props);
        }
        Resizable.prototype.getWidgetName = function () {
            return 'resizable';
        };
        Resizable.prototype.getContainer = function () {
            return JReact.createElement.bind(null, 'div');
        };
        Resizable.prototype.onResizeStop = function (ui) {
            this.state = ui.size;
        };
        Resizable.prototype.getDefaultProps = function () {
            return {
                widgetOptions: {
                    grid: [1, 1],
                    stop: function (e, ui) {
                        JReact.getInstance(jQuery(e.target).parent()).onResizeStop(ui);
                    }
                }
            };
        };
        Resizable.prototype.getContainerProps = function () {
            if (this.state)
                return {
                    style: {
                        width: this.state.width,
                        height: this.state.height
                    }
                };
            return _super.prototype.getContainerProps.call(this);
        };
        return Resizable;
    }(AbstractWidget));
    JReactComponents.Resizable = Resizable;
    var Accordion = (function (_super) {
        __extends(Accordion, _super);
        function Accordion(props) {
            _super.call(this, props);
        }
        Accordion.prototype.getWidgetName = function () {
            return 'accordion';
        };
        return Accordion;
    }(AbstractWidget));
    JReactComponents.Accordion = Accordion;
    var LongPress = (function (_super) {
        __extends(LongPress, _super);
        function LongPress(props) {
            _super.call(this, props);
        }
        LongPress.prototype.getWidgetName = function () {
            return 'longpress';
        };
        LongPress.prototype.getDefaultProps = function () {
            return {
                widgetOptions: {
                    delay: 500,
                    shortCallback: JReact.noop,
                    longCallback: JReact.noop
                }
            };
        };
        LongPress.prototype.clearTimeout = function () {
            clearTimeout(LongPress.timeout);
            LongPress.timeout = null;
        };
        LongPress.prototype.onMouseDown = function (e) {
            var _this = this;
            if (e.button === 0)
                LongPress.timeout = setTimeout(function () {
                    _this.props.widgetOptions.longCallback.call(_this, e);
                    LongPress.timeout = null;
                }, this.props.widgetOptions.delay);
        };
        LongPress.prototype.onMouseUp = function (e) {
            if (e.button === 0 && LongPress.timeout != null) {
                this.clearTimeout();
                this.props.widgetOptions.shortCallback.call(this, e);
            }
        };
        LongPress.prototype.onMouseMove = function (e) {
            if (LongPress.timeout != null)
                this.clearTimeout();
        };
        //private onContextMenu(e: JQueryEventObject) {
        //  if (this.timeout == null && e.type !== 'mouseup') {
        //    this.props.widgetOptions.longCallback.call(this, e);
        //    e.preventDefault();
        //    e.stopPropagation();
        //    return false;
        //  }
        //}
        LongPress.prototype.getContainerProps = function () {
            return {
                //onContextMenu: this.onContextMenu.bind(this),
                onMouseDown: this.onMouseDown.bind(this),
                onMouseUp: this.onMouseUp.bind(this),
                onMouseMove: this.onMouseMove.bind(this),
                onTouchStart: this.onMouseDown.bind(this),
                onTouchEnd: this.onMouseUp.bind(this),
                onTouchMove: this.onMouseMove.bind(this)
            };
        };
        LongPress.timeout = null;
        return LongPress;
    }(AbstractBaseWidget));
    JReactComponents.LongPress = LongPress;
})(JReactComponents || (JReactComponents = {}));
/// <reference path="./jreact.ts"/>
/// <reference path="../typings/tsd.d.ts"/>
var JReactComponents;
(function (JReactComponents) {
    var Todos = (function (_super) {
        __extends(Todos, _super);
        function Todos(props) {
            _super.call(this, props);
        }
        Todos.shortPress = function (e) {
            alert('shortpress');
        };
        Todos.longPress = function (e) {
            alert('longpress');
        };
        Todos.prototype.render = function () {
            var maps = [], active = 0, idx = 0, todoClick = this.props.todoClick;
            this.props.todos.forEach(function (todo) {
                var jReactComponent = JReact.createElement(JReactComponents.Todo, {
                    key: todo.key,
                    todo: todo,
                    todoClick: todoClick
                });
                if (todo.active)
                    active = idx;
                maps.push(JReact.createElement('span', { key: todo.key + 'header' }, todo.key + ' header'));
                maps.push(todo.resizable
                    ? JReact.createElement(JReactComponents.Resizable, {
                        key: todo.key,
                        className: 'resizable'
                    }, jReactComponent)
                    : JReact.createElement(JReactComponents.LongPress, {
                        key: todo.key,
                        className: 'longpress',
                        widgetOptions: {
                            longCallback: Todos.longPress,
                            shortCallback: Todos.shortPress
                        }
                    }, jReactComponent));
                idx++;
            });
            return JReact.createElement('div', { className: 'navbar-default', ref: 'todos-div' }, JReact.createElement.apply(JReact, [JReactComponents.Accordion, {
                widgetOptions: {
                    active: active,
                    heightStyle: 'content',
                    collapsible: true
                }
            }].concat(maps)));
        };
        return Todos;
    }(JReact.Component));
    JReactComponents.Todos = Todos;
})(JReactComponents || (JReactComponents = {}));
//# sourceMappingURL=bundle.js.map