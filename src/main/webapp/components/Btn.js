import { Component } from 'react';
import { button, hh, span } from 'react-hyperscript-helpers';
import './Btn.css';

export const Btn = hh(class Btn extends Component {

  render() {

    return (
      button({
        id: "btn",
        className: "btnPrimary",
        onClick: this.props.action.handler,
        disabled: this.props.disabled
      }, [
        span({ className: this.props.action.labelClass }, [this.props.action.label]),
      ])
    )
  }
});
