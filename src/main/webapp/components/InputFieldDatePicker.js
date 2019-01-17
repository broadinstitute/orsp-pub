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
    
    if (typeof this.props.selected === 'string')  {
      selected = new Date(this.props.selected);
    }

    return (

      InputField({
        label: this.props.label, moreInfo: this.props.moreInfo, error: this.props.error, errorMessage: this.props.errorMessage,
        readOnly: this.props.readOnly, currentValue: this.props.currentValue
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
              placeholderText: this.props.placeholder,
              className: "inputFieldDatePicker"
            })
          )
        ])
      ])
    )
  }

});
