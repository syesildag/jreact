import * as React from 'react';
import * as jQuery from 'jquery';
import * as JReact from './jreact';
import Wrapper from './components/jreactWrapper';

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
      reactElement: React.createElement('input',
        {
          onClick: onClick,
          type: "button",
          key: "bk",
          className: "button_class",
          value: "Click me"
        })
    }
  ), $('#react-wrapper'));
});