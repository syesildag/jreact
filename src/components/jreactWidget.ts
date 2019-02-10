/// <reference path="../jreact.ts"/>
/// <reference path="../utils.ts"/>

namespace RslComponents {

  export interface WidgetProps<O> extends JReact.Props {
    widgetOptions?: O
  }

  abstract class AbstractWidget<O, P extends WidgetProps<O>> extends JReact.Component<P, any, any, any> {

    protected CONTAINER: string;

    constructor(props: P) {
      super(props);

      this.CONTAINER = 'jreact-widget-' + this.getWidgetName() + '-container';
    }

    protected abstract getWidgetName(): string;

    protected getContainer(): JReact.DomFactory {
      return JReact.createElement.bind(null, 'span');
    }

    protected getContainerProps(): JReact.DOMAttributes {
      return {};
    }

    public getWidgetRef(): JQuery {
      return this.refs[this.CONTAINER];
    }

    public getWidget(): any {
      return this.getWidgetRef()[this.getWidgetName() as any];
    }

    public componentDidMount() {
      this.createWidget();
    }

    public componentDidUpdate() {
      this.createWidget();
    }

    public componentWillUnmount() {
      this.destroyWidget();
    }

    public componentWillReceiveProps(nextProps: P) {
      this.destroyWidget();
    }

    private createWidget() {
      this.getWidget().call(this.getWidgetRef(), this.props.widgetOptions || {});
    }

    private destroyWidget() {
      this.getWidget().call(this.getWidgetRef(), 'destroy');
    }

    public render() {
      return this.getContainer()(
        Utils.extend(this.getContainerProps(), { ref: this.CONTAINER }),
        ...this.props.children
      );
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
            (<Resizable>JReact.getInstance(jQuery(e.target as HTMLElement).parent())).onResizeStop(ui);
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

  export interface CustomComboboxProps extends WidgetProps<any> {
    onChange?(e: JQueryEventObject): void;
    codeSelect?: boolean;
  }

  export class CustomCombobox extends AbstractWidget<any, CustomComboboxProps> {
    constructor(props: CustomComboboxProps) {
      super(props);
    }

    protected getContainer(): any {
      return JReact.createElement.bind(null, 'select');
    }

    protected getContainerProps() {
      let props: JReact.DOMAttributes = {}, classNames = ['control_select'];

      if (this.props.onChange)
        props.change = this.props.onChange.bind(this);

      if (this.props.codeSelect)
        classNames.push('select-autocomplete');

      props.className = classNames.join(' ');
      return props;
    }

    public getWidgetName(): string {
      return 'combobox';
    }
  }
}
