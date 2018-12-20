import { Component } from 'react';
import { hh, h, h4, div } from 'react-hyperscript-helpers';
import Alert from 'react-bootstrap/lib/Alert';
import './AlertMessage.css';

export const AlertMessage = hh(class AlertMessage extends Component {

  handleDismiss = (e) => {
    this.props.dismissHandler();
  }

  render() {
    if (this.props.show) {
      if (this.props.dismissHandler != null) {
        return (
          h(Alert, { bsStyle: (this.props.type !== undefined ? this.props.type : 'danger'), className: "alertMessage", onDismiss: this.handleDismiss }, [
            div({ className: "alertMessageContent" }, [this.props.msg])
          ])
        );
      } else {
        return (
          h(Alert, { bsStyle: (this.props.type !== undefined ? this.props.type : 'danger'), className: "alertMessage" }, [
            div({ className: "alertMessageContent" }, [this.props.msg])
          ])
        );
      }
    }
    return null;
  }
});