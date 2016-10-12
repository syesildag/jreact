var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
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
//# sourceMappingURL=jreactWidget.js.map