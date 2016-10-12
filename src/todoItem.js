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
    var TodoItem = (function (_super) {
        __extends(TodoItem, _super);
        function TodoItem(props, context) {
            _super.call(this, props, context);
            this.state = { editText: this.props.todo.title };
        }
        TodoItem.prototype.handleUpdate = function () {
            var todo = this.props.todo;
            State.trigger('todo:update', todo, todo.ui.input);
        };
        TodoItem.prototype.handleEdit = function () {
            this.props.todo.ui.set({ status: Serkan.Status.EDITING });
        };
        TodoItem.prototype.handleKeyDown = function (event) {
            if (event.which === Serkan.ESCAPE_KEY) {
                this.props.todo.ui.set({ status: Serkan.Status.READY });
            }
            else if (event.which === Serkan.ENTER_KEY) {
                this.handleUpdate();
            }
        };
        TodoItem.prototype.handleChange = function (event) {
            this.props.todo.ui.set({ input: event.target.value }).now();
        };
        TodoItem.prototype.handleToggle = function () {
            State.trigger('todo:toggle', this.props.todo);
        };
        TodoItem.prototype.handleDelete = function () {
            State.trigger('todo:delete', this.props.todo);
        };
        /**
         * Safely manipulate the DOM after updating the state when invoking
         * `this.props.onEdit()` in the `handleEdit` method above.
         * For more info refer to notes at https://facebook.github.io/react/docs/component-api.html#setstate
         * and https://facebook.github.io/react/docs/component-specs.html#updating-componentdidupdate
         */
        TodoItem.prototype.componentDidUpdate = function (prevProps, prevState, prevContext) {
            var status = this.props.todo.ui.status;
            if (prevProps.todo.ui.status != status && status == Serkan.Status.EDITING) {
                this.editField.focus();
                this.editField.setSelectionRange(this.editField.value.length, this.editField.value.length);
            }
        };
        TodoItem.prototype.render = function () {
            var _this = this;
            var todo = this.props.todo, className = Serkan.Status[todo.ui.status].toLowerCase(), content = null;
            if (todo.model.completed)
                className += ' completed';
            if ([Serkan.Status.EDITING, Serkan.Status.UPDATING].indexOf(todo.ui.status) != -1) {
                content = React.DOM.div({ className: 'editingTodo' }, React.DOM.input({
                    ref: function (c) { return _this.editField = c; },
                    className: 'edit',
                    value: todo.ui.input,
                    onBlur: this.handleUpdate.bind(this),
                    onChange: this.handleChange.bind(this),
                    onKeyDown: this.handleKeyDown.bind(this)
                }), React.DOM.span({ className: 'loadingMessage' }, 'Saving...'));
            }
            else {
                content = React.DOM.div({ className: 'view' }, React.DOM.input({
                    type: 'checkbox',
                    className: 'toggle',
                    checked: todo.model.completed,
                    onChange: this.handleToggle.bind(this)
                }), React.DOM.label({ onDoubleClick: this.handleEdit.bind(this) }, todo.model.title), React.DOM.button({ className: 'destroy', onClick: this.handleDelete.bind(this) }), React.DOM.span({ className: 'loadingMessage' }, 'Deleting...'));
            }
            return React.DOM.li({ className: className }, content);
        };
        return TodoItem;
    }(React.Component));
    Serkan.TodoItem = TodoItem;
})(Serkan || (Serkan = {}));
//# sourceMappingURL=todoItem.js.map