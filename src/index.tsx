import * as React from 'react';
import * as jQuery from 'jquery';
import * as JReact from './jreact';
import Wrapper from './components/jreactWrapper';
import Counter from './components/jreactCounter';

let onClick = (e: React.MouseEvent) => {
  alert('clicked');
  console.dir(e);
}

jQuery(($) => {
  JReact.render(JReact.createElement(
    'span',
    {
      key: "test",
      className: 'titi'
    },
    'JReact Span'
  ), $('#container'));

  JReact.render(JReact.createElement<Wrapper<any>>(
    Wrapper,
    {
      key: "test",
      reactElement: React.createElement('div',
        {
          onClick: onClick,
          key: "bk",
          className: "button_class",
          value: "Click me"
        }, <button>ClickMe</button>)
    }
  ), $('#react-wrapper'));

  JReact.render(JReact.createElement(
    Counter,
    {
      key: "test",
      className: 'titi',
      times: 666,
    },
    'JReact Span'
  ), $('#jreact-counter'));
});