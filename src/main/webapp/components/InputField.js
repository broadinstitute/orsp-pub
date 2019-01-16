import { Component } from 'react';
import { div, hh, p, span, small } from 'react-hyperscript-helpers';
import './InputField.css';

export const InputField = hh(class InputField extends Component {

  componentDidCatch(error, info) {
    console.log('----------------------- error ----------------------')
    console.log(error, info);
  }

  render() {

    const { currentValue = null } = this.props;

    return (
      div({ className: "inputField " + (this.props.error === true ? 'inputFieldError' : this.props.readOnly ? 'inputFieldReadOnly' : '') }, [
        p({ className: "inputFieldLabel" }, [
          this.props.label,
          span({ isRendered: this.props.moreInfo !== undefined, className: "italic" }, [this.props.moreInfo])
        ]),
        this.props.children,
        small({ isRendered: this.props.value != currentValue, className: "formerValue" }, [currentValue]),
        small({ isRendered: this.props.error, className: "errorMessage" }, [this.props.errorMessage])
      ])
    )
  }
});
