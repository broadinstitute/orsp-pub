import React from "react";
import { Typeahead } from "react-bootstrap-typeahead";
import axios from "axios";

import ProjectAutocomplete from "../util/ProjectAutocomplete";
import SearchResults from "./SearchResults";
import UserAutocomplete from "../util/UserAutocomplete";

class Search extends React.Component {
  constructor(props) {
    super(props);
    this.getLocalStorageState = this.getLocalStorageState.bind(this);
    this.saveStateToLocalStorage = this.saveStateToLocalStorage.bind(this);
    this.handleClear = this.handleClear.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.userAutocomplete = React.createRef();
    this.projectAutocomplete = React.createRef();
    this.state = {
      // setup data
      searchUrl: props.searchUrl,
      projectKeySearchUrl: props.projectKeySearchUrl,
      issueTypes: props.issueTypes,
      issueStatuses: props.issueStatuses,
      userNameSearchUrl: props.userNameSearchUrl,
      irbs: props.irbs,
      data: [],
      loading: false,
      loaded: false,

      // search form data
      projectKey: this.getLocalStorageState("projectKey", "string"),
      defaultProjectSelected: this.getLocalStorageState(
        "defaultProjectSelected",
        "array"
      ),
      userName: this.getLocalStorageState("userName", "string"),
      defaultUserSelected: this.getLocalStorageState(
        "defaultUserSelected",
        "array"
      ),
      freeText: this.getLocalStorageState("freeText", "string"),
      funding: this.getLocalStorageState("funding", "string"),
      types: this.getLocalStorageState("types", "array"),
      statuses: this.getLocalStorageState("statuses", "array"),
      irb: this.getLocalStorageState("irb", "array")
    };
  }

  componentDidMount() {
    // Check query state. If we have any existing search terms, run the query.
    if (
      this.state.projectKey.length > 0 ||
      this.state.userName.length > 0 ||
      this.state.freeText.length > 0 ||
      this.state.funding.length > 0 ||
      this.state.types.length > 0 ||
      this.state.statuses.length > 0 ||
      this.state.irb.length > 0
    ) {
      this.refs.search.click();
    }
  }

  getLocalStorageState(key, type) {
    const localStorageState = JSON.parse(localStorage.getItem("search"));
    if (
      localStorageState == null ||
      typeof localStorageState[key] === "undefined"
    ) {
      if (type === "string") {
        return "";
      } else if (type === "array") {
        return [];
      } else {
        return "";
      }
    } else {
      return localStorageState[key];
    }
  }

  saveStateToLocalStorage() {
    const searchObject = JSON.stringify({
      projectKey: this.state.projectKey,
      defaultProjectSelected: this.state.defaultProjectSelected,
      userName: this.state.userName,
      defaultUserSelected: this.state.defaultUserSelected,
      freeText: this.state.freeText,
      funding: this.state.funding,
      types: this.state.types,
      statuses: this.state.statuses,
      irb: this.state.irb
    });
    localStorage.setItem("search", searchObject);
  }

  handleClear() {
    this.setState(() => ({
      projectKey: "",
      defaultProjectSelected: [],
      userName: "",
      defaultUserSelected: [],
      freeText: "",
      funding: "",
      types: [],
      statuses: [],
      irb: [],
      data: [],
      loading: false,
      loaded: false
    }));
    this.userAutocomplete.clear();
    this.projectAutocomplete.clear();
    this.refs.issueType.getInstance().clear();
    this.refs.issueType.getInstance().blur();
    this.refs.issueStatus.getInstance().clear();
    this.refs.issueStatus.getInstance().blur();
    this.refs.irbOfRecord.getInstance().clear();
    this.refs.irbOfRecord.getInstance().blur();
    this.saveStateToLocalStorage();
  }

  handleChange(event) {
    const target = event.target;
    const name = target.name;
    const value = target.value;
    this.setState(() => ({ [name]: value }));
    this.saveStateToLocalStorage();
  }

  handleSubmit(event) {
    event.preventDefault();
    // these state changes do not need to be persisted for the user
    this.setState(() => ({ data: [], loading: true, loaded: false }));

    let params = new URLSearchParams();
    params.append("text", this.state.freeText);
    params.append("projectKey", this.state.projectKey);
    params.append("funding", this.state.funding);
    params.append("userName", this.state.userName);
    this.state.types.map(function(type, index) {
      params.append("type", type);
    });
    this.state.statuses.map(function(status, index) {
      params.append("status", status);
    });
    this.state.irb.map(function(irb, index) {
      params.append("irb", irb.id);
    });
    axios.post(this.state.searchUrl, params).then(response => {
      const results = response.data;
      this.setState(() => ({
        data: results.data === null ? [] : results.data,
        loading: false,
        loaded: true
      }));
      this.saveStateToLocalStorage();
    }).catch(error => {
      this.setState(() => { throw error; });
    });
  }

  render() {
    return (
      <div>
        <h1>Search</h1>
        <hr />
        <form onSubmit={this.handleSubmit}>
          <div className="row">
            <div className={"form-group col-md-6"}>
              <label>ORSP Identification #</label>
              <ProjectAutocomplete
                ref={el => {
                  this.projectAutocomplete = el;
                }}
                searchUrl={this.state.projectKeySearchUrl}
                onChange={selected => {
                  if (
                    selected[0] != null &&
                    !(typeof selected[0].projectKey === "undefined")
                  ) {
                    this.setState(() => ({
                      projectKey: selected[0].projectKey,
                      defaultProjectSelected: selected
                    }));
                  } else {
                    this.setState(() => ({
                      projectKey: "",
                      defaultProjectSelected: []
                    }));
                  }
                  this.saveStateToLocalStorage();
                }}
                defaultSelected={this.state.defaultProjectSelected}
              />
            </div>
            <div className={"form-group col-md-6"}>
              <label>Type</label>
              <Typeahead
                ref={"issueType"}
                align={"left"}
                multiple={true}
                options={this.state.issueTypes}
                onChange={selected => {
                  this.setState(() => ({ types: selected }));
                  this.saveStateToLocalStorage();
                }}
                defaultSelected={this.state.types}
              />
            </div>
          </div>
          <div className="row">
            <div className={"form-group col-md-6"}>
              <label>Person</label>
              <UserAutocomplete
                ref={el => {
                  this.userAutocomplete = el;
                }}
                userNameSearchUrl={this.state.userNameSearchUrl}
                onChange={selected => {
                  if (
                    selected[0] != null &&
                    !(typeof selected[0].id === "undefined")
                  ) {
                    this.setState(() => ({
                      userName: selected[0].id,
                      defaultUserSelected: selected
                    }));
                  } else {
                    this.setState(() => ({
                      userName: "",
                      defaultUserSelected: []
                    }));
                  }
                  this.saveStateToLocalStorage();
                }}
                defaultSelected={this.state.defaultUserSelected}
              />
            </div>
            <div className={"form-group col-md-6"}>
              <label>Status</label>
              <Typeahead
                ref={"issueStatus"}
                align={"left"}
                multiple={true}
                options={this.state.issueStatuses}
                onChange={selected => {
                  this.setState(() => ({ statuses: selected }));
                  this.saveStateToLocalStorage();
                }}
                defaultSelected={this.state.statuses}
              />
            </div>
          </div>
          <div className="row">
            <div className={"form-group col-md-6"}>
              <label>Text or Number</label>
              <input
                name={"freeText"}
                className={"form-control"}
                type={"text"}
                onChange={this.handleChange}
                value={this.state.freeText}
              />
            </div>
            <div className={"form-group col-md-6"}>
              <label>IRB of Record</label>
              <Typeahead
                ref={"irbOfRecord"}
                align={"left"}
                multiple={true}
                labelKey={option => `${option.value}`}
                options={this.state.irbs}
                onChange={selected => {
                  this.setState(() => ({ irb: selected }));
                  this.saveStateToLocalStorage();
                }}
                defaultSelected={this.state.irb}
              />
            </div>
          </div>
          <div className="row">
            <div className={"form-group col-md-6"}>
              <label>Funding</label>
              <input
                ref={"funding"}
                name={"funding"}
                className={"form-control"}
                type={"text"}
                onChange={this.handleChange}
                value={this.state.funding}
              />
            </div>
          </div>

          <div className={"row"}>
            <div className={"form-group col-md-6"}>
              <input
                type={"submit"}
                className={"btn btn-primary"}
                value={"Search"}
                ref={"search"}
                style={{ marginRight: "1rem" }}
              />
              <input
                type={"reset"}
                className={"btn btn-default"}
                value={"Clear"}
                onClick={this.handleClear}
              />
            </div>
          </div>
        </form>
        <hr />
        <SearchResults
          getUserUrl={this.props.getUserUrl}
          data={this.state.data}
          loading={this.state.loading}
          loaded={this.state.loaded}
        />
      </div>
    );
  }
}

export default Search;
