import React from 'react';
import { isEmpty } from '../util/Utils';

const InputFieldNumber = (props) => {
  const onChange = event => {
    props.handleChange(event.target.value)
  };

  return (
    <div className={'inputField'}>
      <p className={'inputFieldLabel'}>
          {props.label}
      </p>
      <div style={props.error ? {border: "1px solid red"} : {}}>
        <input
          className={'form-control inputFieldText'}
          type={"number"}
          name={props.name}
          value={props.value}
          onChange={onChange}
          min={!isEmpty(props.min) ? props.min : ''}
          max={!isEmpty(props.max) ? props.max : ''}
        />
      </div>
    </div>
  )
};

export default InputFieldNumber;
