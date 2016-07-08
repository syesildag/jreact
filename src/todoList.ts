/// <reference path="../typings/react/react.d.ts"/>
/// <reference path="../typings/es6-promise/es6-promise.d.ts"/>
/// <reference path="./counter.ts"/>
module Serkan {

  export interface TodoListState {
  }

  export interface TodoListProps {
    todos: ITodos,
    filter: Filter
  }

  export class TodoList extends React.Component<TodoListProps, TodoListState> {
    constructor(props: TodoListProps, context: any) {
      super(props, context);
      //this.state = { clickCount: props && props.initialClickCount ? props.initialClickCount : 0 };
    }

    render() {
      var todoItems: Array<React.ReactElement<TodoItemProps>> = [],
        filter = this.props.filter;

      this.props.todos.forEach((todo) => {
        if (filter === Filter.ALL || filter == Filter.COMPLETED && todo.model.completed || filter == Filter.ACTIVE && !todo.model.completed)
          todoItems.push(React.createElement(TodoItem, { todo: todo, key: todo.model.id }));
      });

      return React.DOM.ul({ className: 'todo-list' }, ...todoItems);
    }

    shouldComponentUpdate(nextProps: TodoListProps) {
      // Thanks to freezer's immutabilty we can check if there
      // has been a change in any todo just comparing the todo
      // object. This will boost our app performance drastically.
      return nextProps.todos != this.props.todos ||
        nextProps.filter != this.props.filter;
    }
  }
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
}
