import { Component } from 'react';
import { div, hh, p, span, small } from 'react-hyperscript-helpers';
import './InputField.css';

export const InputField = hh(class InputField extends Component {

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true }
  }

  constructor(props) {
    super(props);
    this.state = {
      readOnly: false
    }
  }

  handleClick(event) {
    if(this.state.readOnly) {
      event.target.setAttribute('readonly', true);
    }
  }

  render() {
    const { value, label, additionalClass, error, errorMessage, moreInfo, children, readOnly, currentValue = null, currentValueStr, edited = false } = this.props;

    if (readOnly) {
      this.setState({
        readOnly: true
      })
    }

    return (
      div({ className: "inputField " + (error === true ? 'inputFieldError ' : '') + (readOnly ? 'inputFieldReadOnly ' : '') + (edited ? 'inputFieldUpdated ' : '') + (additionalClass !== undefined ? additionalClass : ''),
        onClick: () => handleClick()
      }, [
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
