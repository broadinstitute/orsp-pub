import { Component } from 'react';
import { h, hh, p, div, h2, span, a, button } from 'react-hyperscript-helpers';
import { User } from "../util/ajax";
import { Panel } from "../components/Panel";
import { InputFieldText } from "../components/InputFieldText";
import { InputFieldDatePicker } from "../components/InputFieldDatePicker";
import { InputFieldRadio } from "../components/InputFieldRadio";
import { isEmpty } from "../util/Utils";

class AdminOnly extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isAdmin: false
    }
  }

  componentDidMount() {
    // this.isCurrentUserAdmin();
  }

  isCurrentUserAdmin() {
    // User.isCurrentUserAdmin(this.props.isAdminUrl).then(
    //   resp => {
    //     this.setState({ isAdmin: resp.data.isAdmin });
    //   }
    // );
  }

  render() {
    return(
      div({},[
        h2({ className: "stepTitle" }, ["Only Admin "]),
        Panel({ title: "Investigator Details" }, [
          InputFieldText({
            id: "preferredIrb",
            name: "preferredIrb",
            label: "Preferred IRB",
            disabled: false,//!this.state.readOnly,
            value: '',//consent + " / " + protocol,
            onChange: () => {},
            readOnly: false,
            error: false,
            errorMessage: "Invalid."
          }),
          InputFieldText({
            id: "investigatorFirstName",
            name: "investigatorFirstName",
            label: "Investigator First Name",
            disabled: false,//!this.state.readOnly,
            value: '',//consent + " / " + protocol,
            onChange: () => {},
            readOnly: false,
            error: false,
            errorMessage: "Invalid."
          }),
          InputFieldText({
            id: "investigatorLastName",
            name: "investigatorLastName",
            label: "Investigator Last Name",
            disabled: false,//!this.state.readOnly,
            value: '',//consent + " / " + protocol,
            onChange: () => {},
            readOnly: false,
            error: false,
            errorMessage: "Invalid."
          }),
          InputFieldText({
            id: "degrees",
            name: "degrees",
            label: "Investigator degree(s)",
            disabled: false,//!this.state.readOnly,
            value: '',//consent + " / " + protocol,
            onChange: () => {},
            readOnly: false,
            error: false,
            errorMessage: "Invalid."
          })
        ]),
        Panel({ title: "Project Details" }, [
          InputFieldText({
            id: "trackingNumber",
            name: "trackingNumber",
            label: "Protocol #",
            disabled: false,//!this.state.readOnly,
            value: '',//consent + " / " + protocol,
            onChange: () => {},
            readOnly: false,
            error: false,
            errorMessage: "Invalid."
          }),
          InputFieldText({
            id: "orspNumber",
            name: "orspNumber",
            label: "ORSP Number",
            disabled: false,//!this.state.readOnly,
            value: '',//consent + " / " + protocol,
            onChange: () => {},
            readOnly: false,
            error: false,
            errorMessage: "Invalid."
          }),
          InputFieldText({
            id: "title",
            name: "title",
            label: "Title",
            disabled: false,//!this.state.readOnly,
            value: '',//consent + " / " + protocol,
            onChange: () => {},
            readOnly: false,
            error: false,
            errorMessage: "Invalid."
          }),
          InputFieldDatePicker({
            selected: null,//this.state.formData.startDate,
            name: "initialDate",
            label: "Initial Approval Date",
            onChange: () => {},//this.handleChange,
            placeholder: "Enter Approval Date",
            maxDate: null//this.state.formData.endDate !== null ? this.state.formData.endDate : null
          }),
          InputFieldText({
            id: "sponsor",
            name: "sponsor",
            label: "Sponsor or Funding Entity",
            disabled: false,//!this.state.readOnly,
            value: '',//consent + " / " + protocol,
            onChange: () => {},
            readOnly: false,
            error: false,
            errorMessage: "Invalid."
          }),
          InputFieldText({
            id: "initialReviewType",
            name: "initialReviewType",
            label: "Type of Initial Review",
            disabled: false,//!this.state.readOnly,
            value: '',//consent + " / " + protocol,
            onChange: () => {},
            readOnly: false,
            error: false,
            errorMessage: "Invalid."
          }),
          InputFieldRadio({
            id: "bioMedical",
            name: "bioMedical",
            label: "Biomedical or Non-Biomedical",
            // moreInfo: span({ className: "italic" }, ["(PLEASE NOTE THAT ALL SAMPLES ARRIVING FROM THE DANA FARBER CANCER INSTITUTE NOW REQUIRE AN MTA)*"]),
            value: null,// this.state.formData.requireMta,
            onChange: () => {},//this.handleRadio2Change,
            optionValues: ["biomedical", "nonBiomedical"],
            optionLabels: [
              "Biomedical.",
              "Non-Biomedical."
            ],
            required: false,
            error: false,
            errorMessage: "Required field",
            edit: false
          })
        ]),
        button({
          className: "btn buttonPrimary floatRight",
          onClick: () => {},//this.submitEdit(),
          disabled: false ,
          isRendered: true
        }, ["Submit"])
      ])
    )
  }
}
export default AdminOnly;
