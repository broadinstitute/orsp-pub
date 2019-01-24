import { Component } from 'react';
import { hh, p, div, h2, span, a, button } from 'react-hyperscript-helpers';
import { Panel } from '../components/Panel';
import { InputFieldText } from '../components/InputFieldText';
import { MultiSelect } from '../components/MultiSelect';
import { Fundings } from '../components/Fundings';
import { InputYesNo } from '../components/InputYesNo';
import { InputFieldTextArea } from '../components/InputFieldTextArea';
import { InputFieldRadio } from '../components/InputFieldRadio';
import { ConfirmationDialog } from "../components/ConfirmationDialog";
import { spinnerService } from "../util/spinner-service";
import { Project } from "../util/ajax";
import { Search } from '../util/ajax';
import { User } from '../util/ajax';


class ProjectReview extends Component {

  constructor(props) {
    super(props);

    this.state = {
      showDialog: false,
      showApproveDialog: false,
      readOnly: true,
      collaborators: [{ key: '', label: '', value: '' }],
      formData: {
        description: '',
        projectExtraProps: {
          projectTitle: '',
          protocol: '',  
          subjectProtection: null,
          manageProtocol: null,
          projectAvailability: null,
          describeEditType: null,
          editDescription: null,
          projectReviewApproved: false,
          
          piList: [{ key: '', label: '', value: '' }],
          pmList: [{ key: '', label: '', value: '' }]
        },       
        fundings: [{ source: { label: '', value: '' }, sponsor: '', identifier: '' }],
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
        collaborators: [],
        fundings: [{ source: '', sponsor: '', identifier: '' }],
        projectExtraProps: {
          irbProtocolId: '',
          projectTitle: '',
          protocol: '',
          subjectProtection: null,
          manageProtocol: null,
          projectAvailability: null,
          describeEditType: null,
          editDescription: null,
          projectReviewApproved: false          
        }
      }
    }
    this.rejectProject = this.rejectProject.bind(this);
    this.approveEdits = this.approveEdits.bind(this);
  }

  componentDidCatch(error, info) {
    console.log('----------------------- error ----------------------')
    console.log(error, info);
  }

  componentDidMount() {
    let current = {};
    let currentStr = {};
    let future = {};
    let futureCopy = {};
    let futureStr = {};
    let formData = {};
    let formDataStr = {};
    Project.getProject(this.props.projectUrl, this.props.projectKey).then(
      issue => {

        // store current issue info here ....
        current.description = issue.data.issue.description;
        current.projectExtraProps = issue.data.extraProperties;
        current.piList = this.getUsersArray(issue.data.pis);
        current.pmList = this.getUsersArray(issue.data.pms);
        current.collaborators = this.getUsersArray(issue.data.collaborators);
        current.fundings = this.getFundingsArray(issue.data.fundings);
        current.requestor = issue.data.requestor !== null ? issue.data.requestor : this.state.requestor;
        currentStr = JSON.stringify(current);

        // read suggestions here ....
        // ....
        // Project.getSuggestions(this.props.projectUrl, this.props.projectKey).then(
        //   edits => {

        let edits = null;

        if (edits != null) {
          // prepare form data here, initially same as current ....
          future.description = edits.data.issue.description;
          future.projectExtraProps = edits.data.extraProperties;
          future.piList = this.getUsersArray(edits.data.pis);
          future.pmList = this.getUsersArray(edits.data.pms);
          future.collaborators = this.getUsersArray(edits.data.collaborators);
          future.fundings = this.getFundingsArray(edits.data.fundings);
          future.requestor = edits.data.requestor !== null ? edits.data.requestor : this.state.requestor;
          futureStr = JSON.stringify(future);

          formData = JSON.parse(futureStr);
          futureCopy = JSON.parse(futureStr);
        } else {
          // prepare form data here, initially same as current ....
          formData = JSON.parse(currentStr);
          current = JSON.parse(currentStr);
          future = JSON.parse((currentStr));
          futureCopy = JSON.parse(currentStr);
        }

        // store current issue info here ....
        this.setState(prev => {
          // prepare form data here, initially same as current ....
          prev.formData = formData;
          prev.current = current;
          prev.future = future;
          prev.futureCopy = futureCopy;
          return prev;
        });

        // });
      });
  }

  isAdmin() {
    return this.props.isAdmin === "true";
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

  rejectProject() {
    spinnerService.showAll();
    Project.rejectProject(this.props.rejectProjectUrl, this.props.projectKey).then(resp => {
      window.location.href = [this.props.serverURL, "index"].join("/");
      spinnerService.hideAll();
    });
  }

  discardEdits = (e) => () => {

  }

  approveEdits() {
    let project = this.getProject();
    Project.updateProject(this.props.projectUrl, project, this.props.projectKey).then(
      resp => {
        window.location.href = [this.props.serverURL, "index"].join("/");
        spinnerService.showAll();
      })
      .catch(error => {
      spinnerService.hideAll();
      console.error(error);
    });
  }

  getProject() {
    let project = {};
    project.description = this.state.formData.description;
    project.fundings = this.getFundings(this.state.formData.fundings);
    let extraProperties = [];
    extraProperties.push({name: 'subjectProtection', value: this.state.formData.projectExtraProps.subjectProtection});
    extraProperties.push({name: 'projectReviewApproved', value: this.state.formData.projectExtraProps.projectReviewApproved })
    extraProperties.push({name: 'protocol', value: this.state.formData.projectExtraProps.protocol});
    extraProperties.push({name: 'feeForService', value: this.state.formData.projectExtraProps.feeForService});
    extraProperties.push({name: 'projectTitle', value: this.state.formData.projectExtraProps.projectTitle});
   
    //list 
    let collaborators = this.state.formData.projectExtraProps.collaborators;
    if (this.state.formData.pmList !== null &&this.state.formData.pmList.length > 0) {
      this.state.formData.pmList.map((pm, idx) => {
        extraProperties.push({name: 'pm', value: pm.key});
      });
    }
    if (this.state.formData.pmList !== null &&this.state.formData.piList.length > 0) {
      this.state.formData.piList.map((pi, idx) => {
        extraProperties.push({name: 'pi', value: pi.key});
      });
    }
    if (collaborators !== null && collaborators.length > 0) {
      collaborators.map((collaborator, idx) => {
        extraProperties.push({name: 'collaborator', value: collaborator.key});
      });
    }
    project.extraProperties = extraProperties;
    return project;
  }

  getFundings(fundings) {
    let fundingList = [];
    if (fundings !== null && fundings.length > 0) {
      fundings.map((f, idx) => {
        let funding = {};
        funding.source = f.source.label;
        funding.awardNumber = f.identifier;
        funding.name = f.sponsor;
        fundingList.push(funding);
      });
    }
    return fundingList;
  }
  //////////////////////TODOOOO


  enableEdit = (e) => () => {
    this.setState({
      readOnly: false
    });
  }

  cancelEdit = (e) => () => {
    this.setState({
      formData: this.state.futureCopy,
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
      prev.formData.projectExtraProps.collaborators = data;
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

  handleProjectExtraPropsChangeRadio = (e, field, value) => {
    if (value === 'true') {
      value = true;
    } else if (value === 'false') {
      value = false;
    }

    this.setState(prev => {
      prev.formData.projectExtraProps[field] = value;
      return prev;
    }); //, () => this.props.updateForm(this.state.formData, field));
    //this.props.removeErrorMessage();
  };

  handleProjectExtraPropsChange = (e) => {
    const field = e.currentTarget.name;
    const value = e.currentTarget.value;
    this.setState(prev => {
      prev.formData.projectExtraProps[field] = value;
      return prev;
    }); // , () => this.props.updateForm(this.state.formData, field));
    //this.props.removeErrorMessage();
  };

  closeModal = () => {
    this.setState({
      showDialog: !this.state.showDialog
    });
  };
   
  handleApproveDialog = () => {
    this.setState({
      showApproveDialog: !this.state.showApproveDialog
    });
  };

  render() {

    return (
      div({}, [
        h2({ className: "stepTitle" }, ["Project Information"]),
        ConfirmationDialog({
          closeModal: this.closeModal,
          show: this.state.showDialog,
          handleOkAction: this.rejectProject,
          title: 'Remove Confirmation',
          bodyText: 'Are you sure yo want to remove this project?',
          actionLabel: 'Yes'
        }, []),
        ConfirmationDialog({
          closeModal: this.handleApproveDialog,
          show: this.state.showApproveDialog,
          handleOkAction: this.approveEdits,
          title: 'Approve Edits Confirmation',
          bodyText: 'Are you sure yo want to approve this edits?',
          actionLabel: 'Yes'
        }, []),
        button({
          className: "btn buttonPrimary floatRight",
          style: { 'marginTop': '15px' },
          onClick: this.enableEdit(),
          isRendered: this.state.readOnly === true
        }, ["Edit Information"]),

        button({
          className: "btn buttonSecondary floatRight",
          style: { 'marginTop': '15px' },
          onClick: this.cancelEdit(),
          isRendered: this.state.readOnly === false
        }, ["Cancel"]),

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
            isMulti: true
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
            currentValue: this.state.current.fundings,
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
            value: this.state.formData.projectExtraProps.collaborators,
            currentValue: this.state.current.projectExtraProps.collaborators,
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
          }),

          /*IMPORTANT: These questions will appear on Edit mode, once project has been approved*/
          InputYesNo({
            isRendered: false,
            id: "radioManageProtocol",
            name: "manageProtocol",
            label: "Is the Broad Institute managing this protocol? ",
            value: this.state.formData.projectExtraProps.manageProtocol,
            currentValue: this.state.current.projectExtraProps.manageProtocol,
            onChange: this.handleProjectExtraPropsChangeRadio,
            required: false,
            readOnly: this.state.readOnly,
            error: false,
            errorMessage: "Required field"
          }),

          InputFieldRadio({
            isRendered: false,
            id: "radioProjectAvailability",
            name: "projectAvailability",
            label: "Project Availability",
            // value: this.state.projectExtraProps.projectAvailability,
            optionValues: ["01", "02"],
            optionLabels: [
              "Available",
              "On Hold"
            ],
            onChange: () => { },
            readOnly: this.state.readOnly
          })
        ]),

        Panel({ title: "Notes to ORSP", isRendered: false, }, [
          InputFieldRadio({
            id: "radioDescribeEdits",
            name: "describeEditType",
            label: "Please choose one of the following to describe the proposed Edits: ",
            // value: this.state.projectExtraProps.describeEditType,
            optionValues: ["01", "02"],
            optionLabels: [
              "I am informing Broad's ORSP of a new amendment I already submitted to my IRB of record",
              "I am requesting assistance in updating and existing project"
            ],
            onChange: () => { },
            readOnly: this.state.readOnly
          }),

          InputFieldTextArea({
            id: "inputDescribeEdits",
            name: "editDescription",
            label: "Please use the space below to describe any additional edits or clarifications to the edits above",
            // value: this.state.formData.editDescription.replace(/<\/?[^>]+(>|$)/g, ""),
            currentValue: this.state.current.editDescription,
            readOnly: this.state.readOnly,
            required: false,
            onChange: this.handleInputChange,
            error: false,
            errorMessage: "Required field"
          })
        ]),
        /*UNTIL HERE*/

        Panel({ title: "Determination Questions", tooltipLabel: "?", tooltipMsg: "If changes need to be made to any of these questions, please submit a new project request" }, [
          div({ isRendered: !this.isEmpty(this.state.formData.projectExtraProps.feeForService), className: "firstRadioGroup" }, [
            InputYesNo({
              id: "radioPII",
              name: "radioPII",
              label: 'Is this a "fee-for-service" project? ',
              moreInfo: '(commercial service only, no Broad publication privileges)',
              value: this.state.formData.projectExtraProps.feeForService,
              currentValue: this.state.current.projectExtraProps.feeForService,
              readOnly: true,
              onChange: () => { }
            })
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
              onChange: () => { }
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
              onChange: () => { }
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
              onChange: () => { }
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
              onChange: () => { }
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
              onChange: () => { }
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
              onChange: () => { }
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
              onChange: () => { }
            })
          ])
        ]),
        div({ className: "buttonContainer", style: { 'margin': '20px 0 40px 0' } }, [
          button({
            className: "btn buttonPrimary floatLeft",
            onClick: this.enableEdit(),
            isRendered: this.state.readOnly === true
          }, ["Edit Information"]),

          button({
            className: "btn buttonSecondary",
            onClick: this.cancelEdit(),
            isRendered: this.state.readOnly === false
          }, ["Cancel"]),

          /*visible for every user in edit mode and disabled until some edit has been made*/
          button({
            className: "btn buttonPrimary floatRight",
            onClick: this.submitEdit(),
            // disabled: ,
            isRendered: this.state.readOnly === false
          }, ["Submit Edits"]),

          /*visible for Admin in readOnly mode and if there are changes to review*/
          button({
            className: "btn buttonPrimary floatRight",
            onClick: this.handleApproveDialog,
            disabled: this.state.disableApproveButton,
            isRendered: this.isAdmin() && this.state.formData.projectExtraProps.projectReviewApproved
          }, ["Approve Edits"]),

          /*visible for every user in readOnly mode and if there are changes to review*/
          button({
            className: "btn buttonSecondary floatRight",
            onClick: this.discardEdits(),
            disabled: this.state.disableApproveButton,
            isRendered: this.isAdmin() && this.state.formData.projectExtraProps.projectReviewApproved
          }, ["Discard Edits"]),

          /*visible for Admin in readOnly mode and if the project is in "pending" status*/
          button({
            className: "btn buttonPrimary floatRight",
            onClick: this.approveRevision(),
            disabled: this.state.disableApproveButton,
            isRendered: this.isAdmin() && !this.state.formData.projectExtraProps.projectReviewApproved
          }, ["Approve"]),

          /*visible for Admin in readOnly mode and if the project is in "pending" status*/
          button({
            className: "btn buttonSecondary floatRight",
            onClick: this.handleDialog,
            disabled: this.state.disableApproveButton,
            isRendered: this.isAdmin() && !this.state.formData.projectExtraProps.projectReviewApproved
          }, ["Reject"])
        ])
      ])
    )
  }
}

export default ProjectReview;