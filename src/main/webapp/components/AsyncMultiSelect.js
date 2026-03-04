import { Component } from 'react';
import { hh, h, div } from 'react-hyperscript-helpers';
import { InputField } from './InputField';
import AsyncSelect from 'react-select/lib/Async';
import './InputField.css';
import ChangeHighlighter from './ChangeHighlighter';

export const AsyncMultiSelect = hh(class AsyncMultiSelect extends Component {

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

  isEdited = (current, future) => {
    let edited = false;
    if (this.props.edit || this.props.edit === undefined) {
      // Multi-select comparison (array of options)
      if (this.props.isMulti) {
        if (current.length !== future.length) {
          return true;
        }
        current.forEach((element, index) => {
          if (future[index] !== undefined) {
            if (element.key !== future[index].key) {
              edited = true;
            }
          }
        });
        return edited;
      }

      // Single-select comparison (single option object)
      const currentOpt = current[0];
      const futureOpt = future[0];
      const currentKey = currentOpt ? currentOpt.key : undefined;
      const futureKey = futureOpt ? futureOpt.key : undefined;
      const currentLabel = currentOpt ? currentOpt.label : undefined;
      const futureLabel = futureOpt ? futureOpt.label : undefined;
      edited = currentKey !== futureKey || currentLabel !== futureLabel;
    }
    return edited;
  };

  normalizeToArray = (val) => {
    if (val === null || val === undefined) return [];
    if (Array.isArray(val)) return val.filter(Boolean);
    if (typeof val === 'string') return [];
    return [val];
  };

  render() {
    // Normalize values for comparison/diff (react-select single value is an object, multi is an array)
    let currentValue = this.normalizeToArray(this.props.currentValue);
    let value = this.normalizeToArray(this.props.value);

    let currentKeys = this.sortByKey(currentValue, 'key');
    let keys = this.sortByKey(value, 'key');

    let currentValueStr = currentKeys
      .map(item => item && item.label ? item.label : '')
      .filter(Boolean)
      .join(', ');

    // verified if edited ...
    const edited = this.isEdited(currentKeys, keys);

    // react-select expects a single option object when isMulti=false; some callers pass [option]
    const normalizedSelectValue = this.props.isMulti
      ? this.props.value
      : (Array.isArray(this.props.value) ? this.props.value[0] : this.props.value);

    return (
      div([
        InputField({
          isRendered: !this.props.readOnly,
          label: this.props.label,
          error: this.props.error,
          errorMessage: this.props.errorMessage,
          readOnly: this.props.readOnly,
          value: this.props.value,
          currentValue: currentValue,
          currentValueStr: currentValueStr,
          edited : this.props.showCurrentValueOnEdit? edited: undefined
        }, [
          div({ className: "inputFieldSelectWrapper" }, [
            h(AsyncSelect, {
              id: this.props.id,
              isDisabled: this.props.isDisabled || this.props.readOnly,
              isMulti: this.props.isMulti,
              isClearable: true,
              loadOptions: (query, callback) => this.props.loadOptions(query, callback),
              onChange: (option) => this.props.handleChange(option),
              value: this.props.readOnly && (this.props.value === undefined || this.props.value === '') ? '--' : normalizedSelectValue,
              placeholder: !this.props.readOnly && this.props.placeholder !== undefined ? this.props.placeholder : '--',
              className: "inputFieldSelect",
              classNamePrefix: "select",
              styles: this.props.styles
            })
          ])
        ]),
        h(ChangeHighlighter, {
          edited: edited,
          readOnly: this.props.readOnly,
          label: this.props.label,
          moreInfo: this.props.moreInfo,
          value: this.props.value,
          currentValue: this.props.currentValue,
          currentValueStr: currentValueStr
        })
      ])
    )
  }
});
