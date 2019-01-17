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
      formData: {
        description: '',
        projectExtraProps: {
          projectTitle: '',
          protocol: '',
          subjectProtection: null,
          projectReviewApproved: false
        },
        piList: [{ key: '', label: '', value: '' }],
        pmList: [{ key: '', label: '', value: '' }],
        fundings: [{ source: { label: '', value: '' }, sponsor: '', identifier: '' }],
        collaborators: [{ key: '', label: '', value: '' }],
        requestor: {
          displayName: '',
          emailAddress: ''
        }
      },
      disableApproveButton: false,

      current: {
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
        fundings: [{ source: '', sponsor: '', identifier: '' }],
        collaborators: [],
        projectExtraProps: {
          projectTitle: '',
          protocol: '',
          subjectProtection: null,
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
      issue => {

        // store current issue info here ....
        let current = {};
        current.description = issue.data.issue.description;
        current.projectExtraProps = issue.data.extraProperties;
        current.piList = this.getUsersArray(issue.data.pis);
        current.pmList = this.getUsersArray(issue.data.pms);
        current.collaborators = this.getUsersArray(issue.data.collaborators);
        current.fundings = this.getFundingsArray(issue.data.fundings);
        current.requestor = issue.data.requestor !== null ? issue.data.requestor : this.state.requestor;

        let currentStr = JSON.stringify(current);

        // read suggestions here ....
        // ....
        // Project.getSuggestions(this.props.projectUrl, this.props.projectKey).then(
        //   edits => {

            let edits = null;
            let formData = {};
            let suggestions = {};
            let suggestionsCopy = {};

            if (edits != null) {
              // prepare form data here, initially same as current ....
              let editsStr = JSON.stringify(edits);
              formData.description = edits.data.issue.description;
              formData.projectExtraProps = edits.data.extraProperties;
              formData.piList = this.getUsersArray(edits.data.pis);
              formData.pmList = this.getUsersArray(edits.data.pms);
              formData.collaborators = this.getUsersArray(edits.data.collaborators);
              formData.fundings = this.getFundingsArray(edits.data.fundings);
              formData.requestor = edits.data.requestor !== null ? edits.data.requestor : this.state.requestor;

              suggestions = JSON.parse(JSON.stringify(formData));
              suggestionsCopy = JSON.parse(JSON.stringify(formData));


            } else {
              // prepare form data here, initially same as current ....
              formData = JSON.parse(currentStr);
              suggestions = JSON.parse((currentStr));
              suggestionsCopy = JSON.parse((currentStr));
            }

            // store current issue info here ....
            this.setState(prev => {
              // prepare form data here, initially same as current ....
              prev.formData = formData;
              prev.current = current;
              prev.suggestions = suggestions;
              prev.suggestionsCopy = suggestionsCopy;
              return prev;

            });

          // });
      });
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

  discardEdits = (e) => () => {

  }

  approveEdits = (e) => () => {
    
  }


  enableEdit = (e) => () => {
    this.setState({
      readOnly: false
    });
  }

  cancelEdit = (e) => () => {
    this.setState({
      formData: this.state.suggestionsCopy,
      readOnly: true
    });
  }

  submitEdit = (e) => () => {
    this.setState({
      readOnly: true
    });
  }

  loadUsersOptions = (query, callback) => {
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

  handleUpdateFundings = (updated) => {
    this.setState(prev => {
      prev.formData.fundings = updated;
      return prev;
    }); //, () => this.props.updateForm(this.state.formData, 'fundings'));
    //this.props.removeErrorMessage();
  };

  handleProjectCollaboratorChange = (data, action) => {
    this.setState(prev => {
      prev.formData.collaborators = data;
      return prev;
    }); //, () => this.props.updateForm(this.state.formData, 'collaborators'));
  };

  handlePIChange = (data, action) => {
    this.setState(prev => {
      prev.formData.piList = data;
      return prev;
    }); //, () => this.props.updateForm(this.state.formData, 'piName'));
  };

  handleProjectManagerChange = (data, action) => {
    this.setState(prev => {
      prev.formData.pmList = data;
      return prev;
    }); //, () => this.props.updateForm(this.state.formData, 'projectManager'));
    //this.props.removeErrorMessage();
  };

  handleInputChange = (e) => {
    const field = e.target.name;
    const value = e.target.value;
    console.log('handleInputChange', field, value);
    this.setState(prev => {
      prev.formData[field] = value;
      return prev;
    }); // , () => this.props.updateForm(this.state.formData, field));
    //this.props.removeErrorMessage();
  };

  handleRadioChange = (e, field, value) => {
    if (value === 'true') {
      value = true;
    } else if (value === 'false') {
      value = false;
    }

    this.setState(prev => {
      prev.formData[field] = value;
      return prev;
    }); //, () => this.props.updateForm(this.state.formData, field));
    //this.props.removeErrorMessage();
  };

  handleProjectExtraPropsChangeRadio  = (e, field, value) => {
    if (value === 'true') {
      value = true;
    } else if (value === 'false') {
      value = false;
    }
    console.log('handleProjectExtraPropsChangeRadio', field, value);

    this.setState(prev => {
      prev.formData.projectExtraProps[field] = value;
      return prev;
    }); //, () => this.props.updateForm(this.state.formData, field));
    //this.props.removeErrorMessage();
  };

  handleProjectExtraPropsChange = (e) => {
    const field = e.currentTarget.name;
    const value = e.currentTarget.value;
    console.log('handleProjectExtraPropsChange', field, value, this.state);
    this.setState(prev => {
      prev.formData.projectExtraProps[field] = value;
      return prev;
    }); // , () => this.props.updateForm(this.state.formData, field));
    //this.props.removeErrorMessage();
  };

  render() {

    console.log('------------------------- RENDER ---------------------------------------------',this.state);
    return (
      div({}, [
        h2({ className: "stepTitle" }, ["Project Information"]),

        Panel({ title: "Requestor" }, [
          InputFieldText({
            id: "inputRequestorName",
            name: "requestorName",
            label: "Requestor Name",
            value: this.state.formData.requestor.displayName,
            currentValue: this.state.current.requestor.displayName,
            readOnly: true,
            required: true,
            onChange: () => { }
          }),
          InputFieldText({
            id: "inputRequestorEmail",
            name: "requestorEmail",
            label: "Requestor Email Address",
            value: this.state.formData.requestor.emailAddress,
            currentValue: this.state.current.requestor.emailAddress,
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
            value: this.state.formData.piList,
            currentValue: this.state.current.piList,
            isMulti: true // this.state.formData.piList.length > 1
          }),

          MultiSelect({
            id: "inputProjectManager",
            label: "Broad Project Manager",
            name: 'pmList',
            readOnly: this.state.readOnly,
            loadOptions: this.loadUsersOptions,
            handleChange: this.handleProjectManagerChange,
            value: this.state.formData.pmList,
            currentValue: this.state.current.pmList,
            isMulti: true // this.state.formData.pmList.length > 1
          })
        ]),

        Panel({ title: "Funding" }, [
          Fundings({
            fundings: this.state.formData.fundings,
            currentValue: this.state.current.fudings,
            updateFundings: this.handleUpdateFundings,
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
            value: this.state.formData.description.replace(/<\/?[^>]+(>|$)/g, ""),
            currentValue: this.state.current.description,
            readOnly: this.state.readOnly,
            required: false,
            onChange: this.handleInputChange,
            error: false,
            errorMessage: "Required field"
          }),

          MultiSelect({
            id: "collaborator_select",
            label: "Individuals who require access to this project record",
            isDisabled: false,
            readOnly: this.state.readOnly,
            loadOptions: this.loadUsersOptions,
            handleChange: this.handleProjectCollaboratorChange,
            value: this.state.formData.collaborators,
            currentValue: this.state.current.collaborators,
            placeholder: "Start typing collaborator names",
            isMulti: true
          }),

          InputFieldText({
            id: "inputPTitle",
            name: "projectTitle",
            label: "Title of project/protocol",
            value: this.state.formData.projectExtraProps.projectTitle,
            currentValue: this.state.current.projectExtraProps.projectTitle,
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
            value: this.state.formData.projectExtraProps.protocol,
            currentValue: this.state.current.projectExtraProps.protocol,
            readOnly: this.state.readOnly,
            required: false,
            onChange: this.handleProjectExtraPropsChange,
          }),
          InputYesNo({
            id: "radioSubjectProtection",
            name: "subjectProtection",
            label: "Is the Broad Institute's Office of Research Subject Protection administratively managing this project, ",
            moreInfo: "i.e. responsible for oversight and submissions?",
            value: this.state.formData.projectExtraProps.subjectProtection,
            currentValue: this.state.current.projectExtraProps.subjectProtection,
            onChange: this.handleProjectExtraPropsChangeRadio,
            required: false,
            readOnly: this.state.readOnly,
            error: false,
            errorMessage: "Required field"
          })
        ]),

        Panel({ title: "Determination Questions " }, [
          div({ isRendered: !this.isEmpty(this.state.formData.projectExtraProps.feeForService) }, [
            InputYesNo({
              id: "radioPII",
              name: "radioPII",
              label: 'Is this a "fee-for-service" project? ',
              moreInfo: '(commercial service only, no Broad publication privileges)',
              value: this.state.formData.projectExtraProps.feeForService,
              currentValue: this.state.current.projectExtraProps.feeForService,
              readOnly: true,
              onChange: () => {}
            }),
          ]),
          div({ isRendered: !this.isEmpty(this.state.formData.projectExtraProps.broadInvestigator) }, [
            InputYesNo({
              id: "broadInvestigator",
              name: "broadInvestigator",
              value: this.state.formData.projectExtraProps.broadInvestigator,
              currentValue: this.state.current.projectExtraProps.broadInvestigator,
              moreInfo: '(generating, contributing to generalizable knowledge)? Examples include case studies, internal technology development projects.',
              label: 'Is a Broad investigator conducting research ',
              readOnly: true,
              onChange: () => {}
            })
          ]),
          div({ isRendered: !this.isEmpty(this.state.formData.projectExtraProps.subjectsDeceased) }, [
            InputYesNo({
              id: "subjectsDeceased",
              name: "subjectsDeceased",
              value: this.state.formData.projectExtraProps.subjectsDeceased,
              currentValue: this.state.current.projectExtraProps.subjectsDeceased,
              label: 'Are all subjects who provided samples and/or data now deceased?',
              readOnly: true,
              onChange: () => {}
            })
          ]),
          div({ isRendered: !this.isEmpty(this.state.formData.projectExtraProps.sensitiveInformationSource) }, [
            InputYesNo({
              id: "sensitiveInformationSource",
              name: "sensitiveInformationSource",
              value: this.state.formData.projectExtraProps.sensitiveInformationSource,
              currentValue: this.state.current.projectExtraProps.sensitiveInformationSource,
              moreInfo: '(Coded data are considered identifiable if researcher has access to key)',
              label: 'Is Broad investigator/staff a) obtaining information or biospecimens through an interaction with living human subjects or, b) obtaining/analyzing/generating identifiable private information or identifiable biospecimens ',
              readOnly: true,
              onChange: () => {}
            })
          ]),
          div({ isRendered: !this.isEmpty(this.state.formData.projectExtraProps.interactionSource) }, [
            InputYesNo({
              id: "interactionSource",
              name: "interactionSource",
              value: this.state.formData.projectExtraProps.interactionSource,
              currentValue: this.state.current.projectExtraProps.interactionSource,
              moreInfo: '(i.e. is conductin HSR)?',
              label: 'Are samples/data being provied by an investigator who has identifiers or obtains samples through and interaction ',
              readOnly: true,
              onChange: () => {}
            })
          ]),
          div({ isRendered: !this.isEmpty(this.state.formData.projectExtraProps.isIdReceive) }, [
            InputYesNo({
              id: "isIdReceive",
              name: "isIdReceive",
              value: this.state.formData.projectExtraProps.isIdReceive,
              currentValue: this.state.current.projectExtraProps.isIdReceive,
              label: 'Is the Broad receiving subject identifiers?',
              readOnly: true,
              onChange: () => {}
            })
          ]),
          div({ isRendered: !this.isEmpty(this.state.formData.projectExtraProps.isCoPublishing) }, [
            InputYesNo({
              id: "isCoPublishing",
              name: 'isCoPublishing',
              value: this.state.formData.projectExtraProps.isCoPublishing,
              currentValue: this.state.current.projectExtraProps.isCoPublishing,
              label: 'Is the Broad researcher co-publishing or doing joint analysis with investigator who has access to identifiers?',
              readOnly: true,
              onChange: () => {}
            })
          ]),
          div({ isRendered: !this.isEmpty(this.state.formData.projectExtraProps.federalFunding) }, [
            InputYesNo({
              id: "federalFunding",
              name: 'federalFunding',
              value: this.state.formData.projectExtraProps.federalFunding,
              currentValue: this.state.current.projectExtraProps.federalFunding,
              label: 'Is Broad receiving direct federal funding?',
              readOnly: true,
              onChange: () => {}
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
            className: "btn buttonSecondary ",
            onClick: this.cancelEdit(),
            disabled: this.state.readOnly === true,
            isRendered: true
          }, ["Cancel"]),
          button({
            className: "btn buttonPrimary ",
            onClick: this.submitEdit(),
            disabled: this.state.readOnly === true,
            isRendered: true
          }, ["Submit Edits"]),

          button({
            className: "btn buttonSecondary ",
            onClick: this.discardEdits(),
            disabled: this.state.disableApproveButton,
            isRendered: this.isAdmin && this.state.formData.projectExtraProps.projectReviewApproved
          }, ["Discard Edits "]),
          
          button({
            className: "btn buttonPrimary ",
            onClick: this.approveEdits(),
            disabled: this.state.disableApproveButton,
            isRendered: this.isAdmin && this.state.formData.projectExtraProps.projectReviewApproved
          }, ["Approve Edits "]),

          button({
            className: "btn buttonPrimary floatRight",
            onClick: this.approveRevision(),
            disabled: this.state.disableApproveButton,
            isRendered: this.isAdmin && !this.state.formData.projectExtraProps.projectReviewApproved
          }, ["Approve"]),
        ])
      ])
    )
  }
}

export default ProjectReview;