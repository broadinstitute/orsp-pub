import { Component } from 'react';
import { input, hh, div, label, span, p, small } from 'react-hyperscript-helpers';
import { Btn } from '../components/Btn';
import { AlertMessage } from './AlertMessage';
import './InputYesNo.css';

export const InputFieldRadio = hh(class InputFieldRadio extends Component {

  constructor(props) {
    super(props);
    this.state = {
      tooltipVisible: false
    }
  }

  tooltipBtnHandler = event => {
    this.setState(prev => {
      prev.tooltipVisible = !prev.tooltipVisible;
      return prev;
    });
  }

  selectOption = (e, value) => {
    if (!this.props.readOnly) {
      e.preventDefault();
      this.props.onChange(e, this.props.name, value);
    }
  };

  dismissHandler = () => {
    this.setState({
      tooltipVisible: false
    });
  }

  render() {

    const { id, name, optionValues = ['true', 'false'], optionLabels = ['Yes', 'No'], value } = this.props;
    const { currentValue = null, edit = false } = this.props;

    let currentOptionLabel = '';

    const normValue = (value === 'true' || value === true || value === '1') ? 'true' :
      (value === 'false' || value === false || value === '0') ? 'false' : value;

    const normCurrentValue = (currentValue === 'true' || currentValue === true || currentValue === '1') ? 'true' :
      (currentValue === 'false' || currentValue === false || currentValue === '0') ? 'false' : currentValue;

    let edited = this.props.value !== currentValue && currentValue != null;

    if (edit && !edited) {
      edited = value !== undefined && value !== '' && currentValue === null;
    }

    optionValues.forEach((val, ix) => {
      if (val === normCurrentValue) {
        currentOptionLabel = optionLabels[ix];
      }
    });

    return (

      div({ className: "radioContainer" }, [
        p({ className: "bold" }, [
          this.props.label,
          span({ isRendered: this.props.moreInfo !== undefined, className: "normal" }, [this.props.moreInfo]),
          Btn({ isRendered: this.props.tooltipLabel !== undefined, action: { label: this.props.tooltipLabel, handler: this.tooltipBtnHandler } }),
        ]),
        AlertMessage({
          type: "info",
          msg: this.props.tooltipMsg,
          show: this.state.tooltipVisible,
          dismissHandler: this.dismissHandler
        }),
        optionLabels.map((option, ix) => {
          return (
            label({
              key: id + ix,
              onClick: (e) => this.selectOption(e, optionValues[ix]),
              id: "lbl_" + this.props.id + "_" + ix,
              className: "radioOptions " + (this.props.readOnly ? 'radioOptionsReadOnly ' : '') + (edited && (normValue === optionValues[ix]) ? 'radioOptionsUpdated ' : ''),
              disabled: this.props.readOnly
            }, [
                input({
                  type: "radio",
                  id: "rad_" + id + "_" + ix,
                  name: name,
                  value: optionValues[ix],
                  checked: normValue === optionValues[ix],
                  onChange: () => { }
                }),
                span({ className: "radioCheck" }),
                span({ className: "radioLabel" }, [optionLabels[ix]])
              ])
          )
        }),
        div({ isRendered: edited, className: "radioOptionsCurrent" }, [
          span({ className: "italic" }, ["Previous value: "]),
          (currentOptionLabel)
        ]),
        small({ isRendered: this.props.error, className: "errorMessage" }, [this.props.errorMessage])
      ])
    )
  }
});




