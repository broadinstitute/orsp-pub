import React from "react";
import { compareString, isEmpty } from "../util/Utils";

function ChangeHighlighter({
  edited,
  readOnly,
  label,
  moreInfo,
  value,
  currentValue,
  currentValueStr,
}) {
  const compareData = (currentValue, value) => {
    value = Array.isArray(value)
      ? value.map((item) => item.label).join(", ") 
      : value;
    currentValue = Array.isArray(currentValue)
      ? currentValue.map((item) => item.label).join(", ")
      : currentValue;
    return compareString(currentValue, value);
  };

  const getStringDataFromObjArr = (data) =>
    Array.isArray(data) ? data.map((item) => item.label).join(", ") : data;

  const getConditionalStyles = () => {
    return {
      whiteSpace: "pre-wrap",
      color: edited ? "#666666" : "black",
      fontStyle: edited ? "italic" : "normal",
      fontSize: edited ? "1rem" : "1.1rem",
      backgroundColor: edited ? "#EAEAEA" : "#f5f5f5",
    };
  };

  return (
    <React.Fragment>
      {readOnly ? (
        <div>
          {label && (
            <label className="inputFieldLabel inputFieldCkb">{label}</label>
          )}
          {moreInfo && <span className="italic">{moreInfo}</span>}
          {edited && (
            <div
              id="diffChecker"
              dangerouslySetInnerHTML={{
                __html: compareData(currentValue, value),
              }}
            ></div>
          )}
          <div className="inputFieldCurrent" style={getConditionalStyles()}>
            {!isEmpty(currentValueStr)
              ? currentValueStr
              : !isEmpty(currentValue)
              ? getStringDataFromObjArr(currentValue)
              : getStringDataFromObjArr(value)}
          </div>
        </div>
      ) : null}
    </React.Fragment>
  );
}

export default ChangeHighlighter;
