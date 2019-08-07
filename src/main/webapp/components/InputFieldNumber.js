import React from 'react';
import { input, div, label, p, span } from 'react-hyperscript-helpers';
import {isEmpty} from "../util/Utils";

const styles = {
  inputLabel: {
    margin: '0',
    marginBottom: '0',
    zIndex: '4',
    position: 'relative',
    color: '#286090',
  }
};

const InputFieldNumber = (props) => {
  const onChange = event => {
    props.handleChange(event.target.value)
  };

  return (
    <div>
      <p>
        <label>
          <span className={styles.inputLabel}>{props.label}</span>
        </label>
      </p>
      <input
        type={"number"}
        name={props.name}
        value={props.value}
        onChange={onChange}
        min={!isEmpty(props.min) ? props.min : ''}
        max={!isEmpty(props.max) ? props.max : ''}
      />
    </div>
  )
};

export default InputFieldNumber;
