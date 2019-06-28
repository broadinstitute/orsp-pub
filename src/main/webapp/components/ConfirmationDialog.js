import { Component } from 'react';
import { hh, div, h, button } from 'react-hyperscript-helpers';
import { Modal, ModalTitle, ModalFooter, ModalBody } from 'react-bootstrap';
import ModalHeader from 'react-bootstrap/ModalHeader';
import './ConfirmationDialog.css';

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
            h(ModalTitle, { className: "dialogTitle" }, [this.props.title])
          ]),

           h(ModalBody, { className: "dialogBody" }, [this.props.bodyText]),

           h(ModalFooter, {}, [
            button({ className: "btn buttonSecondary", onClick: this.handleClose }, ["Cancel"]),
            button({ className: "btn buttonPrimary", onClick: this.handleOkAction }, [this.props.actionLabel]),
          ])
        ])
    )
  }
});
