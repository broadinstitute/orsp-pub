import { Component } from 'react';
import { hh, div, h2, button } from 'react-hyperscript-helpers';
import { Project } from "../util/ajax";
import { Panel } from "../components/Panel";
import { InputFieldText } from "../components/InputFieldText";
import { InputFieldDatePicker } from "../components/InputFieldDatePicker";
import { InputFieldRadio } from "../components/InputFieldRadio";
import { isEmpty, createObjectCopy, compareNotEmptyObjects } from "../util/Utils";
import { format } from 'date-fns';
import "regenerator-runtime/runtime";
import { InputFieldSelect } from "../components/InputFieldSelect";
import { PREFERRED_IRB } from "../util/TypeDescription";
import { INITIAL_REVIEW } from "../util/TypeDescription";
import { InputTextList } from "../components/InputTextList";
import { Fundings } from "../components/Fundings";
import { AlertMessage } from "../components/AlertMessage";
import LoadingWrapper from "../components/LoadingWrapper";

const AdminOnly = hh(class AdminOnly extends Component {

  _isMounted = false;

  constructor(props) {
    super(props);
    this.state = {
      showSubmissionAlert: false,
      alertMessage: '',
      isAdmin: false,
      initial: {},
      formData: {
        preferredIrb: '',
        preferredIrbText: '',
        investigatorFirstName: '',
        investigatorLastName: '',
        degrees: [''],
        trackingNumber: '',
        projectKey: '',
        projectTitle: '',
        initialDate: null,
        sponsor: [{ source: '', sponsor: '', identifier: '' }],
        initialReviewType: '',
        bioMedical: '',
        irbExpirationDate: null,
        projectStatus: ''
      }
    };
    this.addNewDegree = this.addNewDegree.bind(this)
  }

  componentDidMount() {
    this._isMounted = true;
    this.init()
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  init = () => {
    Project.getProject(this.props.projectKey).then(issue => {
      let formData = {};
      let initial = {};
      this.props.initStatusBoxInfo(issue.data);
      formData.projectKey = this.props.projectKey;
      formData.investigatorFirstName = issue.data.extraProperties.investigatorFirstName;
      formData.investigatorLastName = issue.data.extraProperties.investigatorLastName;
      formData.degrees = issue.data.extraProperties.degrees;
      formData.preferredIrb = isEmpty(issue.data.extraProperties.irb) ? '' : JSON.parse(issue.data.extraProperties.irb);
      formData.preferredIrbText = issue.data.extraProperties.irbReferralText;
      formData.trackingNumber = issue.data.extraProperties.protocol;
      formData.projectTitle = issue.data.extraProperties.projectTitle;
      formData.initialDate = issue.data.extraProperties.initialDate;
      formData.sponsor = this.getSponsorArray(issue.data.fundings);
      formData.initialReviewType = isEmpty(issue.data.extraProperties.initialReviewType) ? '' : JSON.parse(issue.data.extraProperties.initialReviewType);
      formData.bioMedical = issue.data.extraProperties.bioMedical;
      formData.irbExpirationDate = issue.data.extraProperties.irbExpirationDate;
      formData.projectStatus = issue.data.extraProperties.projectStatus;
      initial = createObjectCopy(formData);
      if (this._isMounted) {
        this.setState(prev => {
          prev.formData = formData;
          prev.initial = initial;
          prev.isAdmin = component.isAdmin;
          return prev;
        })
      }
    }).catch(error => {
      console.error(error);
    });
  };

  getSponsorArray(sponsors) {
    let sponsorArray = [];
    if (sponsors !== undefined && sponsors !== null && sponsors.length > 0) {
      sponsors.map(sponsor => {
        sponsorArray.push({
          source: {
            label: sponsor.source,
            value: sponsor.source.split(" ").join("_").toLowerCase()
          },
          sponsor: sponsor.name,
          identifier: sponsor.awardNumber !== null ? sponsor.awardNumber : ''
        });
      });
    }
    return sponsorArray;
  }

  parseDate = (date) => {
    if (date !== null) {
      let d = new Date(date).toISOString();
      return d.slice(0, d.indexOf("T"));
    }
  };

  textHandler = (e) => {
    const field = e.target.name;
    const value = e.target.value;
    this.setState(prev => {
      prev.formData[field] = value;
      return prev;
    });
  };

  radioBtnHandler = (e, field, value) => {
    this.setState(prev => {
      prev.formData[field] = value;
      return prev;
    });
  };

  datePickerHandler = (name) => (date) => {
    this.setState(prev => {
      prev.formData[name] = date;
      return prev;
    });
  };

  handleSelect = (field) => () => (selectedOption) => {
    this.setState(prev => {
      prev.formData[field] = selectedOption;
      return prev;
    })
  };

  submit = () => {
    this.props.showSpinner();
    const parsedForm = this.getParsedForm();
    Project.updateAdminOnlyProps(parsedForm , this.props.projectKey).then(
      response => {
        this.props.hideSpinner();
        this.setState(prev => {
          prev.initial = createObjectCopy(this.state.formData);
          prev.showSubmissionError = false;
          return prev;
        });
        this.props.updateAdminOnlyStatus({ projectStatus : this.state.initial.projectStatus });
        this.successNotification('showSubmissionAlert', 'Project information been successfully updated.', 8000);
      }).catch(
      error => {
        this.props.hideSpinner();
        this.init();
        this.setState(prev => {
          prev.showSubmissionError = true;
          prev.alertMessage = 'Something went wrong. Please try again.';
          return prev;
        });      
      }
    );
  };

  successNotification = (type, message, time) => {
    setTimeout(this.clearAlertMessage(type), time, null);
    this.init();
    this.setState(prev => {
      prev[type] = true;
      prev.alertMessage = message;
      return prev;
    });
  };

  clearAlertMessage = (type) => () => {
    this.setState(prev => {
      prev[type] = false;
      prev.alertMessage = '';
      return prev;
    });
  };

  getParsedForm() {
    let form = {};
    form.irbReferral = JSON.stringify(this.state.formData.preferredIrb);
    form.irbReferralText = this.state.formData.preferredIrbText;
    form.investigatorFirstName = this.state.formData.investigatorFirstName;
    form.investigatorLastName = this.state.formData.investigatorLastName;
    form.initialDate = this.parseDate(this.state.formData.initialDate);
    form.initialReviewType = JSON.stringify(this.state.formData.initialReviewType);
    form.bioMedical = this.state.formData.bioMedical;
    form.irbExpirationDate = this.parseDate(this.state.formData.irbExpirationDate);
    form.projectStatus = this.state.formData.projectStatus;

    let degrees = [];
    if (this.state.formData.degrees !== null && this.state.formData.degrees.length > 0) {
      this.state.formData.degrees.map((degree, idx) => {
        degrees.push(degree);
      });
    }
    form.degree = degrees;
    return form
  }

  degreesHandler = (idx) => (e) => {
    e.persist();
    this.setState(prev => {
      prev.formData.degrees[idx] = e.target.value;
      return prev;
    });
  };

  addNewDegree = () => {
    if (!this.state.formData.degrees.some(element => isEmpty(element))) {
      this.setState(prev => {
        prev.formData.degrees.push('');
        return prev;
      })
    }
  };

  removeDegree = (idx) => {
    if (this.state.formData.degrees.length > 1) {
      this.setState(prev => {
        prev.formData.degrees.splice(idx, 1);
        return prev;
      });
    } else if (!isEmpty(this.state.formData.degrees[0])) {
      this.setState(prev => {
        prev.formData.degrees[0] = '';
        return prev;
      });
    }
  };

  render() {
    return(
      div({},[
        h2({ className: "stepTitle" }, ["Admin Only"]),   
        Panel({ title: "Project Details" }, [
          InputFieldRadio({
            id: "radioProjectStatus",
            name: "projectStatus",
            label: "Project Status",
            value: this.state.formData.projectStatus,
            optionValues: ['Approved', 'Disapproved', 'Withdrawn', 'Closed', 'Abandoned'],
            optionLabels: [
              "Approved",
              "Disapproved",
              "Withdrawn",
              "Closed",
              "Abandoned"
            ],
            onChange: this.radioBtnHandler,
            readOnly: !this.state.isAdmin
          }),
          InputFieldSelect({
            label: "IRB",
            id: "preferredIrb",
            name: "preferredIrb",
            options: PREFERRED_IRB,
            value: this.state.formData.preferredIrb,
            onChange: this.handleSelect("preferredIrb"),
            readOnly: true,
            placeholder: isEmpty(this.state.formData.preferredIrb) && this.state.readOnly ? "--" : "Select...",
            edit: false
          }),
          InputFieldText({
            id: "preferredIrbText",
            name: "preferredIrbText",
            label: "Please specify IRB",
            readOnly: !this.state.isAdmin,
            isRendered: this.state.formData.preferredIrb.value === "other",
            value: this.state.formData.preferredIrbText,
            onChange: this.textHandler,
          }),
          InputFieldText({
            id: "investigatorFirstName",
            name: "investigatorFirstName",
            label: "First Name of Investigator",
            readOnly: !this.state.isAdmin,
            value: this.state.formData.investigatorFirstName,
            onChange: this.textHandler,
          }),
          InputFieldText({
            id: "investigatorLastName",
            name: "investigatorLastName",
            label: "Last Name of Investigator",
            readOnly: !this.state.isAdmin,
            value: this.state.formData.investigatorLastName,
            onChange: this.textHandler,
          }),
          InputTextList({
            id: "degrees",
            name: "degrees",
            label: "Degree(s) of Investigator",
            value: this.state.formData.degrees,
            textHandler: this.degreesHandler,
            add: this.addNewDegree,
            remove: this.removeDegree,
            isReadOnly: !this.state.isAdmin
          }),
          InputFieldText({
            id: "trackingNumber",
            name: "trackingNumber",
            label: "Protocol Number",
            readOnly: true,
            value: this.state.formData.trackingNumber,
            onChange: this.textHandler,
          }),
          InputFieldText({
            id: "projectKey",
            name: "projectKey",
            label: "ORSP Number",
            readOnly: true,
            value: this.state.formData.projectKey,
            onChange: this.textHandler,
          }),
          InputFieldText({
            id: "projectTitle",
            name: "projectTitle",
            label: "Title",
            readOnly: true,
            value: this.state.formData.projectTitle,
            onChange: this.textHandler,
          }),
          InputFieldDatePicker({
            selected: this.state.formData.initialDate,
            value: isEmpty(this.state.formData.initialDate) ? format(new Date(this.state.formData.initialDate), 'MM/DD/YYYY') : null,
            name: "initialDate",
            label: "Initial Approval Date",
            onChange: this.datePickerHandler,
            placeholder: "Enter date...",
            readOnly: !this.state.isAdmin,
          }),
          div({ style: { 'marginTop': '20px' }}, [
            Fundings({
              fundings: this.state.formData.sponsor,
              current: this.state.formData.sponsor,
              readOnly: true,
              edit: false
            })
          ]),
          InputFieldSelect({
            id: "initialReviewType",
            name: "initialReviewType",
            label: "Type of Initial Review",
            options: INITIAL_REVIEW,
            readOnly: !this.state.isAdmin,
            value: this.state.formData.initialReviewType,
            onChange: this.handleSelect("initialReviewType"),          
            placeholder: "Select..."
          }),
          InputFieldRadio({
            id: "bioMedical",
            name: "bioMedical",
            label: "Biomedical or Non-Biomedical Study",
            value: this.state.formData.bioMedical,
            onChange: this.radioBtnHandler,
            optionValues: ["biomedical", "nonBiomedical"],
            optionLabels: [
              "Biomedical",
              "Non-Biomedical"
            ],
            readOnly: !this.state.isAdmin,
            required: false,
            edit: false
          }),
          InputFieldDatePicker({
            selected: this.state.formData.irbExpirationDate,
            value: isEmpty(this.state.formData.irbExpirationDate) ? format(new Date(this.state.formData.irbExpirationDate), 'MM/DD/YYYY') : null,
            name: "irbExpirationDate",
            label: "Expiration Date",
            onChange: this.datePickerHandler,
            placeholder: "Enter date...",
            readOnly: !this.state.isAdmin,
          })
        ]),
        AlertMessage({
          msg: this.state.alertMessage,
          show: this.state.showSubmissionAlert,
          type: 'success'
        }),
        AlertMessage({
          msg: this.state.alertMessage,
          show: this.state.showSubmissionError,
          type: 'danger'
        }),
        div({ className: "buttonContainer", style: { 'margin': '20px 0 40px 0' } }, [
          button({
            disabled: compareNotEmptyObjects(this.state.formData, this.state.initial),
            className: "btn buttonPrimary floatRight",
            onClick: this.submit,
            isRendered: this.state.isAdmin
          }, ["Submit"])
        ])
      ])
    )
  }
});

export default LoadingWrapper(AdminOnly)
