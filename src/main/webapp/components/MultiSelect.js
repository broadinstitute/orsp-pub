import { Component } from 'react';
import { div, hh } from 'react-hyperscript-helpers';
import AsyncSelect from 'react-select/lib/Async';

export const MultiSelect = hh(class MultiSelect extends Component {

  componentDidCatch(error, info) {
    console.log('----------------------- error ----------------------')
    console.log(error, info);
  }

  render() {

    return (
     // InputField({ label: this.props.label }, [
        h(AsyncSelect, {
          id: "multiselect",
          key: 'vero',
          isDisabled: false,
          isMulti: true,
          loadOptions: (query, callback) => this.props.loadOptions(query, callback),
          onChange: (option) => this.props.handleChange(option),
          value: this.props.values,
         // noOptionsMessage: () => this.state.optionMessage,
         // loadingMessage: () => this.state.optionMessage,
         // classNamePrefix: "select",
            placeholder: "Dataset Name, Sample Collection ID, or PI",
        //  className: step2.inputDatasets.invalid && showValidationMessages ? ' required-select-error select-autocomplete' : 'select-autocomplete',

        }//)
      //]
      ))
  }
});

// export default InputField;
