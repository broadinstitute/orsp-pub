import { Component } from 'react';
import { input, label, hh, div } from 'react-hyperscript-helpers';
import { InputField } from './InputField';
import './InputField.css';

export const InputFieldCheckbox = hh(class InputFieldCheckbox extends Component {

    render() {

        const { value, currentValue } = this.props;
        const edited = value !== currentValue && currentValue !== undefined || this.props.valueEdited === true;

        return (
            InputField({
                error: this.props.error, errorMessage: this.props.errorMessage,
                readOnly: this.props.readOnly, value: this.props.value, currentValue: this.props.currentValue, edited: edited, additionalClass: 'inputFieldCkb'
            }, [
                input({
                    type: 'checkbox',
                    id: this.props.id,
                    name: this.props.name,
                    className: "form-control checkboxInput",
                    checked: this.props.checked,
                    disabled: this.props.readOnly,
                    onChange: this.props.onChange
                }),
                label({ id: "lbl_" + this.props.id, htmlFor: this.props.id, className: "checkboxLabel" }, [this.props.label])
            ])
        )
    }
});
