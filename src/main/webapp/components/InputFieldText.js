import { Component } from 'react';
import { input, hh } from 'react-hyperscript-helpers';
import { InputField } from './InputField';

export const InputFieldText = hh(class InputFieldText extends Component {

  render() {

    return (
      InputField({ label: this.props.label }, [
        input({ type: 'text',
                id: this.props.id,
                name: this.props.name,
                value: this.props.value,
                disabled: this.props.disabled,
                required: this.props.required,
                onChange: this.props.onChange })
      ])
    )
  }
});

// export default InputFieldText;
