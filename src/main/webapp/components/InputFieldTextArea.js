import { Component } from 'react';
import { hh, textarea, div, h } from 'react-hyperscript-helpers';
import { InputField } from './InputField';
import './InputField.css';
import ChangeHighlighter from './ChangeHighlighter';

export const InputFieldTextArea = hh(class InputFieldTextArea extends Component {

  render() {

    const { value, currentValue = null } = this.props;

    const edited = value !== currentValue && currentValue != null;

    return (
      div({}, [
        InputField({
          isRendered: !this.props.readOnly,
          label: this.props.label, moreInfo: this.props.moreInfo, error: this.props.error, errorMessage: this.props.errorMessage,
          readOnly: this.props.readOnly, value: this.props.value, currentValue: this.props.currentValue, edited: edited
        }, [
            div({ className: "inputFieldWrapper" }, [
              textarea({
                name: this.props.name,
                id: "txt_description",
                rows: this.props.rows !== undefined ? this.props.rows : "5",
                readOnly: this.props.readOnly,
                className: "form-control inputFieldTextarea",
                onChange: this.props.onChange,
                required: this.props.required,
                disabled: this.props.disabled,
                value: this.props.readOnly && (this.props.value === undefined || this.props.value === '') ? '--' : this.props.value,
              }),
            ]),
          ]),
          h(ChangeHighlighter, {
            edited: edited,
            readOnly: this.props.readOnly,
            label: this.props.label,
            moreInfo: this.props.moreInfo,
            value: this.props.value,
            currentValue: this.props.currentValue,
            currentValueStr: this.props.currentValueStr
          })
      ])
    )
  }
});
