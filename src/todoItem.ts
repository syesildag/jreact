/// <reference path="../typings/react/react.d.ts"/>
/// <reference path="../typings/es6-promise/es6-promise.d.ts"/>
/// <reference path="./counter.ts"/>
module Serkan {
  export interface TodoItemState {
  }

  export interface TodoItemProps {
    todo: ITodo
  }

  export class TodoItem extends React.Component<TodoItemProps, TodoItemState> {
    private editField: HTMLInputElement;

    constructor(props: TodoItemProps, context: any) {
      super(props, context);
      this.state = { editText: this.props.todo.title };
    }

    handleUpdate() {
      var todo = this.props.todo;
      State.trigger('todo:update', todo, todo.ui.input);
    }

    handleEdit() {
      this.props.todo.ui.set({ status: Serkan.Status.EDITING });
    }

    handleKeyDown(event: KeyboardEvent) {
      if (event.which === ESCAPE_KEY) {
        this.props.todo.ui.set({ status: Serkan.Status.READY });
      } else if (event.which === ENTER_KEY) {
        this.handleUpdate();
      }
    }

    handleChange(event: any) {
      this.props.todo.ui.set({ input: event.target.value }).now();
    }

    handleToggle() {
      State.trigger('todo:toggle', this.props.todo);
    }

    handleDelete() {
      State.trigger('todo:delete', this.props.todo);
    }

    /**
     * Safely manipulate the DOM after updating the state when invoking
     * `this.props.onEdit()` in the `handleEdit` method above.
     * For more info refer to notes at https://facebook.github.io/react/docs/component-api.html#setstate
     * and https://facebook.github.io/react/docs/component-specs.html#updating-componentdidupdate
     */
    componentDidUpdate(prevProps: TodoItemProps, prevState: TodoItemState, prevContext: any) {
      var status = this.props.todo.ui.status;
      if (prevProps.todo.ui.status != status && status == Serkan.Status.EDITING) {
        this.editField.focus();
        this.editField.setSelectionRange(this.editField.value.length, this.editField.value.length);
      }
    }

    render() {
      var todo = this.props.todo,
        className = Serkan.Status[todo.ui.status].toLowerCase(),
        content: React.DOMElement<React.HTMLAttributes, HTMLDivElement> = null;

      if (todo.model.completed)
        className += ' completed';

      if ([Serkan.Status.EDITING, Serkan.Status.UPDATING].indexOf(todo.ui.status) != -1) {
        content = React.DOM.div({ className: 'editingTodo' },
          React.DOM.input({
            ref: (c: HTMLInputElement) => this.editField = c,
            className: 'edit',
            value: todo.ui.input,
            onBlur: this.handleUpdate.bind(this),
            onChange: this.handleChange.bind(this),
            onKeyDown: this.handleKeyDown.bind(this)
          }),
          React.DOM.span({ className: 'loadingMessage' }, 'Saving...')
          );
      }
      else {
        content = React.DOM.div({ className: 'view' },
          React.DOM.input({
            type: 'checkbox',
            className: 'toggle',
            checked: todo.model.completed,
            onChange: this.handleToggle.bind(this)
          }),

          React.DOM.label({ onDoubleClick: this.handleEdit.bind(this) }, todo.model.title),
          React.DOM.button({ className: 'destroy', onClick: this.handleDelete.bind(this) }),
          React.DOM.span({ className: 'loadingMessage' }, 'Deleting...')
          );
      }

      return React.DOM.li({ className: className }, content);
    }
  }
}
