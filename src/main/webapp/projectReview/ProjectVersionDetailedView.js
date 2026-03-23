import React, { Component } from "react";
import { Panel } from "../components/Panel";
import { Fundings } from "../components/Fundings";
import './ProjectReview.css'
import { InputYesNo } from "../components/InputYesNo";
import { InputFieldRadio } from "../components/InputFieldRadio";
import { InputFieldTextArea } from "../components/InputFieldTextArea";
import { KeyPersonnel } from "../components/KeyPersonnel"

class ProjectVersionDetailedView extends Component {
  constructor(props) {
    super(props);
    const params = new URLSearchParams(window.location.search);
    this.state = {
      formData: this.props.versionData,
      issueType: params.get('consentKey') != null ? 'consent-group' : 'project'
    };
  }

  getExtraPropertyValueFromJSON = (key) => {
    const EXTRA_PROP_DATA = this.state.formData.extraProperties.find(item => item.name === key);
    if (!EXTRA_PROP_DATA) {
      return '--';
    }
    return JSON.parse(EXTRA_PROP_DATA.value).label;
  }

  getExtraPropertyValue = (key) => {
    const EXTRA_PROP_DATA = this.state.formData.extraProperties.find(item => item.name === key);
    if (!EXTRA_PROP_DATA) {
      return '--';
    }
    return EXTRA_PROP_DATA.value;
  }

  getFundingsArray(fundings) {
    let fundingsArray = [];
    if (fundings !== undefined && fundings !== null && fundings.length > 0) {
      fundings.map(funding => {
        fundingsArray.push({
          source: {
            label: funding.source,
            value: funding.source.split(" ").join("_").toLowerCase()
          },
          sponsor: funding.name,
          identifier: funding.awardNumber !== null ? funding.awardNumber : ''
        });
      });
    }
    return fundingsArray;
  }

  getKeyPersonArray(keyPersons) {
  if (!keyPersons || !keyPersons.length) return [];
  return keyPersons.map(keyPerson => ({
    name: keyPerson.displayName,
    role: keyPerson.role,
    otherRole: keyPerson.otherRole,
    updatedDate: keyPerson.updatedDate

  }));
}

  render() {
    const {issue, fundings, requestor, pis, pms, collaborators, keypersons } = this.state.formData;
    const additionalPis = Array.isArray(pis) ? pis.filter(pi => pi.piType === "SECONDARY") : []
    const primaryPis = Array.isArray(pis) ? pis.filter(pi => pi.piType === "PRIMARY") : []
    const additionalPms = Array.isArray(pms) ? pms.filter(pm => pm.pmType === "SECONDARY") : []
    const primaryPms = Array.isArray(pms) ? pms.filter(pm => pm.pmType === "PRIMARY") : []
    return (
      <React.Fragment>
        <div className="project-container">
          <div className="headerBox">
            <p className="issue-type">{issue.type}</p>
            <h1 className="projectTitle">
              <span className="projectKey">{issue.projectKey + ": "}</span>
              <span className="italic">{issue.summary}</span>
            </h1>
            {this.state.issueType === 'project' && (
              <p className="headerLabel">
                Status: <span>{issue.status}</span>
              </p>
            )}
          </div>
          <div className="" id="project-details">
            <Panel title="Key Personnel" id="principal-investigator">
              <div className="mb-15">
                <label>Broad Principal Investigator (PI) Responsible for Project Conduct and Oversight</label>
                <p className="answer-fields">
                  {primaryPis.length 
                    ? primaryPis.map((pi, idx) => (
                        pi.displayName + "(" + pi.emailAddress + ")"
                      )).join(", ") 
                    : "--"}
                </p>
              </div>
              {/* <div className="mb-15">
                <label>Additional Broad Co-Investigators</label>
                <p className="answer-fields">
                  {additionalPis.length
                    ? additionalPis.map((pi, idx) => (
                      pi.displayName + "(" + pi.emailAddress + ")"
                    )).join(", ")
                    : "--"}
                </p>
              </div> */}
              <div className="mb-15">
                <label>PI’s Primary Institutional Affiliation</label>
                <p className="answer-fields">{this.getExtraPropertyValueFromJSON("affiliations")}</p>
              </div>
              <div className="mb-15">
                <label>Key Study Contact (will receive email notifications about this project)</label>
                <p className="answer-fields">
                  {primaryPms.length 
                    ? primaryPms.map((pm, idx) => (
                        pm.displayName + "(" + pm.emailAddress + ")"
                      )).join(", ") 
                    : "--"}
                </p>
              </div>
            </Panel>
            <Panel title="Broad Study Staff" id="study-staff">
              <KeyPersonnel
                keyPersons={this.getKeyPersonArray(keypersons)}
                readOnly={true}
                comparisonView = {true} >
              </KeyPersonnel>
            </Panel>
            <Panel title="Requestor" id="requestor">
              <div className="mb-15">
                <label>Requestor Name</label>
                <p className="answer-fields">{requestor.displayName}</p>
              </div>
            </Panel>
            <Panel title="Funding" id="fundings">
              <Fundings
                fundings={this.getFundingsArray(fundings)}
                readOnly={true}
              ></Fundings>
            </Panel>
            <Panel title="Project Summary" id="project-summary">
              <div className="mb-15">
                <label>Broad Study Activities</label>
                <p className="answer-fields">{issue.description}</p>
              </div>
              <div className="mb-15">
                <label>Title of project/protocol</label>
                <p className="answer-fields">{issue.summary}</p>
              </div>
              <div className="mb-15">
                <label>Protocol # at Broad IRB-of-record</label>
                <p className="answer-fields">{this.getExtraPropertyValue("protocol")}</p>
              </div>
              <div className="mb-15">
                <label>IRB-of-record</label>
                <p className="answer-fields">{this.getExtraPropertyValueFromJSON("irb")}</p>
              </div>
            </Panel>
            <Panel title="Determination Questions" id="determination-questions">
              {this.getExtraPropertyValue("feeForService") !== "--" && 
                <div className="mb-15">
                  <InputYesNo
                    label={
                      `Is this a “fee for service” project? `
                    }
                    moreInfo={
                      `(Commercial service only, no direct federal funding, no data 
                      analysis, no data storage, no dbGaP deposition by Broad.)`
                    }
                    id="version-radioPII"
                    name="version-radioPII"
                    value={this.getExtraPropertyValue("feeForService")}
                    readOnly={true}
                    onChange={() => {}}
                  ></InputYesNo>
                </div>
              }
              {this.getExtraPropertyValue("broadInvestigator") !== "--" && 
                <div className="mb-15">
                  <InputYesNo
                    label={
                      `Is a Broad scientist(s) conducting research (generating or contributing 
                      to generalizable knowledge, with the intention to publish results)? `
                    }
                    moreInfo={
                        <span>Examples of projects that, <b>DO NOT </b>, contribute to 
                        generalizable knowledge include small case studies and internal 
                        technology development/validation projects.</span>
                    }
                    id="version-broadInvestigator"
                    name="version-broadInvestigator"
                    value={this.getExtraPropertyValue("broadInvestigator")}
                    readOnly={true}
                    onChange={() => {}}
                  ></InputYesNo>
                  {this.getExtraPropertyValue("broadInvestigator") === "false" && 
                    <InputFieldTextArea 
                      id="version-broadInvestigatorTextValue"
                      name="version-broadInvestigatorTextValue"
                      label={
                        `Please provide a rationale for why this project/work would not be considered as research`
                      }
                      value={this.getExtraPropertyValue("broadInvestigatorTextValue")}
                      readOnly={true}
                      onChange={() => {}}
                    />
                  }
                </div>
              }
              {this.getExtraPropertyValue("broadInvestigatorTextValue") !== "--" &&
                <div className="mb-15">
                  <label>Please provide a rationale for why this project/work would not be considered as research</label>
                  <p className="answer-fields">{this.getExtraPropertyValue("broadInvestigatorTextValue")}</p>
                </div>
              }
              {this.getExtraPropertyValue("subjectsDeceased") !== "--" && 
                <div className="mb-15">
                  <InputFieldRadio
                    label={
                      `Does this project  involve only specimens or data from deceased individuals?`
                    }
                    moreInfo={""}
                    id="version-subjectsDeceased"
                    name="version-subjectsDeceased"
                    value={this.getExtraPropertyValue("subjectsDeceased")}
                    readOnly={true}
                    onChange={() => {}}
                    optionValues={['true', 'false']}
                    optionLabels={['Yes', 'No/Unknown']}
                  ></InputFieldRadio>
                </div>
              }
              {this.getExtraPropertyValue("sensitiveInformationSource") !== "--" && 
                <div className="mb-15">
                  <InputFieldRadio
                    label={
                      <span>Will specimens or data be provided to the Broad <i style={{'color': '#0A3356'}}>without </i> identifiable information? </span>
                    }
                    moreInfo={""}
                    id="version-sensitiveInformationSource"
                    name="version-sensitiveInformationSource"
                    value={this.getExtraPropertyValue("sensitiveInformationSource")}
                    readOnly={true}
                    onChange={() => {}}
                    optionValues={['false', 'true']}
                    optionLabels={['No', 'Yes']}
                  ></InputFieldRadio>
                </div>
              }
              {this.getExtraPropertyValue("isIdReceive") !== "--" && 
                <div className="mb-15">
                  <InputYesNo
                    label={
                      `Does the sample or data provider have access to identifiers?`
                    }
                    moreInfo={""}
                    id="version-isIdReceive"
                    name="version-isIdReceive"
                    value={this.getExtraPropertyValue("isIdReceive")}
                    readOnly={true}
                    onChange={() => {}}
                  ></InputYesNo>
                </div>
              }
              {this.getExtraPropertyValue("isCoPublishing") !== "--" && 
                <div className="mb-15">
                  <InputYesNo
                    label={
                      `Will anyone at the Broad be co-publishing or jointly analyzing 
                      data with the sample/data provider who has access to identifiable 
                      information about the original sample/data donor?`
                    }
                    moreInfo={""}
                    id="version-isCoPublishing"
                    name="version-isCoPublishing"
                    value={this.getExtraPropertyValue("isCoPublishing")}
                    readOnly={true}
                    onChange={() => {}}
                  ></InputYesNo>
                </div>
              }
              {this.getExtraPropertyValue("irbReviewedProtocol") !== "--" && 
                <div className="mb-15">
                  <InputFieldRadio
                    label={
                      `Please select the option which best describes your research `
                    }
                    moreInfo={""}
                    id="version-irbReviewedProtocol"
                    name="version-irbReviewedProtocol"
                    value={this.getExtraPropertyValue("irbReviewedProtocol")}
                    readOnly={true}
                    onChange={() => {}}
                    optionValues={['irbReviewedProtocol', 'sensitiveInformationSource', 'secondaryResearch', 'privateInformation']}
                    optionLabels={
                      [
                        'This is a project that will be/has been reviewed by an IRB, with Broad listed as a study site.', 
                        'This project will include an intervention/interaction with subjects, or identifiable information or identifiable private biospecimens will be used.',
                        'This project is secondary research using data or biospecimens not collected specifically for this study.',
                        <span>This is not a secondary use study. The Broad scientist/team will obtain coded private information/biospecimens 
                          from another institution that retains a link to identifiers, <b>AND </b> be unable to readily ascertain the identity 
                          of subjects, <b>AND </b> will not receive a direct federal grant/award at Broad.</span>
                      ]
                    }
                  ></InputFieldRadio>
                </div>
              }
              {this.getExtraPropertyValue("humanSubjects") !== "--" && 
                <div className="mb-15">
                  <InputYesNo
                    label={""}
                    moreInfo={
                      <span>
                        <span style={{ 'display': 'block' }}>Is this a project that only includes interactions involving, 
                          <span style={{fontWeight: 'bold', textDecoration: 'underline'}}> surveys or interview procedures</span> 
                          (including visual or auditory recording) <b>IF AT LEAST ONE OF THE FOLLOWING IS TRUE:</b>
                        </span>
                        <span style={{ 'display': 'block' }}>
                          (i) The information is recorded in such a manner that the identity of the subjects cannot readily be ascertained;
                        </span> 
                        <span style={{ 'display': 'block' }}> <b>OR</b></span> 
                        <span style={{ 'display': 'block' }}> 
                          (ii) Any disclosure of the responses outside the research would not reasonably 
                          place the subjects at risk of criminal  or civil liability or be damaging to the subjects' financial standing, 
                          employability, educational advancement, or reputation
                        </span>
                      </span>
                    }
                    id="version-humanSubjects"
                    name="version-humanSubjects"
                    value={this.getExtraPropertyValue("humanSubjects")}
                    readOnly={true}
                    onChange={() => {}}
                  ></InputYesNo>
                </div>
              }
              {this.getExtraPropertyValue("interactionSource") !== "--" && 
                <div className="mb-15">
                  <InputYesNo
                    label={
                      `Does the statement below accurately describe your project?`
                    }
                    moreInfo={
                      <span style={{ 'display': 'block' }}>
                        I or another member of the project team (including a collaborator, sample/data contributor, or co-investigator) 
                        have recorded study data (including data about biospecimens) in such a way that the identity 
                        of the subjects cannot be readily ascertained <b>directly or indirectly </b> 
                        through identifiers linked to the subjects; <b> AND </b> 
                        no one on the research team will attempt to contact or re-identify subjects.
                      </span>
                    }
                    id="version-interactionSource"
                    name="version-interactionSource"
                    value={this.getExtraPropertyValue("interactionSource")}
                    readOnly={true}
                    onChange={() => {}}
                  ></InputYesNo>
                </div>
              }
            </Panel>
          </div>
        </div>
      </React.Fragment>
    )
  }
}

export default ProjectVersionDetailedView;
