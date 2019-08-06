import React from 'react';
import { input, div, label, p, span } from 'react-hyperscript-helpers';

const styles = {
  inputLabel: {
    margin: '0',
    marginBottom: '0',
    zIndex: '4',
    position: 'relative',
    color: '#286090',
  }
};

const InputFieldNumber = (props) => (
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
    onChange={props.handleChange} />
  </div>
);

export default InputFieldNumber;
