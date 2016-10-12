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
    var TodoFooter = (function (_super) {
        __extends(TodoFooter, _super);
        function TodoFooter(props, context) {
            _super.call(this, props, context);
            //this.state = { clickCount: props && props.initialClickCount ? props.initialClickCount : 0 };
        }
        TodoFooter.prototype.handleClearCompleted = function () {
            State.trigger('todo:clearCompleted');
        };
        TodoFooter.prototype.handleFilter = function (filter) {
            return function (e) {
                e.preventDefault();
                State.trigger('todo:filter', filter);
            };
        };
        TodoFooter.prototype.render = function () {
            var activeTodoWord = Utils.pluralize(this.props.count, 'item'), nowShowing = this.props.nowShowing, clearButton = null, allClass = nowShowing == Serkan.Filter.ALL ? 'selected' : '', activeClass = nowShowing == Serkan.Filter.ACTIVE ? 'selected' : '', completedClass = nowShowing == Serkan.Filter.COMPLETED ? 'selected' : '';
            if (this.props.completedCount > 0) {
                clearButton = React.DOM.button({
                    className: 'clear-completed',
                    onClick: this.handleClearCompleted.bind(this)
                }, 'Clear completed');
            }
            return React.DOM.footer({
                className: 'footer'
            }, React.DOM.span({ className: 'todo-count' }, this.props.count + ' ' + activeTodoWord + ' left'), React.DOM.ul({ className: 'filters' }, React.DOM.li(null, React.DOM.a({
                href: "#",
                className: 'allClass',
                onClick: this.handleFilter('all').bind(this)
            }, 'All')), React.DOM.li(null, React.DOM.a({
                href: "#",
                className: 'activeClass',
                onClick: this.handleFilter('active').bind(this)
            }, 'Active')), React.DOM.li(null, React.DOM.a({
                href: "#",
                className: 'completedClass',
                onClick: this.handleFilter('completed').bind(this)
            }, 'Completed'))), clearButton);
        };
        return TodoFooter;
    }(React.Component));
    Serkan.TodoFooter = TodoFooter;
})(Serkan || (Serkan = {}));
//# sourceMappingURL=todoFooter.js.map