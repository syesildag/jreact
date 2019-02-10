import * as JReact from './jreact';
import * as jQuery from 'jquery';

jQuery(($) => {
  JReact.render(JReact.createElement(
    'span',
    { key: "test", className: 'titi' },
    'hello'),
    $('#container'));
});