var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/// <reference path="../typings/react/react.d.ts"/>
/// <reference path="../typings/react-bootstrap/react-bootstrap.d.ts"/>
/// <reference path="../typings/es6-promise/es6-promise.d.ts"/>
/// <reference path="./counter.ts"/>
/// <reference path="./state.ts"/>
var Serkan;
(function (Serkan) {
    var ModalDemo = (function (_super) {
        __extends(ModalDemo, _super);
        function ModalDemo(props, context) {
            _super.call(this, props, context);
            this.state = { showModal: false };
        }
        ModalDemo.prototype.close = function () {
            this.setState({ showModal: false });
        };
        ModalDemo.prototype.open = function () {
            this.setState({ showModal: true });
        };
        ModalDemo.prototype.render = function () {
            var popover = React.createElement(ReactBootstrap.Popover, {title: "popover"}, "very popover. such engagement");
            var tooltip = React.createElement(ReactBootstrap.Tooltip, null, "wow.");
            return (React.createElement("div", null, React.createElement("p", null, "Click to get the full Modal experience!"), React.createElement(ReactBootstrap.Button, {bsStyle: "primary", bsSize: "large", onClick: this.open.bind(this)}, "Launch demo modal"), React.createElement(ReactBootstrap.Modal, {show: this.state.showModal, onHide: this.close.bind(this)}, React.createElement(ReactBootstrap.ModalHeader, {closeButton: true}, React.createElement(ReactBootstrap.Modal.Title, null, "Modal heading")), React.createElement(ReactBootstrap.Modal.Body, null, React.createElement("h4", null, "Text in a modal"), React.createElement("p", null, "Duis mollis, est non commodo luctus, nisi erat porttitor ligula."), React.createElement("h4", null, "Popover in a modal"), React.createElement("p", null, "there is a ", React.createElement(ReactBootstrap.OverlayTrigger, {overlay: popover}, React.createElement("a", {href: "#"}, "popover")), " here"), React.createElement("h4", null, "Tooltips in a modal"), React.createElement("p", null, "there is a ", React.createElement(ReactBootstrap.OverlayTrigger, {overlay: tooltip}, React.createElement("a", {href: "#"}, "tooltip")), " here"), React.createElement("hr", null), React.createElement("h4", null, "Overflowing text to show scroll behavior"), React.createElement("p", null, "Praesent commodo cursus magna, vel scelerisque nisl consectetur et. Vivamus sagittis lacus vel augue laoreet rutrum faucibus dolor auctor."), React.createElement("p", null, "Aenean lacinia bibendum nulla sed consectetur. Praesent commodo cursus magna, vel scelerisque nisl consectetur et. Donec sed odio dui. Donec ullamcorper nulla non metus auctor fringilla."), React.createElement("p", null, "Praesent commodo cursus magna, vel scelerisque nisl consectetur et. Vivamus sagittis lacus vel augue laoreet rutrum faucibus dolor auctor."), React.createElement("p", null, "Aenean lacinia bibendum nulla sed consectetur. Praesent commodo cursus magna, vel scelerisque nisl consectetur et. Donec sed odio dui. Donec ullamcorper nulla non metus auctor fringilla."), React.createElement("p", null, "Praesent commodo cursus magna, vel scelerisque nisl consectetur et. Vivamus sagittis lacus vel augue laoreet rutrum faucibus dolor auctor."), React.createElement("p", null, "Aenean lacinia bibendum nulla sed consectetur. Praesent commodo cursus magna, vel scelerisque nisl consectetur et. Donec sed odio dui. Donec ullamcorper nulla non metus auctor fringilla."), React.createElement("p", null, "Praesent commodo cursus magna, vel scelerisque nisl consectetur et. Vivamus sagittis lacus vel augue laoreet rutrum faucibus dolor auctor."), React.createElement("p", null, "Aenean lacinia bibendum nulla sed consectetur. Praesent commodo cursus magna, vel scelerisque nisl consectetur et. Donec sed odio dui. Donec ullamcorper nulla non metus auctor fringilla."), React.createElement("p", null, "Praesent commodo cursus magna, vel scelerisque nisl consectetur et. Vivamus sagittis lacus vel augue laoreet rutrum faucibus dolor auctor."), React.createElement("p", null, "Aenean lacinia bibendum nulla sed consectetur. Praesent commodo cursus magna, vel scelerisque nisl consectetur et. Donec sed odio dui. Donec ullamcorper nulla non metus auctor fringilla."), React.createElement("p", null, "Praesent commodo cursus magna, vel scelerisque nisl consectetur et. Vivamus sagittis lacus vel augue laoreet rutrum faucibus dolor auctor."), React.createElement("p", null, "Aenean lacinia bibendum nulla sed consectetur. Praesent commodo cursus magna, vel scelerisque nisl consectetur et. Donec sed odio dui. Donec ullamcorper nulla non metus auctor fringilla."), React.createElement("p", null, "Praesent commodo cursus magna, vel scelerisque nisl consectetur et. Vivamus sagittis lacus vel augue laoreet rutrum faucibus dolor auctor."), React.createElement("p", null, "Aenean lacinia bibendum nulla sed consectetur. Praesent commodo cursus magna, vel scelerisque nisl consectetur et. Donec sed odio dui. Donec ullamcorper nulla non metus auctor fringilla."), React.createElement("p", null, "Praesent commodo cursus magna, vel scelerisque nisl consectetur et. Vivamus sagittis lacus vel augue laoreet rutrum faucibus dolor auctor."), React.createElement("p", null, "Aenean lacinia bibendum nulla sed consectetur. Praesent commodo cursus magna, vel scelerisque nisl consectetur et. Donec sed odio dui. Donec ullamcorper nulla non metus auctor fringilla.")), React.createElement(ReactBootstrap.Modal.Footer, null, React.createElement(ReactBootstrap.Button, {onClick: this.close.bind(this)}, "Close")))));
        };
        return ModalDemo;
    }(React.Component));
    Serkan.ModalDemo = ModalDemo;
})(Serkan || (Serkan = {}));
//# sourceMappingURL=modalDemo.js.map