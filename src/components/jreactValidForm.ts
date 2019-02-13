import * as JReact from '../jreact';
import * as Utils from '../utils';
import * as jQuery from 'jquery';

export default class ValidForm<P extends JReact.Props, S, A, L> extends JReact.Component<P, S, A, L> {

  constructor(props: P) {
    super(props);
  }

  public componentDidMount() {
    this.validate();
  }

  public componentDidUpdate(prevProps: P, prevState: S) {
    this.validate(prevProps, prevState);
  }

  // noinspection JSUnusedLocalSymbols
  protected validate(prevProps?: P, prevState?: S) {
    let el = this.getElement();

    el.children('[' + JReact.DATA_PATTERN + ']').each((index: number, elem: Element) => {
      let
        regexp: RegExp,
        inputValue: any,
        $elem = jQuery(elem),
        pattern = $elem.attr(JReact.DATA_PATTERN);

      if (!pattern)
        throw new Error(`missing pattern ${elem}`);

      regexp = (Utils.FORMAT_VALUES as any)[pattern];
      if (!regexp)
        throw new Error(`invalid pattern ${pattern}`);

      inputValue = $elem.val();

      if (!inputValue || inputValue.match(regexp)) {
        //VALID
        $elem.addClass(JReact.RSL_VALID_PATTERN);
        $elem.removeClass(JReact.RSL_INVALID_PATTERN);
      }
      else {
        //INVALID
        $elem.addClass(JReact.RSL_INVALID_PATTERN);
        $elem.removeClass(JReact.RSL_VALID_PATTERN);
      }
    });
  }
}
