import React from "react";
import { Typeahead, Menu, MenuItem } from "react-bootstrap-typeahead";
import axios from "axios";

import { MultiSelect } from '../components/MultiSelect';
import ProjectAutocomplete from "../util/ProjectAutocomplete";
import SearchResults from "./SearchResults";
import UserAutocomplete from "../util/UserAutocomplete";
import { UrlConstants } from "../util/UrlConstants";
import { LoginText, SampleCollections } from "../util/ajax";
import { isEmpty } from '../util/Utils';
import "./style.css";
import { PortalMessage } from "../components/PortalMessage";
import 'react-bootstrap-typeahead/css/Typeahead.css';
import { InputFieldCheckbox } from "../components/InputFieldCheckbox";

const newStatuses = ["Legacy", "Pending ORSP Admin Review", "Approved", "Disapproved", "Withdrawn", "Closed", "Abandoned", "On Hold"];

const styles = {
  inputStyle: {
    borderRadius: '0',
    minHeight: '38px',
  },
  headStyle: {
    marginTop: '1rem',
  }
};

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
    this.issueTypeRef = React.createRef();
    this.issueStatusRef = React.createRef();
    this.irbOfRecordRef = React.createRef();
    this.searchRef = React.createRef();
    this.state = {
      // setup data
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
      irb: this.getLocalStorageState("irb", "array"),
      collection: '',
      defaultValueForAbout: 'default',
      matchExactUser: true
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
      this.searchRef.current.click();
    }
    this.checkDefault();
  }

  async checkDefault() {
    await LoginText.getLoginText().then(loginText => {
      let data = loginText.data[0];
      if(data[3] === 'default') {
        this.setState({
          defaultValueForAbout: 'default'
        })
      } else {
        this.setState({
          defaultValueForAbout: ''
        })
      }
    })
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
      loaded: false,
      collection: ''
    }));
    this.userAutocomplete.clear();
    this.projectAutocomplete.clear();
    this.issueTypeRef.current.clear();
    this.issueTypeRef.current.blur();
    this.issueStatusRef.current.clear();
    this.issueStatusRef.current.blur();
    this.irbOfRecordRef.current.clear();
    this.irbOfRecordRef.current.blur();
    this.saveStateToLocalStorage();
  }

  handleChange(event) {
    const target = event.target;
    const name = target.name;
    const value = target.value;
    this.setState(() => ({ [name]: value }));
    this.saveStateToLocalStorage();
  }

  handleSampleCollectionChange = (data) => {
    this.setState(prev => {
      prev.collection = data;
      return prev;
    });
  };

  loadSampleCollectionOptions = (query, callback) => {
    if (query.length > 2) {
      SampleCollections.getMatchingCollections(query)
        .then(response => {
          let options = response.data.map(function (item) {
            return {
              key: item.id,
              value: item.value,
              label: item.label
            };
          });
          callback(options);
        }).catch(error => {
        this.setState(() => { throw error; });
      });
    }
  };

  handleSubmit(event) {
    event.preventDefault();
    // these state changes do not need to be persisted for the user
    this.setState(() => ({ data: [], loading: true, loaded: false }));

    let params = new URLSearchParams();
    params.append("text", this.state.freeText);
    params.append("projectKey", this.state.projectKey);
    params.append("funding", this.state.funding);
    params.append("userName", this.state.userName);
    params.append("collection", !isEmpty(this.state.collection) ? this.state.collection.key : '');
    params.append("matchExactUser", this.state.matchExactUser);
    this.state.types.map(function (type, index) {
      params.append("type", type);
    });
    this.state.statuses.map(function (status, index) {
      params.append("status", status);
    });
    this.state.irb.map(function (irb, index) {
      params.append("irb", irb.id);
    });
    axios.post(UrlConstants.searchUrl, params).then(response => {
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

  renderMenu = (results, menuProps) => {
    const items = [];
    items.push(
      <Menu.Header key={`legacy-status-header`}>
        {"New Status"}
      </Menu.Header>,
      results.map((status, idx) => {
        return !!(newStatuses.indexOf(status) !== -1) && <MenuItem key={`legacy-` + idx} option={status} position={idx}>
          {status}
        </MenuItem>
      }),
      <Menu.Header key={`new-status-header`}>
        {"Legacy Status"}
      </Menu.Header>,
      results.map((status, idx) => {
        return !!(newStatuses.indexOf(status) === -1) && <MenuItem key={`new-` + idx} option={status} position={idx}>
          {status}
        </MenuItem>
      })
    );
    return <Menu {...menuProps} id={"menu-item"}>{items}</Menu>
  };

  render() {
    return (
      <div>
        <PortalMessage></PortalMessage>
        <h1>Search</h1>
        <hr />
        <form onSubmit={this.handleSubmit}>
          <div className="row" style={styles.headStyle}>
            <div className="form-group col-md-6">
              <label className="inputFieldLabel">ORSP Identification #</label>
              <ProjectAutocomplete
                ref={el => {
                  this.projectAutocomplete = el;
                }}
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
            <div className="form-group col-md-6">
              <label className="inputFieldLabel">Type</label>
              <Typeahead
                id="issueType"
                ref={this.issueTypeRef}
                align={"left"}
                multiple={true}
                options={component.issueTypes}
                onChange={selected => {
                  this.setState(() => ({ types: selected }));
                  this.saveStateToLocalStorage();
                }}
                defaultSelected={this.state.types}
              />
            </div>
          </div>
          <div className="row">
            <div className="form-group col-md-6">
              <label className="inputFieldLabel">Broad Staff Member</label>
              <UserAutocomplete
                ref={el => {
                  this.userAutocomplete = el;
                }}
                userNameSearchUrl={UrlConstants.userNameSearchUrl}
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
              <InputFieldCheckbox 
                id={'matchExactUser'}
                name={'matchUser'}
                label={'Match Exact Member'}
                readonly={false}
                checked={this.state.matchExactUser}
                onChange= {() => {
                  this.setState({
                    matchExactUser: !this.state.matchExactUser
                  })
                }}
              />
            </div>
            <div className="form-group col-md-6">
              <label className="inputFieldLabel">Status</label>
              <Typeahead
                id="issueStatus"
                ref={this.issueStatusRef}
                align={"left"}
                multiple={true}
                options={component.issueStatuses}
                renderMenu={this.renderMenu}
                onChange={selected => {
                  this.setState(() => ({ statuses: selected }));
                  this.saveStateToLocalStorage();
                }}
                defaultSelected={this.state.statuses}
              />
            </div>
          </div>
          <div className="row">
            <div className="form-group col-md-6">
              <label className="inputFieldLabel">Text or Number</label>
              <input
                name={"freeText"}
                className={"form-control"}
                style={styles.inputStyle}
                type={"text"}
                onChange={this.handleChange}
                value={this.state.freeText}
              />
            </div>
            <div className="form-group col-md-6">
              <label className="inputFieldLabel">IRB of Record</label>
              <Typeahead
                id="irbOfRecord"
                ref={this.irbOfRecordRef}
                align={"left"}
                multiple={true}
                labelKey={option => `${option.value}`}
                options={component.irbs}
                onChange={selected => {
                  this.setState(() => ({ irb: selected }));
                  this.saveStateToLocalStorage();
                }}
                defaultSelected={this.state.irb}
              />
            </div>
          </div>
          <div className="row">
            <div className="form-group col-md-6">
              <label className="inputFieldLabel">Funding</label>
              <input
                ref={"funding"}
                name={"funding"}
                className={"form-control"}
                style={styles.inputStyle}
                type={"text"}
                onChange={this.handleChange}
                value={this.state.funding}
              />
            </div>
            <div className="form-group col-md-6">
              <MultiSelect
                id = {"sc_select"}
                label = {"Sample Collection"}
                name = {'sc'}
                loadOptions = {this.loadSampleCollectionOptions}
                handleChange = {this.handleSampleCollectionChange}
                value = {this.state.collection}
                isMulti = {false}
                edit = {false}>
              </MultiSelect>
            </div>
          </div>

          <div className="row">
            <div className="form-group col-md-6">
              <input
                type={"submit"}
                className={"btn btn-primary"}
                value={"Search"}
                ref={this.searchRef}
                style={{ marginRight: "1rem" }}
              />
              <input
                type={"reset"}
                className={"btn btn-default"}
                value={"Clear cache for new search"}
                onClick={this.handleClear}
              />
            </div>
          </div>
        </form>
        <hr />
        <SearchResults
          data={this.state.data}
          loading={this.state.loading}
          loaded={this.state.loaded}
        />
      </div>
    );
  }
}

export default Search;
