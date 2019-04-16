import { Component } from 'react';
import { h, hh, p, div, h2, span, a, button } from 'react-hyperscript-helpers';
import { Project, User } from "../util/ajax";
import { Panel } from "../components/Panel";
import { InputFieldText } from "../components/InputFieldText";
import { InputFieldDatePicker } from "../components/InputFieldDatePicker";
import { InputFieldRadio } from "../components/InputFieldRadio";
import { isEmpty } from "../util/Utils";
import { format } from 'date-fns';
import "regenerator-runtime/runtime";
import { InputFieldSelect } from "../components/InputFieldSelect";
import { PREFERRED_IRB } from "../util/TypeDescription";
import { InputTextList } from "../components/InputTextList";
import { Fundings } from "../components/Fundings";

class AdminOnly extends Component {
  constructor(props) {
    super(props);
    this.state = {
      key: 0,
      isORSP: false,
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
        projectStatus: ''
      }
    };
    this.addNewDegree = this.addNewDegree.bind(this)
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
        const investigatorFirstName = '';//issue.data.extraProperties.investigatorFirstName;
        const investigatorLastName = ''; //issue.data.extraProperties.investigatorLastName;
        const degrees = ['']; //issue.data.extraProperties.degrees;
        const preferredIrb = isEmpty(issue.data.extraProperties.irbReferral) ? '' : JSON.parse(issue.data.extraProperties.irbReferral);
        const preferredIrbText = issue.data.extraProperties.preferredIrbText;
        const trackingNumber = issue.data.extraProperties.protocol;
        const projectTitle = issue.data.extraProperties.projectTitle;
        const initialDate = null; //issue.data.extraProperties.initialDate;
        const sponsor = this.getSponsorArray(issue.data.fundings); //issue.data.extraProperties.sponsor;
        const initialReviewType = ''; //issue.data.extraProperties.initialReviewType;
        const bioMedical = ''; //issue.data.extraProperties.bioMedical;
        const projectStatus = '';
        console.log(issue.data);
        this.setState(prev => {
          prev.formData.projectKey = projectKey;
          prev.formData.preferredIrb = preferredIrb;
          prev.formData.preferredIrbText = preferredIrbText;
          prev.formData.trackingNumber = trackingNumber;
          prev.formData.projectTitle = projectTitle;
          prev.formData.investigatorFirstName = investigatorFirstName;
          prev.formData.investigatorLastName = investigatorLastName;
          prev.formData.degrees = degrees;
          prev.formData.initialDate = initialDate;
          prev.formData.sponsor = sponsor;
          prev.formData.initialReviewType = initialReviewType;
          prev.formData.bioMedical = bioMedical;
          prev.formData.projectStatus = projectStatus;
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

  handleSelect = (field) => () => (selectedOption) => {
    this.setState(prev => {
      prev.formData[field] = selectedOption;
      return prev;
    })
  };

  submit = () => {
  // si cambió los valores correspondientes a un proyecto, acutalizarlos (esperar respuestas de preguntas en story)
  // mapear la totalidad como extra property de su issue correspondiente

  };

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
            optionValues: ['approved', 'disapproved', 'withdrawn', 'closed', 'abandoned'],
            optionLabels: [
              "Approved",
              "Disapproved",
              "Withdrawn",
              "Closed",
              "Abandoned"
            ],
            onChange: this.radioBtnHandler,
            readOnly: !this.state.isORSP
          }),
          InputFieldSelect({
            label: "IRB",
            id: "preferredIrb",
            name: "preferredIrb",
            options: PREFERRED_IRB,
            value: this.state.formData.preferredIrb,
            onChange: this.handleSelect("preferredIrb"),
            readOnly: !this.state.isORSP,
            placeholder: isEmpty(this.state.formData.preferredIrb) && this.state.readOnly ? "--" : "Select...",
            edit: false
          }),
          InputFieldText({
            id: "preferredIrbText",
            name: "preferredIrbText",
            label: "Please specify IRB",
            readOnly: !this.state.isORSP,
            isRendered: this.state.formData.preferredIrb.value === "other",
            value: this.state.formData.investigatorFirstName,
            onChange: this.textHandler,
          }),
          InputFieldText({
            id: "investigatorFirstName",
            name: "investigatorFirstName",
            label: "First Name of Investigator",
            readOnly: !this.state.isORSP,
            value: this.state.formData.investigatorFirstName,
            onChange: this.textHandler,
          }),
          InputFieldText({
            id: "investigatorLastName",
            name: "investigatorLastName",
            label: "Last Name of Investigator",
            readOnly: !this.state.isORSP,
            value: this.state.formData.investigatorLastName,
            onChange: this.textHandler,
          }),
          InputTextList({
            id: "degrees",
            name: "degrees",
            label: "Degree(s) of Investigator",
            degrees: this.state.formData.degrees,
            textHandler: this.degreesHandler,
            add: this.addNewDegree,
            removeDegree: this.removeDegree,
            isReadOnly: !this.state.isORSP
          }),
          InputFieldText({
            id: "trackingNumber",
            name: "trackingNumber",
            label: "Tracking Number",
            readOnly: !this.state.isORSP,
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
            readOnly: !this.state.isORSP,
            value: this.state.formData.projectTitle,
            onChange: this.textHandler,
          }),
          InputFieldDatePicker({
            selected: this.state.formData.initialDate,
            value: this.state.formData.initialDate !== null ? format(new Date(this.state.formData.initialDate), 'MM/DD/YYYY') : null,
            name: "initialDate",
            label: "Initial Approval Date",
            onChange: this.datePickerHandler,
            placeholder: "Enter date...",
            readOnly: !this.state.isORSP,
          }),
          div({ style: { 'marginTop': '15px' }}, [
            Fundings({
              fundings: this.state.formData.sponsor,
              current: this.state.formData.sponsor,
              readOnly: true,
              edit: false
            })
          ]),
          InputFieldText({
            id: "initialReviewType",
            name: "initialReviewType",
            label: "Type of Initial Review",
            readOnly: !this.state.isORSP,
            value: this.state.formData.initialReviewType,
            onChange: this.textHandler,
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
            readOnly: !this.state.isORSP,
            required: false,
            edit: false
          })
        ]),
        div({ className: "buttonContainer", style: { 'margin': '20px 0 40px 0' } }, [
          button({
            className: "btn buttonPrimary floatRight",
            onClick: this.submit,
            isRendered: this.state.isORSP
          }, ["Submit"])
        ])
      ])
    )
  }
}
export default AdminOnly;
