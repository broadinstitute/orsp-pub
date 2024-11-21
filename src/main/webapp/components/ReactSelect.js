import React, { useState } from "react";
import Select, { Creatable } from "react-select";

function ReactSelect(props) {

  const [menuOpen, setMenuOpen] = useState(false);

  const styles = {
    option: (provided, state) => ({
      ...provided,
      display: 'flex',
      alignItems: 'center',
      backgroundColor: state.isSelected ? 'hsl(0,0%,90%)' : provided.backgroundColor,
      color: state.isSelected ? '#2c3e50' : provided.color,
      fontWeight: state.isSelected ? 'bold' : provided.fontWeight,
      borderBottom: '1px solid #f1f1f1', 
      ':before': {
        content: state.isSelected ? '"✓"' : '""', // Add checkmark if selected
        marginRight: 8,
        color: '#2c3e50', // Color for the checkmark
        fontSize: '16px',
      },
      ':hover': {
        backgroundColor: '#f1f1f1',
      },
    }),
  }

  return props.allowCustomData ? (
    <Creatable
      placeholder={props.placeholder}
      isMulti={props.isMulti}
      options={props.options}
      onChange={props.handleChange}
      value={props.value}
      hideSelectedOptions={props.hideSelectedOptions}
    />
  ) : (
    <Select
      placeholder={props.placeholder}
      isMulti={props.isMulti}
      options={props.options}
      onChange={(e) => {props.handleChange(e); setMenuOpen(true);}}
      value={props.value}
      hideSelectedOptions={props.hideSelectedOptions}
      styles={styles}
      menuIsOpen={menuOpen}
      onMenuOpen={() => setMenuOpen(true)}
      onMenuClose={() => setMenuOpen(false)}
    />
  );
}

export default ReactSelect;
