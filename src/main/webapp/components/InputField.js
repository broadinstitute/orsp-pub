import { Component } from 'react';
import { div, hh, p, span, small } from 'react-hyperscript-helpers';
import './InputField.css';

export const InputField = hh(class InputField extends Component {

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true }
  }

  componentDidCatch(error, info) {
    console.log('----------------------- error ----------------------')
    console.log(error, info);
  }

  render() {
    const { value, label, additionalClass, error, errorMessage, moreInfo, children, readOnly, currentValue = null, currentValueStr, edited = false } = this.props;

    return (
<<<<<<< HEAD
      div({ className: "inputField " + (error === true ? 'inputFieldError ' : '') + (readOnly ? 'inputFieldReadOnly ' : '') + (edited ? 'inputFieldUpdated' : '') + (additionalClass !== null ? additionalClass : '') }, [
=======
      div({ className: "inputField " + (error === true ? 'inputFieldError ' : '') + (readOnly ? 'inputFieldReadOnly ' : '') + (edited ? 'inputFieldUpdated ' : '') + (additionalClass !== null || additionalClass !== undefined ? additionalClass : '') }, [
>>>>>>> 2007ba4e0c39babfeb0cf35bc1f530d4bf642934
        p({ className: "inputFieldLabel" }, [
          label,
          span({ isRendered: moreInfo !== undefined, className: "italic" }, [moreInfo])
        ]),
        children,
        div({ isRendered: edited, className: "inputFieldCurrent" }, [(currentValueStr != null) ? currentValueStr : currentValue]),
        small({ isRendered: error, className: "errorMessage" }, [errorMessage])
      ])
    )
  }
});
