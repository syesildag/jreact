/// <reference path="./jreact.ts"/>
/// <reference path="../typings/tsd.d.ts"/>
module JReactComponents {

  export interface WidgetProps<O> extends JReact.Props {
    widgetOptions?: O
  }

  export class AbstractBaseWidget<O, P extends WidgetProps<O>> extends JReact.Component<P, any, any, any> {

    protected CONTAINER: string;

    constructor(props: P) {
      super(props);

      this.CONTAINER = 'jreact-widget-' + this.getWidgetName() + '-container';
    }

    protected getWidgetName(): string {
      throw new Error('should override widget name');
    }

    protected getContainer(): JReact.DomFactory {
      return JReact.createElement.bind(null, 'span');
    }

    protected getContainerProps(): JReact.DOMAttributes {
      return {};
    }

    public shouldComponentUpdate(nextProps: P, nextState: any): boolean {
      var update = !JReact.isSame(this.props.widgetOptions, nextProps.widgetOptions) || !JReact.isSame(this.state, nextState);

      if (!update && this.props.children !== nextProps.children) {
        update = (this.props.children != null && nextProps.children == null)
        || (this.props.children == null && nextProps.children != null)
        || (this.props.children != null && nextProps.children != null
          && (this.props.children.length !== nextProps.children.length
            || this.props.children.some((child, idx) => {
              var nextChild = nextProps.children[idx],
                same =
                  (JReact.isStringOrNumber(child) && JReact.isStringOrNumber(nextChild) && child == nextChild)
                  || ((child instanceof JReact.Component)
                    && (nextChild instanceof JReact.Component)
                    && (<any>child.constructor).name === (<any>nextChild.constructor).name
                    && !child.shouldComponentUpdate(nextChild.props, nextChild.state));
              return !same;
            })));
      }

      if (!update) {
        this.props = nextProps;
        this.state = nextState;
      }

      return update;
    }

    public componentWillReceiveProps(nextProps: P) {
      this.componentWillUnmount();
    }

    public render() {
      return this.getContainer()(
        jQuery.extend({
          className: this.CONTAINER,
          ref: this.CONTAINER
        }, this.getContainerProps()),
        ...this.props.children
        );
    }
  }

  export class AbstractWidget<O, P extends WidgetProps<O>> extends AbstractBaseWidget<O, P> {

    constructor(props: P) {
      super(props);
    }

    public componentDidMount() {
      this.refs[this.CONTAINER][this.getWidgetName()](this.props.widgetOptions || {});
    }

    public componentWillUnmount() {
      this.refs[this.CONTAINER][this.getWidgetName()]('destroy');
    }

    public componentDidUpdate() {
      this.refs[this.CONTAINER][this.getWidgetName()](this.props.widgetOptions || {});
    }
  }

  //RESIZABLE
  export interface ResizableProps extends WidgetProps<JQueryUI.ResizableOptions> {
  }

  export class Resizable extends AbstractWidget<JQueryUI.ResizableOptions, ResizableProps> {
    constructor(props: ResizableProps) {
      super(props);
    }

    protected getWidgetName(): string {
      return 'resizable';
    }

    protected getContainer(): any {
      return JReact.createElement.bind(null, 'div');
    }

    public onResizeStop(ui: any) {
      this.state = ui.size;
    }

    protected getDefaultProps() {
      return {
        widgetOptions: {
          grid: [1, 1],
          stop: (e: Event, ui: JQueryUI.ResizableUIParams) => {
            (<Resizable>JReact.getInstance(jQuery(e.target).parent())).onResizeStop(ui);
          }
        }
      };
    }

    protected getContainerProps() {
      if (this.state)
        return {
          style: {
            width: this.state.width,
            height: this.state.height
          }
        }
      
      return super.getContainerProps();
    }
  }

  //ACCORDION
  export interface AccordionProps extends WidgetProps<JQueryUI.AccordionOptions> {
  }

  export class Accordion extends AbstractWidget<JQueryUI.AccordionOptions, AccordionProps> {
    constructor(props: AccordionProps) {
      super(props);
    }

    public getWidgetName(): string {
      return 'accordion';
    }
  }
  
  //LONGPRESS
  export interface LongPressOpts {
    delay?: number,
    longCallback?: JReact.JQueryEventHandler,
    shortCallback?: JReact.JQueryEventHandler
  }

  export interface LongPressProps extends WidgetProps<LongPressOpts> {
  }

  export class LongPress extends AbstractBaseWidget<LongPressOpts, LongPressProps> {

    public static timeout: number = null;

    constructor(props: LongPressProps) {
      super(props);
    }

    protected getWidgetName(): string {
      return 'longpress';
    }

    protected getDefaultProps() {
      return {
        widgetOptions: {
          delay: 500,
          shortCallback: JReact.noop,
          longCallback: JReact.noop
        }
      };
    }

    private clearTimeout() {
      clearTimeout(LongPress.timeout);
      LongPress.timeout = null;
    }

    private onMouseDown(e: JQueryEventObject) {
      if (e.button === 0)
        LongPress.timeout = setTimeout(() => {
          this.props.widgetOptions.longCallback.call(this, e);
          LongPress.timeout = null;
        }, this.props.widgetOptions.delay);
    }

    private onMouseUp(e: JQueryEventObject) {
      if (e.button === 0 && LongPress.timeout != null) {
        this.clearTimeout();
        this.props.widgetOptions.shortCallback.call(this, e);
      }
    }

    private onMouseMove(e: JQueryEventObject) {
      if (LongPress.timeout != null)
        this.clearTimeout();
    }

    //private onContextMenu(e: JQueryEventObject) {
    //  if (this.timeout == null && e.type !== 'mouseup') {
    //    this.props.widgetOptions.longCallback.call(this, e);
    //    e.preventDefault();
    //    e.stopPropagation();
    //    return false;
    //  }
    //}

    protected getContainerProps() {
      return {
        //onContextMenu: this.onContextMenu.bind(this),
        onMouseDown: this.onMouseDown.bind(this),
        onMouseUp: this.onMouseUp.bind(this),
        onMouseMove: this.onMouseMove.bind(this),
        onTouchStart: this.onMouseDown.bind(this),
        onTouchEnd: this.onMouseUp.bind(this),
        onTouchMove: this.onMouseMove.bind(this)
      };
    }
  }
}
