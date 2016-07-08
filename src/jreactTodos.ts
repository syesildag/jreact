/// <reference path="./jreact.ts"/>
/// <reference path="../typings/tsd.d.ts"/>
module JReactComponents {

  export interface TodosProps extends JReact.Props {
    todoClick: (e: JQueryEventObject, message: string) => void,
    todos: Array<TodoObject>
  }

  export interface TodoObject {
    key: string,
    active: boolean,
    selected: boolean,
    resizable: boolean,
    message: number
  }

  export class Todos extends JReact.Component<TodosProps, any, any, any> {

    constructor(props: TodosProps) {
      super(props);
    }

    public static shortPress(e: JQueryEventObject) {
      alert('shortpress');
    }

    public static longPress(e: JQueryEventObject) {
      alert('longpress');
    }

    public render() {
      let maps: Array<JReact.Component<any, any, any, any>> = [],
        active = 0,
        idx = 0,
        {todoClick} = this.props;

      this.props.todos.forEach(function(todo: TodoObject) {
        let jReactComponent = JReact.createElement(Todo, {
          key: todo.key,
          todo: todo,
          todoClick: todoClick
        });

        if (todo.active)
          active = idx;

        maps.push(JReact.createElement('span', { key: todo.key + 'header' }, todo.key + ' header'));
        maps.push(todo.resizable
          ? JReact.createElement(Resizable,
            {
              key: todo.key,
              className: 'resizable'
            },
            jReactComponent)
          : JReact.createElement(LongPress,
            {
              key: todo.key,
              className: 'longpress',
              widgetOptions: {
                longCallback: Todos.longPress,
                shortCallback: Todos.shortPress
              }
            },
            jReactComponent));
        idx++;
      });

      return JReact.createElement('div',
        { className: 'navbar-default', ref: 'todos-div' },
        JReact.createElement(Accordion,
          {
            widgetOptions: {
              active: active,
              heightStyle: 'content',
              collapsible: true
            }
          }, ...maps));
    }
  }
}
