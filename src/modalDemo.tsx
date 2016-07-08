/// <reference path="../typings/react/react.d.ts"/>
/// <reference path="../typings/react-bootstrap/react-bootstrap.d.ts"/>
/// <reference path="../typings/es6-promise/es6-promise.d.ts"/>
/// <reference path="./counter.ts"/>
/// <reference path="./state.ts"/>
module Serkan {
  
  export interface ModalDemoState {
    showModal: boolean;
  }
  
  export interface ModalDemoProps {
  }
  
  export class ModalDemo extends React.Component<ModalDemoProps, ModalDemoState> {
    constructor(props: ModalDemoProps, context: any) {
      super(props, context);
      this.state = {showModal: false};
    }
    
    close() {
      this.setState({showModal: false});
    }
    
    open() {
      this.setState({showModal: true});
    }
    
    render() {
      
      var popover = <ReactBootstrap.Popover title="popover">very popover. such engagement</ReactBootstrap.Popover>;
      var tooltip = <ReactBootstrap.Tooltip>wow.</ReactBootstrap.Tooltip>;
      
      return (
        <div>
          <p>Click to get the full Modal experience!</p>
          
          <ReactBootstrap.Button
            bsStyle="primary"
            bsSize="large"
            onClick={this.open.bind(this)}>
            
            Launch demo modal
          </ReactBootstrap.Button>
          
          <ReactBootstrap.Modal show={this.state.showModal} onHide={this.close.bind(this)}>
            
            <ReactBootstrap.ModalHeader closeButton>
              <ReactBootstrap.Modal.Title>Modal heading</ReactBootstrap.Modal.Title>
            </ReactBootstrap.ModalHeader>
            
            <ReactBootstrap.Modal.Body>
              <h4>Text in a modal</h4>
              <p>Duis mollis, est non commodo luctus, nisi erat porttitor ligula.</p>
              
              <h4>Popover in a modal</h4>
              <p>there is a <ReactBootstrap.OverlayTrigger overlay={popover}><a href="#">popover</a></ReactBootstrap.OverlayTrigger> here</p>
              
              <h4>Tooltips in a modal</h4>
              <p>there is a <ReactBootstrap.OverlayTrigger overlay={tooltip}><a href="#">tooltip</a></ReactBootstrap.OverlayTrigger> here</p>
              
              <hr />
              
              <h4>Overflowing text to show scroll behavior</h4>
              <p>Praesent commodo cursus magna, vel scelerisque nisl consectetur et. Vivamus sagittis lacus vel augue laoreet rutrum faucibus dolor auctor.</p>
              <p>Aenean lacinia bibendum nulla sed consectetur. Praesent commodo cursus magna, vel scelerisque nisl consectetur et. Donec sed odio dui. Donec ullamcorper nulla non metus auctor fringilla.</p>
              <p>Praesent commodo cursus magna, vel scelerisque nisl consectetur et. Vivamus sagittis lacus vel augue laoreet rutrum faucibus dolor auctor.</p>
              <p>Aenean lacinia bibendum nulla sed consectetur. Praesent commodo cursus magna, vel scelerisque nisl consectetur et. Donec sed odio dui. Donec ullamcorper nulla non metus auctor fringilla.</p>
              <p>Praesent commodo cursus magna, vel scelerisque nisl consectetur et. Vivamus sagittis lacus vel augue laoreet rutrum faucibus dolor auctor.</p>
              <p>Aenean lacinia bibendum nulla sed consectetur. Praesent commodo cursus magna, vel scelerisque nisl consectetur et. Donec sed odio dui. Donec ullamcorper nulla non metus auctor fringilla.</p>
              <p>Praesent commodo cursus magna, vel scelerisque nisl consectetur et. Vivamus sagittis lacus vel augue laoreet rutrum faucibus dolor auctor.</p>
              <p>Aenean lacinia bibendum nulla sed consectetur. Praesent commodo cursus magna, vel scelerisque nisl consectetur et. Donec sed odio dui. Donec ullamcorper nulla non metus auctor fringilla.</p>
              <p>Praesent commodo cursus magna, vel scelerisque nisl consectetur et. Vivamus sagittis lacus vel augue laoreet rutrum faucibus dolor auctor.</p>
              <p>Aenean lacinia bibendum nulla sed consectetur. Praesent commodo cursus magna, vel scelerisque nisl consectetur et. Donec sed odio dui. Donec ullamcorper nulla non metus auctor fringilla.</p>
              <p>Praesent commodo cursus magna, vel scelerisque nisl consectetur et. Vivamus sagittis lacus vel augue laoreet rutrum faucibus dolor auctor.</p>
              <p>Aenean lacinia bibendum nulla sed consectetur. Praesent commodo cursus magna, vel scelerisque nisl consectetur et. Donec sed odio dui. Donec ullamcorper nulla non metus auctor fringilla.</p>
              <p>Praesent commodo cursus magna, vel scelerisque nisl consectetur et. Vivamus sagittis lacus vel augue laoreet rutrum faucibus dolor auctor.</p>
              <p>Aenean lacinia bibendum nulla sed consectetur. Praesent commodo cursus magna, vel scelerisque nisl consectetur et. Donec sed odio dui. Donec ullamcorper nulla non metus auctor fringilla.</p>
              <p>Praesent commodo cursus magna, vel scelerisque nisl consectetur et. Vivamus sagittis lacus vel augue laoreet rutrum faucibus dolor auctor.</p>
              <p>Aenean lacinia bibendum nulla sed consectetur. Praesent commodo cursus magna, vel scelerisque nisl consectetur et. Donec sed odio dui. Donec ullamcorper nulla non metus auctor fringilla.</p>
            </ReactBootstrap.Modal.Body>
            
            <ReactBootstrap.Modal.Footer>
              <ReactBootstrap.Button onClick={this.close.bind(this)}>Close</ReactBootstrap.Button>
            </ReactBootstrap.Modal.Footer>
            
          </ReactBootstrap.Modal>
        </div>
      );
    }
  }
}
