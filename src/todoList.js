var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/// <reference path="../typings/react/react.d.ts"/>
/// <reference path="../typings/es6-promise/es6-promise.d.ts"/>
/// <reference path="./counter.ts"/>
var Serkan;
(function (Serkan) {
    var TodoList = (function (_super) {
        __extends(TodoList, _super);
        function TodoList(props, context) {
            _super.call(this, props, context);
            //this.state = { clickCount: props && props.initialClickCount ? props.initialClickCount : 0 };
        }
        TodoList.prototype.render = function () {
            var todoItems = [], filter = this.props.filter;
            this.props.todos.forEach(function (todo) {
                if (filter === Serkan.Filter.ALL || filter == Serkan.Filter.COMPLETED && todo.model.completed || filter == Serkan.Filter.ACTIVE && !todo.model.completed)
                    todoItems.push(React.createElement(Serkan.TodoItem, { todo: todo, key: todo.model.id }));
            });
            return (_a = React.DOM).ul.apply(_a, [{ className: 'todo-list' }].concat(todoItems));
            var _a;
        };
        TodoList.prototype.shouldComponentUpdate = function (nextProps) {
            // Thanks to freezer's immutabilty we can check if there
            // has been a change in any todo just comparing the todo
            // object. This will boost our app performance drastically.
            return nextProps.todos != this.props.todos ||
                nextProps.filter != this.props.filter;
        };
        return TodoList;
    }(React.Component));
    Serkan.TodoList = TodoList;
})(Serkan || (Serkan = {}));
//# sourceMappingURL=todoList.js.map