import { Component } from 'react';
import { div, hh, p, span } from 'react-hyperscript-helpers';
import './InputField.css';

export const InputField = hh(class InputField extends Component {

  componentDidCatch(error, info) {
    console.log('----------------------- error ----------------------')
    console.log(error, info);
  }

  render() {

    return (
      div({ className: "inputField" }, [
        p({ className: "inputFieldLabel" }, [
          this.props.label,
          span({ isRendered: this.props.aclaration !== undefined, className: "italic" }, [this.props.aclaration])
        ]),
        this.props.children,
        p({isRendered: this.props.error}, [this.props.errorMessage])
      ])
    )
  }
});
