import React from "react";
import "./ProjectReview.css";
import { Project } from "../util/ajax";
import ProjectVersionDetailedView from "./ProjectVersionDetailedView";
import LoadingWrapper from "../components/LoadingWrapper";
import { hh } from "react-hyperscript-helpers";
import { getDateString } from "../util/Utils";
import { Alert } from "react-bootstrap";

const ProjectVersionsView = hh(class ProjectVersionsView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      expand: false,
      expandIdx: null,
      versionData: {},
      showAlert: false
    };
  }

  handleVerionExpand = ({ projectKey, sequenceNumber }, idx) => {
    // const ELE = document.getElementById(idx).getBoundingClientRect();
    // window.scrollTo({
    //   top: ELE.top + window.scrollY - 100,
    //   behavior: "smooth",
    // });
    if (this.state.expand && this.state.expandIdx === idx) {
      this.setState({
        expand: false,
        expandIdx: null,
      });
      return;
    }
    this.props.showSpinner();
    Project.getProjectByVersion(projectKey, sequenceNumber).then((response) => {
      this.props.hideSpinner();
      this.setState({
        expand: true,
        expandIdx: idx,
        versionData: response.data,
      });
    }).catch((error) => {
      this.props.hideSpinner();
      console.log('Error getting project version data :>> ', error);
      this.setState({
        showAlert: true,
      }, () => {
        setTimeout(() => {
          this.setState({
            showAlert: false,
          });
        }, 4000);
      });
    });
  }

  render() {
    const { issueVersionList } = this.props;
    const { expand, expandIdx, versionData } = this.state;
    return (
      <React.Fragment>
        {this.state.showAlert && <Alert bsStyle="error" className="alert-message">
          Error getting project version data. Please try again later.
        </Alert>}
        {!issueVersionList.length && (
            <div className="project-summary">
              <p className="no-data">No versions available</p>
            </div>
        )}
        {issueVersionList.map((issueVersionData, idx) => (
          <div key={idx}>
            <span id={idx}></span>
            <div
              className="grid version-summary"
              onClick={() => this.handleVerionExpand(issueVersionData, idx)}
            >
              <span className="double-circle">
                {(issueVersionData.sequenceNumber !== 0 || expandIdx === issueVersionList.length - 1) && (
                  <div className="left-line"></div>
                )}
              </span>
              <div className="project-summary">
                <span
                  className={
                    "version-number " +
                    (expand && expandIdx === idx ? "selected" : "")
                  }
                >
                  Version #{issueVersionData.sequenceNumber}
                </span>
                <p className="version-modified">
                  Created by <strong><em>{issueVersionData.createdBy}</em></strong> on
                  <em>{" " + getDateString(issueVersionData.createdAt, 'mmddyyyy')}</em>
                </p>
              </div>
            </div>
            {expand && expandIdx === idx && (
              <div className="grid">
                <div className="project-version-detailed-view">
                  <ProjectVersionDetailedView versionData={versionData} idx={idx}/>
                </div>
              </div>
            )}
          </div>
        ))}
      </React.Fragment>
    );
  }
})

export default LoadingWrapper(ProjectVersionsView);
