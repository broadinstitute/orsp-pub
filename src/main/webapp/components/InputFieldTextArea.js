import { Component } from 'react';
import { hh, textarea, div, label, span } from 'react-hyperscript-helpers';
import { InputField } from './InputField';
import { compareString } from '../util/Utils';
import './InputField.css';
import { isEmpty } from 'lodash';

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
          div({
            isRendered: edited && this.props.showDiff && this.props.readOnly
          }, [
            label({ className: "inputFieldLabel" }, [
              this.props.label, 
              span({ isRendered: this.props.moreInfo !== undefined, className: "italic" }, [this.props.moreInfo])
            ]),
            div({
              id: "diffChecker",
              dangerouslySetInnerHTML: {
                __html: compareString(this.props.currentValue, this.props.value)
              }
            }),
            div({ 
              isRendered: edited, 
              className: "inputFieldCurrent", 
              style: {whiteSpace: "pre-wrap"} 
            }, [!isEmpty(this.props.currentValueStr) ? this.props.currentValueStr : currentValue]),
          ]),
      ])
    )
  }
});
