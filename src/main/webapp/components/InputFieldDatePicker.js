import { Component } from 'react';
import { div, hh, p, h, span, small } from 'react-hyperscript-helpers';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { InputField } from './InputField';
import './InputField.css';

export const InputFieldDatePicker = hh(class InputFieldDatePicker extends Component {

    constructor(props) {
        super(props);
        this.state = {
            startDate: null
        };
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(date) {
        this.setState({
            startDate: date
        });
    }


    render() {

        return (

            InputField({ label: this.props.label, moreInfo: this.props.moreInfo, error: this.props.error, errorMessage: this.props.errorMessage }, [
                h(
                    DatePicker, ({
                        selected: this.state.startDate,
                        onChange: this.handleChange,
                        showYearDropdown: true,
                        dropdownMode: "select",
                        isClearable: true,
                        disabled: this.props.disabled,
                        placeholderText: this.props.placeholder
                    })
                )
            ])
        )
    }

});
