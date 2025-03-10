import React from "react";
import { isEmpty } from "../util/Utils";
import { diffWords } from "diff";

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
    let currentVal = currentValue || "";
    let val = value || "";
    val = Array.isArray(val)
      ? val.map((item) => item.label.trim()).join(", ")
      : val;
    currentVal = Array.isArray(currentVal)
      ? currentVal.map((item) => item.label.trim()).join(", ")
      : currentVal;
    const TEXT_DIFF = diffWords(currentVal, val);
    let result = "";
    TEXT_DIFF.forEach((part) => {
      result += part.added
        ? `<ins>${part.value}</ins>`
        : part.removed
        ? `<del>${part.value}</del>`
        : part.value;
    });
    return result;
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
              : (!isEmpty(currentValue) && currentValue !== value)
              ? getStringDataFromObjArr(currentValue)
              : getStringDataFromObjArr(value)}
          </div>
        </div>
      ) : null}
    </React.Fragment>
  );
}

export default ChangeHighlighter;
