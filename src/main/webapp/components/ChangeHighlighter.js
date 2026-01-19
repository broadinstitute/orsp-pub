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
  const toDisplayString = (data) => {
    if (data === null || data === undefined) return "";
    if (Array.isArray(data)) {
      return data
        .map((item) => {
          if (item === null || item === undefined) return "";
          if (typeof item === "string") return item.trim();
          if (typeof item === "object" && typeof item.label === "string")
            return item.label.trim();
          return String(item).trim();
        })
        .filter(Boolean)
        .join(", ");
    }
    if (typeof data === "object") {
      if (typeof data.label === "string") return data.label.trim();
      if (typeof data.value === "string") return data.value.trim();
      return "";
    }
    return String(data);
  };

  const compareData = (currentValue, value) => {
    const currentVal = toDisplayString(currentValue);
    const val = toDisplayString(value);
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

  const getStringDataFromObjArr = (data) => toDisplayString(data);

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
            {edited
              ? (!isEmpty(currentValueStr)
                  ? currentValueStr
                  : !isEmpty(getStringDataFromObjArr(currentValue))
                  ? getStringDataFromObjArr(currentValue)
                  : "--")
              : (!isEmpty(currentValueStr)
                  ? currentValueStr
                  : (!isEmpty(currentValue) && currentValue !== value)
                  ? getStringDataFromObjArr(currentValue)
                  : getStringDataFromObjArr(value))}
          </div>
        </div>
      ) : null}
    </React.Fragment>
  );
}

export default ChangeHighlighter;
