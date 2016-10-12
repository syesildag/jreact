var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
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
//# sourceMappingURL=jreactTodos.js.map