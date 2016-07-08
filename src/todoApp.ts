/// <reference path="../typings/react/react.d.ts"/>
/// <reference path="../typings/es6-promise/es6-promise.d.ts"/>
/// <reference path="./counter.ts"/>
/// <reference path="./state.ts"/>
module Serkan {

  export class TodoApp extends React.Component<CounterProps, CounterState> {
    constructor(props: CounterProps, context: any) {
      super(props, context);
      //this.state = { clickCount: props && props.initialClickCount ? props.initialClickCount : 0 };
    }

    componentDidMount() {
      // Here the magic happens. Everytime that the
      // state is updated the app will re-render.
      // A real data driven app.
      State.on('update', () => this.forceUpdate());
    }

    handleNewTodoKeyDown(event: KeyboardEvent) {
      if (event.keyCode !== ENTER_KEY) {
        return;
      }

      event.preventDefault();
      State.trigger('todo:create', State.get().todoInput.trim());
    }

    updateTodoInput(e: any) {
      // Update inputs needs to be done synchronously,
      // so we use the now method.
      // We don't need to use a reaction for this.
      State.get().set({ todoInput: e.target.value }).now();
    }

    render() {
      var state = State.get(),
        todos = state.todos,
        activeCount = 0,
        completedCount = 0,
        headerClass = 'header ' + state.status,
        main: React.ReactNode = null,
        footer: React.ReactNode = null;
        
      // Let's count todos
      todos.forEach((todo) => {
        if (!todo.model.completed)
          activeCount++;
        else
          completedCount++;
      });

      if (todos.length) {
        footer = React.createElement(TodoFooter, { count: activeCount, completedCount: completedCount, nowShowing: state.filter });
        main = React.DOM.section({ className: 'main' }, React.createElement(TodoList, { todos: todos, filter: state.filter }));
      }

      return React.DOM.div(null,
        React.DOM.header({ className: headerClass }),
        React.DOM.h1(null, 'todos'),
        React.DOM.input({
          className: 'new-todo',
          ref: 'newField',
          value: state.todoInput,
          onChange: this.updateTodoInput.bind(this),
          placeholder: 'What needs to be done?',
          onKeyDown: this.handleNewTodoKeyDown.bind(this),
          autoFocus: true
        }),
        React.DOM.span({ className: 'loadingMessage' }, 'Saving...'),
        main,
        footer
        );
    }
  }
}
