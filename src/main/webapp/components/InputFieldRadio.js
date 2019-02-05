import { input, hh, div, label, span, p, small } from 'react-hyperscript-helpers';
import './InputYesNo.css';

export const InputFieldRadio = (props) => {

  let selectOption = (e, value) => {
    if (!props.readOnly) {
      e.preventDefault();
      props.onChange(e, props.name, value);
    }
  };

  const { id, name, optionValues = ['true', 'false'], optionLabels = ['Yes', 'No'], value } = props;
  const { currentValue = null, currentOptionLabel = [], edit = false } = props;

  const previousValue = (labelValue) => {
    if (!edit) {
      if (value === '02') {
        return labelValue[0]
      } else if (value === '01') {
        return labelValue[1]
      }

      if (currentValue !== value && currentOptionLabel.length === 3) {
        if (currentValue === 'true') {
          return currentOptionLabel[0];
        } else if (currentValue === 'false') {
          return currentOptionLabel[1]
        } else if (currentValue === 'uncertain') {
          return currentOptionLabel[2]
        }
      }
    }
  };

  const normValue = (value === 'true' || value === true || value === '1') ? 'true' :
    (value === 'false' || value === false || value === '0') ? 'false' : value;

  const edited = props.value !== currentValue && currentValue != null;

  return (

    div({ className: "radioContainer" }, [
      p({ className: "bold" }, [
        props.label,
        span({ isRendered: props.moreInfo !== undefined, className: "normal" }, [props.moreInfo])
      ]),

      optionLabels.map((option, ix) => {
        return (
          label({
            key: id + ix,
            onClick: (e) => selectOption(e, optionValues[ix]),
            id: "lbl_" + props.id + "_" + ix,
            className: "radioOptions " + (props.readOnly ? 'radioOptionsReadOnly ' : '') + (edited ? 'radioOptionsUpdated ' : ''),
            disabled: props.readOnly
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
        (previousValue(currentOptionLabel))
      ]),
      small({ isRendered: props.error, className: "errorMessage" }, [props.errorMessage])
    ])
  )
};
