import { Component } from 'react';
import { h, hh, p, div, h2, span, a, button } from 'react-hyperscript-helpers';
import { Project, User } from "../util/ajax";
import { Panel } from "../components/Panel";
import { InputFieldText } from "../components/InputFieldText";
import { InputFieldDatePicker } from "../components/InputFieldDatePicker";
import { InputFieldRadio } from "../components/InputFieldRadio";
import { isEmpty } from "../util/Utils";
import "regenerator-runtime/runtime";

class AdminOnly extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isORSP: false,
      formData: {
        preferredIrb: '',
        investigatorFirstName: '',
        investigatorLastName: '',
        degrees: '',
        trackingNumber: '',
        projectKey: '',
        projectTitle: '',
        initialDate: '',
        sponsor: '',
        initialReviewType: '',
        bioMedical: ''
      }
    }
  }

  componentDidCatch(error, info) {
    console.log('----------------------- error ----------------------');
    console.log(error, info);
  }

  componentDidMount() {
    this.init()
  }

  init = () => {
    this.isCurrentUserAdmin();
    Project.getProject(this.props.projectUrl, this.props.projectKey).then(
      issue => {
        const projectKey = this.props.projectKey;
        const investigatorFirstName = "";//issue.data.extraProperties.investigatorFirstName;
        const investigatorLastName = ""; //issue.data.extraProperties.investigatorLastName;
        const degrees = ""; //issue.data.extraProperties.degrees;
        const preferredIrb = issue.data.extraProperties.irbReferral;
        const trackingNumber = issue.data.extraProperties.protocol;
        const projectTitle = issue.data.extraProperties.projectTitle;
        const initialDate = ""; //issue.data.extraProperties.initialDate;
        const sponsor = ""; //issue.data.extraProperties.sponsor;
        const initialReviewType = ""; //issue.data.extraProperties.initialReviewType;
        const bioMedical = ""; //issue.data.extraProperties.bioMedical;
        console.log(issue.data);
        this.setState(prev => {
          prev.formData.projectKey = projectKey;
          prev.formData.preferredIrb = preferredIrb;
          prev.formData.trackingNumber = trackingNumber;
          prev.formData.projectTitle = projectTitle;
          prev.formData.investigatorFirstName = investigatorFirstName;
          prev.formData.investigatorLastName = investigatorLastName;
          prev.formData.degrees = degrees;
          prev.formData.initialDate = initialDate;
          prev.formData.sponsor = sponsor;
          prev.formData.initialReviewType = initialReviewType;
          prev.formData.bioMedical = bioMedical;
          return prev;
        })
      })
  };

  isCurrentUserAdmin() {
    User.getUserSession(this.props.userSessionUrl).then(
      resp => {
        this.setState({ isORSP: resp.data.isORSP });
      }
    );
  }

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

  datePickerHandler = (id) => (date) => {
    this.setState(prev => {
      prev.formData[id] = date;
      return prev;
    });
  };

  submit = () => {

  };

  render() {
    return(
      div({},[
        h2({ className: "stepTitle" }, ["Only Admin "]),
        Panel({ title: "Investigator Details" }, [
          InputFieldText({
            id: "preferredIrb",
            name: "preferredIrb",
            label: "Preferred IRB",
            disabled: !this.state.isORSP,
            readOnly: !this.state.isORSP,
            value: this.state.formData.preferredIrb,
            onChange: this.textHandler,
            error: false,
            errorMessage: "Invalid."
          }),
          InputFieldText({
            id: "investigatorFirstName",
            name: "investigatorFirstName",
            label: "Investigator First Name",
            disabled: !this.state.isORSP,
            readOnly: !this.state.isORSP,
            value: this.state.formData.investigatorFirstName,
            onChange: this.textHandler,
            error: false,
            errorMessage: "Invalid."
          }),
          InputFieldText({
            id: "investigatorLastName",
            name: "investigatorLastName",
            label: "Investigator Last Name",
            disabled: !this.state.isORSP,
            readOnly: !this.state.isORSP,
            value: this.state.formData.investigatorLastName,
            onChange: this.textHandler,
            error: false,
            errorMessage: "Invalid."
          }),
          InputFieldText({
            id: "degrees",
            name: "degrees",
            label: "Investigator degree(s)",
            disabled: !this.state.isORSP,
            readOnly: !this.state.isORSP,
            value: this.state.formData.degrees,
            onChange: this.textHandler,
            error: false,
            errorMessage: "Invalid."
          })
        ]),
        Panel({ title: "Project Details" }, [
          InputFieldText({
            id: "trackingNumber",
            name: "trackingNumber",
            label: "Protocol #",
            disabled: !this.state.isORSP,
            readOnly: !this.state.isORSP,
            value: this.state.formData.trackingNumber,
            onChange: this.textHandler,
            error: false,
            errorMessage: "Invalid."
          }),
          InputFieldText({
            id: "projectKey",
            name: "projectKey",
            label: "ORSP Number",
            disabled: true,
            readOnly: true,
            value: this.state.formData.projectKey,
            onChange: this.textHandler,
            error: false,
            errorMessage: "Invalid."
          }),
          InputFieldText({
            id: "projectTitle",
            name: "projectTitle",
            label: "Title",
            disabled: !this.state.isORSP,
            readOnly: !this.state.isORSP,
            value: this.state.formData.projectTitle,
            onChange: this.textHandler,
            error: false,
            errorMessage: "Invalid."
          }),

          // InputFieldDatePicker({
          //   selected: this.state.formData.initialDate,//this.state.formData.startDate,
          //   name: "initialDate",
          //   label: "Initial Approval Date",
          //   onChange: this.datePickerHandler,
          //   placeholder: "Enter Approval Date",
          //   maxDate: null//this.state.formData.endDate !== null ? this.state.formData.endDate : null
          //   disabled: !this.state.isORSP,
          //   readOnly: !this.state.isORSP,
          // }),


          InputFieldText({
            id: "sponsor",
            name: "sponsor",
            label: "Sponsor or Funding Entity",
            disabled: !this.state.isORSP,
            readOnly: !this.state.isORSP,
            value: this.state.formData.sponsor,
            onChange: this.textHandler,
            error: false,
            errorMessage: "Invalid."
          }),
          InputFieldText({
            id: "initialReviewType",
            name: "initialReviewType",
            label: "Type of Initial Review",
            disabled: !this.state.isORSP,
            readOnly: !this.state.isORSP,
            value: this.state.formData.initialReviewType,
            onChange: this.textHandler,
            error: false,
            errorMessage: "Invalid."
          }),
          InputFieldRadio({
            id: "bioMedical",
            name: "bioMedical",
            label: "Biomedical or Non-Biomedical",
            // moreInfo: span({ className: "italic" }, ["(PLEASE NOTE THAT ALL SAMPLES ARRIVING FROM THE DANA FARBER CANCER INSTITUTE NOW REQUIRE AN MTA)*"]),
            value: this.state.formData.bioMedical,
            onChange: this.radioBtnHandler,
            optionValues: ["biomedical", "nonBiomedical"],
            optionLabels: [
              "Biomedical.",
              "Non-Biomedical."
            ],
            disabled: !this.state.isORSP,
            readOnly: !this.state.isORSP,
            required: false,
            error: false,
            errorMessage: "Required field",
            edit: false
          })
        ]),
        div({ className: "buttonContainer", style: { 'margin': '20px 0 40px 0' } }, [
          button({
            className: "btn buttonPrimary floatRight",
            onClick: this.submit,
            disabled: !this.state.isORSP,
            isRendered: this.state.isORSP
          }, ["Submit"])
        ])
      ])
    )
  }
}
export default AdminOnly;
