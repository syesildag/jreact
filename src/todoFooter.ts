/// <reference path="../typings/react/react.d.ts"/>
/// <reference path="../typings/es6-promise/es6-promise.d.ts"/>
/// <reference path="./counter.ts"/>
module Serkan {

  export interface TodoFooterState {
  }

  export interface TodoFooterProps {
    count: number,
    completedCount: number,
    nowShowing: Serkan.Filter
  }

  export class TodoFooter extends React.Component<TodoFooterProps, TodoFooterState> {
    constructor(props: TodoFooterProps, context: any) {
      super(props, context);
      //this.state = { clickCount: props && props.initialClickCount ? props.initialClickCount : 0 };
    }

    handleClearCompleted() {
      State.trigger('todo:clearCompleted');
    }

    handleFilter(filter: string) {
      return function(e: Event) {
        e.preventDefault();
        State.trigger('todo:filter', filter);
      };
    }

    render() {


      var activeTodoWord = Utils.pluralize(this.props.count, 'item'),
        nowShowing = this.props.nowShowing,
        clearButton: React.DOMElement<React.HTMLAttributes, HTMLButtonElement> = null,
        allClass = nowShowing == Serkan.Filter.ALL ? 'selected' : '',
        activeClass = nowShowing == Serkan.Filter.ACTIVE ? 'selected' : '',
        completedClass = nowShowing == Serkan.Filter.COMPLETED ? 'selected' : '';

      if (this.props.completedCount > 0) {
        clearButton = React.DOM.button({
          className: 'clear-completed',
          onClick: this.handleClearCompleted.bind(this)
        }, 'Clear completed');
      }

      return React.DOM.footer({
        className: 'footer'
      },
        React.DOM.span({ className: 'todo-count' }, this.props.count + ' ' + activeTodoWord + ' left'),
        React.DOM.ul({ className: 'filters' },
          React.DOM.li(null,
            React.DOM.a({
              href: "#",
              className: 'allClass',
              onClick: this.handleFilter('all').bind(this)
            }, 'All')
            ),
          React.DOM.li(null,
            React.DOM.a({
              href: "#",
              className: 'activeClass',
              onClick: this.handleFilter('active').bind(this)
            }, 'Active')
            ),
          React.DOM.li(null,
            React.DOM.a({
              href: "#",
              className: 'completedClass',
              onClick: this.handleFilter('completed').bind(this)
            }, 'Completed')
            )
          ),
        clearButton
        );
    }
  }

  //TodoFooter.propTypes = {
  //  count: React.PropTypes.number.isRequired,
  //  completedCount: React.PropTypes.number.isRequired
  //};

  //TodoFooter.defaultProps = {
  //  count: 0,
  //  completedCount: 0,
  //  nowShowing: Serkan.Filter.ALL
  //};
}
