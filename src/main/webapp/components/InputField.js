import { Component } from 'react';
import { div, hh, p, span, small } from 'react-hyperscript-helpers';
import './InputField.css';

export const InputField = hh(class InputField extends Component {

  componentDidCatch(error, info) {
    console.log('----------------------- error ----------------------')
    console.log(error, info);
  }

  render() {

    return (
      div({ className: "inputField " + (this.props.error === true ? 'inputFieldError' : '') }, [
        p({ className: "inputFieldLabel" }, [
          this.props.label,
          span({ isRendered: this.props.moreInfo !== undefined, className: "italic" }, [this.props.moreInfo])
        ]),
        this.props.children,
        small({ isRendered: this.props.error, className: "inputFieldError" }, [this.props.error])
      ])
    )
  }
});
