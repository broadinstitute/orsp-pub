import { Component } from 'react';
import { hh, h, span, div } from 'react-hyperscript-helpers';
import Alert from 'react-bootstrap/Alert';
import './AlertMessage.css';
import { Btn } from "./Btn";
import { isEmpty } from "../util/Utils";

export const AlertMessage = hh(class AlertMessage extends Component {

  handleDismiss = (e) => {
    this.props.dismissHandler();
  }

  render() {
    if (this.props.show) {
      if (this.props.dismissHandler != null) {
        return (
          h(Alert, { bsStyle: (this.props.type !== undefined ? this.props.type : 'danger'), className: "alertMessage", onDismiss: this.handleDismiss }, [
            div({ className: "alertMessageContent" }, [this.props.msg,
              span({ isRendered: isEmpty(this.props.closeable) ? false : this.props.closeable }, [
                Btn({
                  action: {
                    labelClass: "glyphicon glyphicon-remove",
                    handler: this.props.closeAlertHandler
                  }
                })
              ])
            ])
          ])
        );
      } else {
        return (
          h(Alert, { bsStyle: (this.props.type !== undefined ? this.props.type : 'danger'), className: "alertMessage" }, [
            div({ className: "alertMessageContent custom-error" }, [this.props.msg,
              span({ className: "error-icon", isRendered: isEmpty(this.props.closeable) ? false : this.props.closeable }, [
                Btn({
                  action: {
                    labelClass: "glyphicon glyphicon-remove",
                    handler: this.props.closeAlertHandler
                  }
                })
              ])
            ])
          ])
        );
      }
    }
    return null;
  }
});
