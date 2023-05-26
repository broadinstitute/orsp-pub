import { Component } from 'react';
import { div, hh, p, span, small } from 'react-hyperscript-helpers';
import './InputField.css';

export const InputField = hh(class InputField extends Component {

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true }
  }

  render() {
    const { value, label, additionalClass, error, errorMessage, moreInfo, children, readOnly, currentValue = null, currentValueStr, edited = false } = this.props;

    return (
      div({ className: "inputField " + (error === true ? 'inputFieldError ' : '') + (readOnly ? 'inputFieldReadOnly ' : '') + (edited ? 'inputFieldUpdated ' : '') + (additionalClass !== undefined ? additionalClass : '') }, [
        p({ className: "inputFieldLabel" }, [
          label,
          span({ isRendered: moreInfo !== undefined, className: "italic" }, [moreInfo])
        ]),
        div({ isRendered: !readOnly }, [children]),
        div({ isRendered: readOnly }, 
          p([(currentValueStr != null) ? currentValueStr : currentValue])
        ),
        div({ isRendered: edited, className: "inputFieldCurrent" }, [(currentValueStr != null) ? currentValueStr : currentValue]),
        small({ isRendered: error, className: "errorMessage" }, [errorMessage])
      ])
    )
  }
});
