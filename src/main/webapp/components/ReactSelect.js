import React from "react";
import Select from "react-select";
import { Creatable } from "react-select";

function ReactSelect(props) {
  return props.allowCustomData ? (
    <Creatable
      placeholder={props.placeholder}
      isMulti={props.isMulti}
      options={props.options}
      onChange={props.handleChange}
      value={props.value}
    />
  ) : (
    <Select
      placeholder={props.placeholder}
      isMulti={props.isMulti}
      options={props.options}
      onChange={props.handleChange}
      value={props.value}
    />
  );
}

export default ReactSelect;
