import { Component } from 'react';
import { hh, div, h } from 'react-hyperscript-helpers';
import { Modal, ModalHeader, ModalTitle, ModalFooter, ModalBody, Button } from 'react-bootstrap';

 export const ConfirmationDialog = hh(class ConfirmationDialog extends Component {
  constructor(props) {
    super(props);
  }

   handleClose = () => {
    this.props.closeModal();
  };

   handleOkAction = () => {
    this.props.handleOkAction();
  };

   render() {

     return (
      h(Modal, {
        show: this.props.show
      }, [
        h(ModalHeader, {}, [
          h(ModalTitle, {}, [
            this.props.title
          ])
        ]),
        h(ModalBody, {}, [
          this.props.bodyText
        ]),
        h(ModalFooter, {}, [
          h(Button, {
            onClick: this.handleClose
          }, [
            'Cancel'
          ]),
          h(Button, {
            onClick: this.handleOkAction
          }, [
            'Ok'
          ])
        ])
      ])
    )
  }
});
