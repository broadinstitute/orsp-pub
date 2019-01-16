import { Component } from 'react';
import { hh, p, div, h2, span, a, button } from 'react-hyperscript-helpers';
import { Panel } from '../components/Panel';
import { InputFieldText } from '../components/InputFieldText';
import { MultiSelect } from '../components/MultiSelect';
import { Fundings } from '../components/Fundings';

import { InputYesNo } from '../components/InputYesNo';
import { InputFieldTextArea } from '../components/InputFieldTextArea';
import { InputFieldRadio } from '../components/InputFieldRadio';
import { Project } from "../util/ajax";
import { Search } from '../util/ajax';

const ORSP_ROLE = "orsp";

class ProjectReview extends Component {

  constructor(props) {
    super(props);
    this.state = {
      readOnly: true,
      description: '',
      projectExtraProps: {
        projectTitle: '',
        protocol: '',
        subjectProtection: '',
        projectReviewApproved: false
      },
      piList: [{ key: '', label: '', value: '' }],
      pmList: [{ key: '', label: '', value: '' }],
      fundings: [{ source: { label: '', value: '' }, sponsor: '', identifier: '' }],
      collaborators: [{ key: '', label: '', value: '' }],
      requestor: {
        displayName: '',
        emailAddress: ''
      },
      disableApproveButton: false,
      formerData: {
        requestor: {
          displayName: '',
          emailAddress: ''
        },
        requestorName: this.props.user !== undefined ? this.props.user.displayName : '',
        reporter: this.props.user !== undefined ? this.props.user.userName : '',
        requestorEmail: this.props.user !== undefined ? this.props.user.email.replace("&#64;", "@") : '',
        projectManager: '',
        piName: '',
        studyDescription: '',
        pTitle: '',
        irbProtocolId: '',
        subjectProtection: '',
        fundings: [{ source: '', sponsor: '', identifier: '' }],
        collaborators: [],
        projectExtraProps: {
          projectTitle: '',
          protocol: '',
          subjectProtection: '',
          projectReviewApproved: false
        }
      }
    }
  }

  componentDidCatch(error, info) {
    console.log('----------------------- error ----------------------')
    console.log(error, info);
  }

  componentDidMount() {
    Project.getProject(this.props.projectUrl, this.props.projectKey).then(
      element =>
        this.setState(prev => {
          prev.description = element.data.issue.description;
          prev.projectExtraProps = element.data.extraProperties;
          prev.piList = this.getUsersArray(element.data.pis);
          prev.pmList = this.getUsersArray(element.data.pms);
          prev.collaborators = this.getUsersArray(element.data.collaborators);
          prev.fundings = this.getFundingsArray(element.data.fundings);
          prev.requestor = element.data.requestor !== null ? element.data.requestor : this.state.requestor;

          // should get this valeus from temporary storage 
          // prev.formerData.description = element.data.issue.description;
          // prev.formerData.projectExtraProps = element.data.extraProperties;
          // prev.formerData.piList = this.getUsersArray(element.data.pis);
          // prev.formerData.pmList = this.getUsersArray(element.data.pms);
          // prev.formerData.collaborators = this.getUsersArray(element.data.collaborators);
          // prev.formerData.fundings = this.getFundingsArray(element.data.fundings);
          // prev.formerData.requestor = element.data.requestor !== null ? element.data.requestor : this.state.requestor;

          prev.formerData.description = null;
          prev.formerData.projectExtraProps = {};
          prev.formerData.piList = null
          prev.formerData.pmList = null;
          prev.formerData.collaborators = null;
          prev.formerData.fundings = null;
          prev.formerData.requestor = {
            displayName: '',
              emailAddress: ''
          };

          return prev;
        }, () => { })
    );
  }

  getUsersArray(array) {
    let usersArray = [];
    if (array !== undefined && array !== null && array.length > 0) {
      array.map(element => {
        usersArray.push({
          key: element.userName,
          label: element.displayName + " (" + element.emailAddress + ") ",
          value: element.displayName
        });
      });
    }
    return usersArray
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

  isEmpty(value) {
    return value === '' || value === null || value === undefined;
  }

  isAdmin = (e) => {
    return this.props.roles.indexOf(ORSP_ROLE) > -1;
  }

  approveRevision = (e) => () => {
    this.setState({ disableApproveButton: true })
    const data = { projectReviewApproved: true }
    Project.addExtraProperties(this.props.addExtraPropUrl, this.props.projectKey, data).then(
      () => this.setState(prev => {
        prev.projectExtraProps.projectReviewApproved = true;
        return prev;
      })
    );
  }

  enableEdit = (e) => () => {
    this.setState({
      readOnly: false
    });
  }

  cancelEdit = (e) => () => {
    this.setState({
      readOnly: true
    });
  }

  submitEdit = (e) => () => {
    this.setState({
      readOnly: true
    });
  }

  loadUsersOptions(query, callback) {
    if (query.length > 2) {
      Search.getMatchingUsers(this.props.searchUsersURL, query)
        .then(response => {
          let options = response.data.map(function (item) {
            return {
              key: item.id,
              value: item.value,
              label: item.label
            };
          });
          callback(options);
        });
    }
  };

  handleProjectCollaboratorChange = (data, action) => {
    this.setState(prev => {
      prev.collaborators = data;
      return prev;
    }); //, () => this.props.updateForm(this.state.formData, 'collaborators'));
  };

  handlePIChange = (data, action) => {
    this.setState(prev => {
      prev.piList = data;
      return prev;
    }); //, () => this.props.updateForm(this.state.formData, 'piName'));
  };

  handleProjectManagerChange = (data, action) => {
    this.setState(prev => {
      prev.pmList = data;
      return prev;
    }); //, () => this.props.updateForm(this.state.formData, 'projectManager'));
    //this.props.removeErrorMessage();
  };

  handleInputChange = (e) => {
    const field = e.target.name;
    const value = e.target.value;
    console.log('handleInputChange', field, value);
    this.setState(prev => {
      if (prev.formerData[field] == null) {
        prev.formerData[field] = prev[field] === undefined ? null : prev[field];
      }
      prev[field] = value;
      return prev;
    }); // , () => this.props.updateForm(this.state.formData, field));
    //this.props.removeErrorMessage();
  };

  handleProjectExtraPropsChange = (e) => {
    const field = e.target.name;
    const value = e.target.value;
    console.log('handleProjectExtraPropsChange', field, value, this.state);
    this.setState(prev => {
      // prev.formerData.projectExtraProps[field] = prev.projectExtraProps[field];
      if (prev.formerData.projectExtraProps[field] == null) {
        console.log('-------->', prev.projectExtraProps[field]);
        prev.formerData.projectExtraProps[field] = prev.projectExtraProps[field] === undefined ? null : prev.projectExtraProps[field];
      }
      prev.projectExtraProps[field] = value;
      return prev;
    }); // , () => this.props.updateForm(this.state.formData, field));
    //this.props.removeErrorMessage();
  };

  render() {

    console.log(this.state.projectExtraProps.projectTitle, this.state.formerData.projectExtraProps.projectTitle, this.state);
    return (
      div({}, [
        h2({ className: "stepTitle" }, ["Project Information"]),

        Panel({ title: "Requestor" }, [
          InputFieldText({
            id: "inputRequestorName",
            name: "requestorName",
            label: "Requestor Name",
            value: this.state.requestor.displayName,
            currentValue: this.state.formerData.requestor.displayName,
            readOnly: true,
            required: true,
            onChange: () => { }
          }),
          InputFieldText({
            id: "inputRequestorEmail",
            name: "requestorEmail",
            label: "Requestor Email Address",
            value: this.state.requestor.emailAddress,
            currentValue: this.state.formerData.requestor.emailAddress,
            readOnly: true,
            required: true,
            onChange: () => { }
          })
        ]),

        Panel({ title: "Principal Investigator" }, [
          MultiSelect({
            id: "pi_select",
            label: "Broad PI",
            name: 'piList',
            readOnly: this.state.readOnly,
            loadOptions: this.loadUsersOptions,
            handleChange: this.handlePIChange,
            value: this.state.piList,
            currentValue: this.state.formerData.piList,
            isMulti: this.state.piList.length > 1
          }),

          MultiSelect({
            id: "inputProjectManager",
            label: "Broad Project Manager",
            name: 'pmList',
            readOnly: this.state.readOnly,
            loadOptions: this.loadUsersOptions,
            handleChange: this.handleProjectManagerChange,
            value: this.state.pmList,
            currentValue: this.state.formerData.pnList,
            isMulti: this.state.pmList.length > 1
          })
        ]),

        Panel({ title: "Funding" }, [
          Fundings({
            fundings: this.state.fundings,
            updateFundings: null,
            readOnly: this.state.readOnly,
            error: false,
            errorMessage: ""
          })
        ]),

        Panel({ title: "Project Summary" }, [
          InputFieldTextArea({
            id: "inputStudyActivitiesDescription",
            name: "description",
            label: "Broad study activities",
            value: this.state.description.replace(/<\/?[^>]+(>|$)/g, ""),
            currentValue: this.state.formerData.description,
            readOnly: this.state.readOnly,
            required: false,
            onChange: this.handleInputChange,
            error: false,
            errorMessage: "Required field"
          }),
          MultiSelect({
            id: "collaborator_select",
            label: "Individuals who require access to this project record",
            name: 'collaborators',
            readOnly: this.state.readOnly,
            loadOptions: this.loadUsersOptions,
            handleChange: this.handleProjectCollaboratorChange,
            value: this.state.collaborators,
            currentValue: this.state.formerData.collaborators,
            isMulti: true
          }),
          InputFieldText({
            id: "inputPTitle",
            name: "projectTitle",
            label: "Title of project/protocol",
            value: this.state.projectExtraProps.projectTitle,
            currentValue: this.state.formerData.projectExtraProps.projectTitle,
            readOnly: this.state.readOnly,
            required: false,
            onChange: this.handleProjectExtraPropsChange,
            error: false,
            errorMessage: "Required field"
          }),
          InputFieldText({
            id: "inputIrbProtocolId",
            name: "protocol",
            label: "Protocol # at Broad IRB-of-record ",
            value: this.state.projectExtraProps.protocol,
            currentValue: this.state.formerData.projectExtraProps.protocol,
            readOnly: this.state.readOnly,
            required: false,
            onChange: this.handleProjectExtraPropsChange,
          }),
          InputYesNo({
            id: "radioSubjectProtection",
            name: "subjectProtection",
            label: "Is the Broad Institute's Office of Research Subject Protection administratively managing this project, ",
            moreInfo: "i.e. responsible for oversight and submissions?",
            value: this.state.projectExtraProps.subjectProtection,
            currentValue: this.state.formerData.projectExtraProps.subjectProtection,
            onChange: this.handleProjectExtraPropsChange,
            required: false,
            readOnly: this.state.readOnly,
            error: false,
            errorMessage: "Required field"
          })
        ]),

        Panel({ title: "Determination Questions " }, [
          div({ isRendered: !this.isEmpty(this.state.projectExtraProps.feeForService) }, [
            InputYesNo({
              id: "radioPII",
              name: "radioPII",
              label: 'Is this a "fee-for-service" project? ',
              moreInfo: '(commercial service only, no Broad publication privileges)',
              value: this.state.projectExtraProps.feeForService,
              currentValue: this.state.formerData.projectExtraProps.feeForService,
              readOnly: this.state.readOnly,
              onChange: this.handleProjectExtraPropsChange,
            }),
          ]),
          div({ isRendered: !this.isEmpty(this.state.projectExtraProps.broadInvestigator) }, [
            InputYesNo({
              id: "broadInvestigator",
              name: "broadInvestigator",
              value: this.state.projectExtraProps.broadInvestigator,
              currentValue: this.state.formerData.projectExtraProps.broadInvestigator,
              moreInfo: '(generating, contributing to generalizable knowledge)? Examples include case studies, internal technology development projects.',
              label: 'Is a Broad investigator conducting research ',
              readOnly: this.state.readOnly,
              onChange: this.handleProjectExtraPropsChange,
            })
          ]),
          div({ isRendered: !this.isEmpty(this.state.projectExtraProps.subjectsDeceased) }, [
            InputYesNo({
              id: "subjectsDeceased",
              name: "subjectsDeceased",
              value: this.state.projectExtraProps.subjectsDeceased,
              currentValue: this.state.formerData.projectExtraProps.subjectsDeceased,
              label: 'Are all subjects who provided samples and/or data now deceased?',
              readOnly: this.state.readOnly,
              onChange: this.handleProjectExtraPropsChange,
            })
          ]),
          div({ isRendered: !this.isEmpty(this.state.projectExtraProps.sensitiveInformationSource) }, [
            InputYesNo({
              id: "sensitiveInformationSource",
              name: "sensitiveInformationSource",
              value: this.state.projectExtraProps.sensitiveInformationSource,
              currentValue: this.state.formerData.projectExtraProps.sensitiveInformationSource,
              moreInfo: '(Coded data are considered identifiable if researcher has access to key)',
              label: 'Is Broad investigator/staff a) obtaining information or biospecimens through an interaction with living human subjects or, b) obtaining/analyzing/generating identifiable private information or identifiable biospecimens ',
              readOnly: this.state.readOnly,
              onChange: this.handleProjectExtraPropsChange,
            })
          ]),
          div({ isRendered: !this.isEmpty(this.state.projectExtraProps.interactionSource) }, [
            InputYesNo({
              id: "interactionSource",
              name: "interactionSource",
              value: this.state.projectExtraProps.interactionSource,
              currentValue: this.state.formerData.projectExtraProps.interactionSource,
              moreInfo: '(i.e. is conductin HSR)?',
              label: 'Are samples/data being provied by an investigator who has identifiers or obtains samples through and interaction ',
              readOnly: this.state.readOnly,
              onChange: this.handleProjectExtraPropsChange,
            })
          ]),
          div({ isRendered: !this.isEmpty(this.state.projectExtraProps.isIdReceive) }, [
            InputYesNo({
              id: "isIdReceive",
              name: "isIdReceive",
              value: this.state.projectExtraProps.isIdReceive,
              currentValue: this.state.formerData.projectExtraProps.isIdReceive,
              label: 'Is the Broad receiving subject identifiers?',
              readOnly: this.state.readOnly,
              onChange: this.handleProjectExtraPropsChange,
            })
          ]),
          div({ isRendered: !this.isEmpty(this.state.projectExtraProps.isCoPublishing) }, [
            InputYesNo({
              id: "isCoPublishing",
              name: 'isCoPublishing',
              value: this.state.projectExtraProps.isCoPublishing,
              currentValue: this.state.formerData.projectExtraProps.isCoPublishing,
              label: 'Is the Broad researcher co-publishing or doing joint analysis with investigator who has access to identifiers?',
              readOnly: this.state.readOnly,
              onChange: this.handleProjectExtraPropsChange,
            })
          ]),
          div({ isRendered: !this.isEmpty(this.state.projectExtraProps.federalFunding) }, [
            InputYesNo({
              id: "federalFunding",
              name: 'federalFunding',
              value: this.state.projectExtraProps.federalFunding,
              currentValue: this.state.formerData.projectExtraProps.federalFunding,
              label: 'Is Broad receiving direct federal funding?',
              readOnly: this.state.readOnly,
              onChange: this.handleProjectExtraPropsChange,
            })
          ])
        ]),

        div({ className: "buttonContainer", style: { 'marginRight': '0' } }, [
          button({
            className: "btn buttonPrimary ",
            onClick: this.enableEdit(),
            disabled: this.state.readOnly === false,
            isRendered: true
          }, ["Edit"]),
          button({
            className: "btn buttonPrimary ",
            onClick: this.cancelEdit(),
            disabled: this.state.readOnly === true,
            isRendered: true
          }, ["Cancel"]),
          button({
            className: "btn buttonPrimary ",
            onClick: this.submitEdit(),
            disabled: this.state.readOnly === true,
            isRendered: true
          }, ["Submit Edtis"]),
          button({
            className: "btn buttonPrimary floatRight",
            onClick: this.approveRevision(),
            disabled: this.state.disableApproveButton,
            isRendered: this.isAdmin && !this.state.projectExtraProps.projectReviewApproved
          }, ["Approve"]),
        ])
      ])
    )
  }
}

export default ProjectReview;