import React from "react";
import ReactDOM from "react-dom";
import Search from "./Search";
import "./style.css";
import ErrorHandler from "../components/ErrorHandler";

ReactDOM.render(
  <ErrorHandler>
    <Search
      searchUrl = {component.searchUrl}
      userNameSearchUrl = {component.userNameSearchUrl}
      issueTypes = {component.issueTypes}
      issueStatuses = {component.issueStatuses}
      irbs = {component.irbs}
    />
  </ErrorHandler>,
  document.getElementById("app")
);
