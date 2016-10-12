var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/// <reference path="./jreact.ts"/>
/// <reference path="../typings/tsd.d.ts"/>
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
//# sourceMappingURL=jreactTodo.js.map