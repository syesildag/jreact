var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/// <reference path="../typings/react/react.d.ts"/>
/// <reference path="../typings/es6-promise/es6-promise.d.ts"/>
/// <reference path="./counter.ts"/>
/// <reference path="./state.ts"/>
var Serkan;
(function (Serkan) {
    var TodoApp = (function (_super) {
        __extends(TodoApp, _super);
        function TodoApp(props, context) {
            _super.call(this, props, context);
            //this.state = { clickCount: props && props.initialClickCount ? props.initialClickCount : 0 };
        }
        TodoApp.prototype.componentDidMount = function () {
            var _this = this;
            // Here the magic happens. Everytime that the
            // state is updated the app will re-render.
            // A real data driven app.
            State.on('update', function () { return _this.forceUpdate(); });
        };
        TodoApp.prototype.handleNewTodoKeyDown = function (event) {
            if (event.keyCode !== Serkan.ENTER_KEY) {
                return;
            }
            event.preventDefault();
            State.trigger('todo:create', State.get().todoInput.trim());
        };
        TodoApp.prototype.updateTodoInput = function (e) {
            // Update inputs needs to be done synchronously,
            // so we use the now method.
            // We don't need to use a reaction for this.
            State.get().set({ todoInput: e.target.value }).now();
        };
        TodoApp.prototype.render = function () {
            var state = State.get(), todos = state.todos, activeCount = 0, completedCount = 0, headerClass = 'header ' + state.status, main = null, footer = null;
            // Let's count todos
            todos.forEach(function (todo) {
                if (!todo.model.completed)
                    activeCount++;
                else
                    completedCount++;
            });
            if (todos.length) {
                footer = React.createElement(Serkan.TodoFooter, { count: activeCount, completedCount: completedCount, nowShowing: state.filter });
                main = React.DOM.section({ className: 'main' }, React.createElement(Serkan.TodoList, { todos: todos, filter: state.filter }));
            }
            return React.DOM.div(null, React.DOM.header({ className: headerClass }), React.DOM.h1(null, 'todos'), React.DOM.input({
                className: 'new-todo',
                ref: 'newField',
                value: state.todoInput,
                onChange: this.updateTodoInput.bind(this),
                placeholder: 'What needs to be done?',
                onKeyDown: this.handleNewTodoKeyDown.bind(this),
                autoFocus: true
            }), React.DOM.span({ className: 'loadingMessage' }, 'Saving...'), main, footer);
        };
        return TodoApp;
    }(React.Component));
    Serkan.TodoApp = TodoApp;
})(Serkan || (Serkan = {}));
//# sourceMappingURL=todoApp.js.map