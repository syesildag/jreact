/// <reference path="./jreact.ts"/>
/// <reference path="../typings/tsd.d.ts"/>
module JReactComponents {

  export interface TodoProps extends JReact.Props {
    todoClick?: (e: JQueryEventObject, message: string) => void,
    todo: TodoObject
  }

  export class Todo extends JReact.Component<TodoProps, any, any, any> {

    private static TODO_DIV = 'todo-div';

    constructor(props: TodoProps) {
      super(props);
    }

    public componentDidMount() {
      this.refs[Todo.TODO_DIV].effect('highlight');
    }

    public componentDidUpdate() {
      this.refs[Todo.TODO_DIV].effect('highlight');
    }

    public render() {
      let {todo, todoClick} = this.props;
      return JReact.createElement('div', {
        className: Todo.TODO_DIV + (todo.selected ? ' selected' : ''),
        style: {
          backgroundColor: 'beige'
        },
        ref: Todo.TODO_DIV,
        onClick: function(e: JQueryEventObject) {
          if (todoClick)
            todoClick.call(this, e, todo.message);
        }
      }, JReact.createElement('span', { className: 'todo-span', ref: 'todo-span' }, todo.message));
    }
  }
}
