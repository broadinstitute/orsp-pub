import React from 'react';
import axios from 'axios';
import { div, h2, span } from 'react-hyperscript-helpers';

import CollectionTable from './CollectionTable'
import ProjectAutocomplete from "../util/ProjectAutocomplete";
import ResponseView from './ResponseView'
import SampleCollectionAutocomplete from "../util/SampleCollectionAutocomplete";

export default class CollectionLinks extends React.Component {
  constructor(props) {
    super(props);
    this.loadData = this.loadData.bind(this);
    this.handleClear = this.handleClear.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.renderForm = this.renderForm.bind(this);
    this.renderTable = this.renderTable.bind(this);
    this.renderResponse = this.renderResponse.bind(this);
    this.projectAutocomplete = React.createRef();
    this.consentAutocomplete = React.createRef();
    this.sampleAutocomplete = React.createRef();
    this.state = {
      data: [],
      loading: true,
      loaded: false,
      consentKey: "",
      projectKey: "",
      sampleCollectionId: "",
      errors: "",
      successResponse: {},
      errorResponse: {}
    }
  }

  componentDidMount() {
    this.loadData();
  }

  loadData() {
    axios.get(this.props.cclSummariesUrl)
      .then(response => {
        const results = response.data;
        this.setState(() => ({
          data: results.data,
          loading: false,
          loaded: true
        }));
      }).catch(error => {
        this.setState(() => { throw error; });
      });
  }

  handleClear() {
    this.setState(() => ({
      consentKey: "",
      projectKey: "",
      sampleCollectionId: "",
      successResponse: {},
      errorResponse: {},
    }));
    this.projectAutocomplete.clear();
    this.consentAutocomplete.clear();
    this.sampleAutocomplete.clear();
  }

  handleSubmit(event) {
    event.preventDefault();
    let params = new URLSearchParams();
    params.append('projectKey', this.state.projectKey);
    params.append('consentKey', this.state.consentKey);
    params.append('sampleCollectionId', this.state.sampleCollectionId);
    axios.post(this.props.cclPostUrl, params)
      .then(response => {
        this.setState(() => ({
          successResponse: response,
          errorResponse: {},
          // re-init values for the current list of collection links
          data: [],
          loading: true,
          loaded: false
        }));
        this.loadData();
      })
      .catch(response => {
        this.setState(() => ({
          successResponse: {},
          errorResponse: response
        }));
      });
  }

  render() {
    return (
      div({className: 'container'}, [this.renderForm(), this.renderTable()])
    )
  }

  renderResponse() {
    const showSuccess = Object.keys(this.state.successResponse).length > 0
    const showError = Object.keys(this.state.errorResponse).length > 0
    const content = showSuccess ? this.state.successResponse.data : (showError ? this.state.errorResponse.response.data : " ")
    const response = <ResponseView
      isError={showError}
      content={content}
      title={showSuccess ? "Success" : "Error"}
      className={showSuccess ? "" : "alert-danger"}
      style={{width: "50%", margin: "2rem", whiteSpace: "pre"}}/>

    if (showSuccess || showError) {
      return (response)
    } else {
      return (div({width: "50%", margin: "2rem"}, [content]));
    }
  }

  renderForm() {
    return (
      <div style={{display: "flex", flexDirection: "row"}}>
        <fieldset style={{width: "50%"}}>
          <h2>New Consent Collection Link</h2>
          <form onSubmit={this.handleSubmit}>
            <div className="form-group">
              <label htmlFor="projectKey">Project</label>
              <ProjectAutocomplete
                ref={el => { this.projectAutocomplete = el; }}
                onChange={ (selected) => {
                  if (selected[0] != null && !(typeof selected[0].projectKey === "undefined")) {
                    this.setState(() => ({ projectKey: selected[0].projectKey}));
                  } else {
                    this.setState(() => ({projectKey: ""}));
                  }
                }}
                defaultSelected={[]}
              />
            </div>

            <div className="form-group">
              <label htmlFor="consentKey">Consent Group</label>
              <ProjectAutocomplete
                ref={el => {this.consentAutocomplete = el}}
                searchUrl={this.props.consentKeySearchUrl}
                onChange={ (selected) => {
                  if (selected[0] != null && !(typeof selected[0].projectKey === "undefined")) {
                    this.setState(() => ({ consentKey: selected[0].projectKey}));
                  } else {
                    this.setState(() => ({consentKey: ""}));
                  }
                }}
                defaultSelected={[]}
              />
            </div>

            <div className="form-group">
              <label htmlFor="sampleCollectionId">Sample Collection</label>
              <SampleCollectionAutocomplete
                ref={el => {this.sampleAutocomplete = el}}
                sampleSearchUrl={this.props.sampleSearchUrl}
                defaultSelected={[]}
                onChange={ (selected) => {
                  if (selected[0] != null && !(typeof selected[0].collectionId === "undefined")) {
                    this.setState(() => ({ sampleCollectionId: selected[0].collectionId}));
                  } else {
                    this.setState(() => ({sampleCollectionId: ""}));
                  }
                }}
              />
            </div>
            <input type={"button"} value={"Add"} className={"btn btn-primary"} onClick={this.handleSubmit} style={{marginRight: '1rem'}}/>
            <input type={"reset"} className={"btn btn-default"} value={"Clear"} onClick={this.handleClear} />
          </form>
        </fieldset>
        {this.renderResponse()}
      </div>
    )
  }

  renderTable() {
    const header = h2("Consent Collection Links");
    if (this.state.loading) {
      return (
        div([header,
          div({className: "alert alert-info"},
            [span({className: "glyphicon glyphicon-refresh glyphicon-refresh-animate"}), ' Loading ...'])]))}
    if (this.state.data.length > 0) {
      return (
        div([header, <CollectionTable data={this.state.data}/>]))
    } else {
      return (
        div([header, div(["No Results"])])
      )
    }
  }

}
