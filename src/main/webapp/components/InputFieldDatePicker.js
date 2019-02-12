import { Component } from 'react';
import { hh, h, div } from 'react-hyperscript-helpers';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { InputField } from './InputField';
import './InputField.css';

export const InputFieldDatePicker = hh(class InputFieldDatePicker extends Component {

  constructor(props) {
    super(props);
    this.state = {
      selected: null
    };
  }

  render() {

    let selected;

    if (typeof this.props.selected === 'string') {
      selected = new Date(this.props.selected);
    } else {
      selected = this.props.selected;
    }

    const { value, currentValue } = this.props;
    const edited = value !== currentValue && currentValue !== undefined && value !== undefined;

    return (

      InputField({
        label: this.props.label, moreInfo: this.props.moreInfo, error: this.props.error, errorMessage: this.props.errorMessage,
        readOnly: this.props.readOnly, value: this.props.value, currentValue: this.props.currentValue, edited: edited
      }, [
          div({ className: "inputFieldSelectWrapper" }, [
            h(
              DatePicker, ({
                selected: selected,
                onChange: this.props.onChange(this.props.name),
                showYearDropdown: true,
                dropdownMode: "select",
                isClearable: true,
                minDate: this.props.minDate,
                maxDate: this.props.maxDate,
                disabled: this.props.disabled,
                readOnly: this.props.readOnly,
                placeholderText: this.props.placeholder,
                className: "inputFieldDatePicker"
              })
            )
          ])
        ])
    )
  }
});
