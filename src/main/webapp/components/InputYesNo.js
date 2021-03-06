import { input, hh, div, label, span, p, small } from 'react-hyperscript-helpers';
import './InputYesNo.css';

export const InputYesNo = (props) => {

  let selectOption = (e, value) => {
    if (!props.readOnly) {
      e.preventDefault();
      props.onChange(e, props.name, value);
    }
  };

  const { id, name, optionValues = ['true', 'false'], optionLabels = ['Yes', 'No'], value, currentValue = null, valueEdited = false } = props;

  let currentOptionLabel = '';

  const normValue = (value === 'true' || value === true || value === '1') ? 'true' :
    (value === 'false' || value === false || value === '0') ? 'false' : null;

  const normCurrentValue = (currentValue === 'true' || currentValue === true || currentValue === '1') ? 'true' :
    (currentValue === 'false' || currentValue === false || currentValue === '0') ? 'false' : currentValue;

  const edited = normValue !== currentValue && currentValue != null || valueEdited === true;

  optionValues.forEach((val, ix) => {
    if (val === normCurrentValue) {
      currentOptionLabel = optionLabels[ix];
    }
  });

  return (

    div({ className: "radioContainer" }, [
      p({ className: "inputFieldLabel" }, [
        props.label,
        span({ isRendered: props.moreInfo !== undefined, className: "normal" }, [props.moreInfo])
      ]),

      optionLabels.map((option, ix) => {
        return (
          label({
            key: id + ix,
            onClick: (e) => selectOption(e, optionValues[ix]),
            id: "lbl_" + props.id + "_" + ix,
            className: "radioOptions " + (props.readOnly ? 'radioOptionsReadOnly ' : '') + (edited && (normValue === optionValues[ix]) ? 'radioOptionsUpdated ' : ''),
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
        (currentOptionLabel)
      ]),
      small({ isRendered: props.error, className: "errorMessage" }, [props.errorMessage])
    ])
  )
};
