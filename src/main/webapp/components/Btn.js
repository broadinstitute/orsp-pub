import { Component } from 'react';
import { button, hh, span } from 'react-hyperscript-helpers';
import './Btn.css';

export const Btn = hh(class Btn extends Component {

  render() {

    return (
      button({
        id: "btn",
        className: this.props.btnclass || "btnPrimary",
        style: this.props.style,
        onClick: this.props.action.handler,
        disabled: this.props.disabled,
        title: this.props.title
      }, [
        span({ className: this.props.action.labelClass }, [this.props.action.label]),
      ])
    )
  }
});
