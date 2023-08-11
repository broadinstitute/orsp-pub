import { Component } from 'react';
import Select from 'react-select';
import { hh, h, div, input } from 'react-hyperscript-helpers';
import { InputField } from './InputField';
import './InputField.css';
import get from 'lodash/get';

const selectWithLabels = {
  groupHeading: (provided, state) => ({
    color:'#666666',
    cursor:'default',
    display: 'block',
    fontWeight: '500',
    marginBottom: '7px',
    padding: '19px 12px 7px 12px',
    textTransform: 'uppercase',
    fontSize: '14px !important',
    borderBottom: '1px solid #DDDDDD',
  }),
};

export const InputFieldSelect = hh(class InputFieldSelect extends Component {

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true }
  }

  sortByKey = (array, key) => {
    if (Array.isArray(array)) {
      return array.sort(function (a, b) {
        var x = a[key]; var y = b[key];
        return ((x < y) ? -1 : ((x > y) ? 1 : 0));
      });
    }
    return array;
  };

  isEdited = (current, futureValue) => {
    let edited = false;
    if (Array.isArray(current) && Array.isArray(futureValue)) {
      let future = undefined;

      if (futureValue[0] === '') {
        future = futureValue;
      } else {
        future = futureValue[0];
      }

      if (this.props.edit || this.props.edit === undefined) {
        if (current.length !== future.length) {
          edited = true;
        }

        current.forEach((element, index) => {
          if (future[index] !== undefined) {
            if (element.key !== future[index].key) {
              edited = true;
            }
          }
        });
      }
    } else {
      edited = get(current, 'value', '') !== get(futureValue, 'value', '')
    }
    return edited;
  };

  checkvalue = () => {
    if (!this.props.value) {
      return '';
    } else {
      if (this.props.value.label) {
        return this.props.value.label
      } else {
        return this.props.value
      }
    }
  }

  render() {
    const { isLoading = false, placeholder = '' } = this.props;
    let edited = false;
    let currentValueStr;
    let currentValue;
    if (Array.isArray(this.props.currentValue)) {
      currentValue  = [];
      let value = [];
      let currentValues = [];
      if (this.props.currentValue === undefined) {
        currentValue.push("");
      } else if (this.props.currentValue.length === 0){
        currentValue.push("");
      } else {
        currentValue = this.props.currentValue;
      }
      if (this.props.value === null || this.props.value.length === 0) {
        value.push("");
      } else {
        value.push(this.props.value);
      }

      currentValue.forEach(item => {
        currentValues.push(item.label);
      });

      let currentKeys = this.sortByKey(currentValue, 'key');
      let keys = this.sortByKey(value, 'key');

      currentValueStr = currentValues.join(', ');
      edited = this.isEdited(currentKeys, keys);
    } else {
      let currentValue = this.props.currentValue;
      currentValueStr  = get(this.props.currentValue, 'label', '');
      edited = this.props.edit ? this.isEdited(this.props.currentValue, this.props.value) : false;
    }

    return (
      InputField({
        label: this.props.label,
        moreInfo: this.props.moreInfo,
        error: this.props.error,
        errorMessage: this.props.errorMessage,
        readOnly: this.props.readOnly,
        value: this.props.value,
        currentValue: currentValue,
        currentValueStr: currentValueStr,
        edited : edited
      }, [
          div({ className: "inputFieldSelectWrapper" }, [
            h(Select, {
              isRendered: !this.props.readOnly,
              id: this.props.id,
              index: this.props.index,
              name: this.props.name,
              value: this.props.readOnly && (this.props.value === undefined || this.props.value === '') ? '--' : this.props.value,
              className: "inputFieldSelect",
              onChange: this.props.onChange(this.props.index),
              options: this.props.options,
              placeholder: !this.props.readOnly && this.props.placeholder !== undefined ? this.props.placeholder : '--',
              isDisabled: this.props.readOnly,
              isMulti: this.props.isMulti,
              isClearable: this.props.isClearable,
              isLoading: isLoading,
              styles: selectWithLabels,
            }),
            input({
              isRendered: this.props.readOnly,
              type: 'text',
              id: this.props.id,
              index: this.props.index,
              name: this.props.name,
              className: "form-control inputFieldText",
              value: this.checkvalue(),
              placeholder: ((this.props.placeholder === undefined || this.props.placeholder === '') && this.props.readOnly) ? '--' : this.props.placeholder,
              disabled: this.props.disabled,
              onBlur: this.props.focusOut
            }),
            span({ 
              isRendered: this.props.showRemove,
              style: {'floatRight': 'right'},
              onClick: this.props.clearIRB
            }, [
              i({ className: 'glyphicon glyphicon-remove' },[])
            ])
          ])
        ])
    )
  }
});
