import React from "react";
import ReactDOM from "react-dom";
import Search from "./Search";
import "./style.css";

ReactDOM.render(
  <Search
    getUserUrl={component.getUserUrl}
    searchUrl={component.searchUrl}
    projectKeySearchUrl={component.projectKeySearchUrl}
    userNameSearchUrl={component.userNameSearchUrl}
    issueTypes={component.issueTypes}
    issueStatuses={component.issueStatuses}
    irbs={component.irbs}
  />,
  document.getElementById("app")
);
