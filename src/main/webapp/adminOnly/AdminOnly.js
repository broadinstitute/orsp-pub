import { Component } from 'react';
import { button, div, h2, hh, p, span, ul, li, small } from 'react-hyperscript-helpers';
import { Project, Search } from '../util/ajax';
import { Panel } from '../components/Panel';
import { InputFieldText } from '../components/InputFieldText';
import { InputFieldDatePicker } from '../components/InputFieldDatePicker';
import { InputFieldCheckbox } from '../components/InputFieldCheckbox';
import { InputFieldRadio } from '../components/InputFieldRadio';
import { InputFieldTextArea } from '../components/InputFieldTextArea';
import { compareNotEmptyObjects, createObjectCopy, isEmpty, scrollToTop } from '../util/Utils';
import { format } from 'date-fns';
import 'regenerator-runtime/runtime';
import { InputFieldSelect } from '../components/InputFieldSelect';
import { INITIAL_REVIEW, PREFERRED_IRB } from '../util/TypeDescription';
import { InputTextList } from '../components/InputTextList';
import { Fundings } from '../components/Fundings';
import { AlertMessage } from '../components/AlertMessage';
import LoadingWrapper from '../components/LoadingWrapper';
import get from 'lodash/get';
import moment from 'moment';
import html2canvas from 'html2canvas';
import jsPDF from "jspdf";
import { disableBodyScroll, enableBodyScroll } from 'body-scroll-lock';

const IRB = 'IRB Project';

const AdminOnly = hh(class AdminOnly extends Component {

  _isMounted = false;

  constructor(props) {
    super(props);
    this.state = {
      orspAdmins: [],
      showSubmissionAlert: false,
      showSubmissionError: false,
      textOtherCategoryError: false,
      textOtherNotEngagedCategoryError: false,
      textCategoryTwoError: false,
      textCategoryFourError: false,
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
        projectStatus: '',
        textOtherCategory: 'vasd',
        categoryTwo: false,
        categoryFour: false,
        exemptCategoryFourI: false,
        exemptCategoryFourII: false,
        exemptCategoryFourIII: false,
        exemptCategoryFourIV: false,
        exemptCategoryTwoI: false,
        exemptCategoryTwoII: false,
        exemptCategoryTwoIII: false,
        notEngagedCategories: '',
        textOtherNotEngagedCategory: '',
        otherCategory: false,
        assignedReviewer: '',
        adminComments: ''
      }
    };
    this.addNewDegree = this.addNewDegree.bind(this)
  }

  componentDidMount() {
    this._isMounted = true;
    this.loadORSPAdmins();
    this.init();
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
      formData.projectType = get(issue.data, 'issue.type', '');
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
      formData.categoryTwo = issue.data.extraProperties.categoryTwo  === 'true' ? true : false;
      formData.categoryFour = issue.data.extraProperties.categoryFour === 'true' ? true : false;
      formData.otherCategory = issue.data.extraProperties.otherCategory === 'true' ? true : false;
      formData.textOtherCategory = issue.data.extraProperties.textOtherCategory;
      formData.exemptCategoryFourI = issue.data.extraProperties.exemptCategoryFourI  === 'true' ? true : false;
      formData.exemptCategoryFourII = issue.data.extraProperties.exemptCategoryFourII  === 'true' ? true : false;
      formData.exemptCategoryFourIII = issue.data.extraProperties.exemptCategoryFourIII  === 'true' ? true : false;
      formData.exemptCategoryFourIV = issue.data.extraProperties.exemptCategoryFourIV  === 'true' ? true : false;
      formData.exemptCategoryTwoI = issue.data.extraProperties.exemptCategoryTwoI  === 'true' ? true : false;
      formData.exemptCategoryTwoII = issue.data.extraProperties.exemptCategoryTwoII  === 'true' ? true : false;
      formData.exemptCategoryTwoIII = issue.data.extraProperties.exemptCategoryTwoIII  === 'true' ? true : false;
      formData.notEngagedCategories = issue.data.extraProperties.notEngagedCategories;
      formData.textOtherNotEngagedCategory = issue.data.extraProperties.textOtherNotEngagedCategory;
      formData.assignedReviewer = isEmpty(issue.data.extraProperties.assignedAdmin) ? '' : JSON.parse(issue.data.extraProperties.assignedAdmin);
      formData.adminComments = issue.data.extraProperties.adminComments;
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
    if (date != null) {
      return moment(date).format('YYYY/MM/DD')
    }
  };

  textHandler = (e) => {
    const field = e.target.name;
    const value = e.target.value;
    this.setState(prev => {
      prev.formData[field] = value;
      return prev;
    }, () => {
      if (field === 'textOtherCategory') {
        this.isValid();
      }
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
    if (this.isValid()) {
      Project.updateAdminOnlyProps(parsedForm , this.props.projectKey).then(
        response => {
          this.props.hideSpinner();
          this.setState(prev => {
            prev.initial = createObjectCopy(this.state.formData);
            prev.showSubmissionError = false;
            return prev;
          });
          this.props.updateAdminOnlyStatus({ projectStatus : this.state.initial.projectStatus });
          this.successNotification('showSubmissionAlert', 'Project information has been successfully updated.', 8000);
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
    } else {
      this.props.hideSpinner();
    }
  };

  isValid() {
    let isValidExempt = true;
    let isValidCategoryTwo = true;
    let isValidNotEngaged = true;
    let isValidCategoryFour = true;

    if (this.state.formData.initialReviewType.value === 'Exempt') {
      if (this.state.formData.otherCategory && isEmpty(this.state.formData.textOtherCategory)) {
        this.setState(prev => {
          prev.textOtherCategoryError = true;
          return prev;
        });
        isValidExempt = false;
     } else {
       this.setState(prev => {
         prev.textOtherCategoryError = false;
         return prev;
       });
       isValidExempt = true;
     }
 
     if (this.state.formData.categoryTwo && !this.state.formData.exemptCategoryTwoI
       && !this.state.formData.exemptCategoryTwoII && !this.state.formData.exemptCategoryTwoIII) {
       this.setState(prev => {
         prev.textCategoryTwoError = true;
         return prev;
       });
       isValidCategoryTwo = false;
     } else {
       this.setState(prev => {
         prev.textCategoryTwoError = false;
         return prev;
       });
       isValidCategoryTwo = true;
     }
 
    if (this.state.formData.categoryFour && !this.state.formData.exemptCategoryFourI
     && !this.state.formData.exemptCategoryFourII && !this.state.formData.exemptCategoryFourIII
     && !this.state.formData.exemptCategoryFourIV) {
       this.setState(prev => {
         prev.textCategoryFourError = true;
         return prev;
       });
       isValidCategoryFour = false;
     } else {
       this.setState(prev => {
         prev.textCategoryFourError = false;
         return prev;
       });
       isValidCategoryFour = true;
     }
    } else if (this.state.formData.initialReviewType.value === 'Not Engaged') {
      if (this.state.formData.notEngagedCategories === 'other' && isEmpty(this.state.formData.textOtherNotEngagedCategory)) {
        this.setState(prev => {
          prev.textOtherNotEngagedCategoryError = true;
          return prev;
        });
        isValidNotEngaged = false;
     } else {
       this.setState(prev => {
         prev.textOtherNotEngagedCategoryError = false;
         return prev;
       });
       isValidNotEngaged = true;
     }
    }   

    return isValidExempt && isValidNotEngaged && isValidCategoryTwo && isValidCategoryFour;
  }

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
    form.assignedAdmin = JSON.stringify(this.state.formData.assignedReviewer);
    form.adminComments = this.state.formData.adminComments;

    if (this.state.formData.initialReviewType.value === 'Exempt') {
      form.categoryTwo = this.state.formData.categoryTwo;
      form.categoryFour = this.state.formData.categoryFour;
      form.otherCategory = this.state.formData.otherCategory;
      form.textOtherCategory = this.state.formData.textOtherCategory;
      form.exemptCategoryFourI = this.state.formData.exemptCategoryFourI;
      form.exemptCategoryFourII = this.state.formData.exemptCategoryFourII;
      form.exemptCategoryFourIII = this.state.formData.exemptCategoryFourIII;
      form.exemptCategoryFourIV = this.state.formData.exemptCategoryFourIV;
      form.exemptCategoryTwoI = this.state.formData.exemptCategoryTwoI;
      form.exemptCategoryTwoII = this.state.formData.exemptCategoryTwoII;
      form.exemptCategoryTwoIII = this.state.formData.exemptCategoryTwoIII;
    } else if (this.state.formData.initialReviewType.value === 'Not Engaged') {
      form.notEngagedCategories = this.state.formData.notEngagedCategories;
      form.textOtherNotEngagedCategory = this.state.formData.textOtherNotEngagedCategory;
    }
    
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

  handleChange = (e) => {
    const value = e.target.checked;
    const field = e.target.name;
    this.setState(prev => {
      if (field === 'otherCategory' && !value) {
        prev.formData.textOtherCategory = '';
      }
      prev.formData[field] = value;
      return prev;
    }, () => {
      this.isValid();
    });
  };

  exportPdf = (e) => () => {

    this.props.showSpinner();
    const main = document.getElementById('main');
    disableBodyScroll(main);

    const headerBox = document.getElementById('headerBox');
    const projectDetails1 = document.getElementById('projectDetails1');
    const projectDetails2 = document.getElementById('projectDetails2');

    let totalHeight = 0;
    scrollToTop();

        html2canvas(headerBox)
        .then((canvas) => {  
          var doc = new jsPDF();
          doc = this.canvasToPdf(canvas, doc, totalHeight);
          totalHeight += this.canvasHeight(canvas, doc);
          return doc;
        })
          .then((doc) => {
            html2canvas(projectDetails1).then((canvas) => {
              doc = this.canvasToPdf(canvas, doc, totalHeight);
              if ((totalHeight + canvas.height * this.canvasRatio(canvas, doc)) > doc.internal.pageSize.getHeight() ) {
                totalHeight = 0;
              }
              totalHeight += this.canvasHeight(canvas, doc);
              return doc;
            })
                  .then((doc) => {
                    html2canvas(projectDetails2).then((canvas) => {
                      
                      doc = this.canvasToPdf(canvas, doc, totalHeight);
                      doc.save(`${this.props.projectKey} Determination.pdf`);
                      this.props.hideSpinner();
                      enableBodyScroll(main);
                    }).catch(error => {
                      this.props.hideSpinner();
                      enableBodyScroll(main);
                    })
                  }).catch(error => {
                    this.props.hideSpinner();
                    enableBodyScroll(main);
                  })
        });

  };

  canvasToPdf(canvas, doc, totalHeight ) {
    const imgData = canvas.toDataURL('image/png');

    var pageHeight = doc.internal.pageSize.getHeight() - 2;
    let ratio = this.canvasRatio(canvas, doc);

    if (canvas.height > 0) {
      if ((totalHeight + (canvas.height * ratio)) > pageHeight ) {
        doc.addPage();
        doc.addImage(imgData, "PNG", 2, 2, canvas.width * ratio, canvas.height * ratio);
      } else {
        doc.addImage(imgData, "PNG", 2, totalHeight + 2, canvas.width * ratio, canvas.height * ratio);
      }
    }

    return doc;
  };

  canvasHeight(canvas, doc ) {
    return canvas.height * this.canvasRatio(canvas, doc) + 2;
  };

  canvasRatio(canvas, doc ) {
    return (doc.internal.pageSize.getWidth() - 4) / canvas.width;
  };

  loadORSPAdmins() {
    Search.getORSPAdmins().then(response => {
      let orspAdmins = response.data.map(function (item) {
        return {
          key: item.id,
          value: item.value,
          label: item.label
        };
      })
      this.setState(prev => {
        prev.orspAdmins = orspAdmins;
        return prev;
      })
    });
  }

  render() {
    return(
      div({},[
        h2({ className: "stepTitle" }, ["Admin Only"]),
        button({
          className: "btn buttonPrimary floatRight",
          style: { 'marginTop': '15px' },
          onClick: this.exportPdf(),
          isRendered: !component.isViewer 
        }, ["Print PDF"]),
        div({ id: "projectDetails1" }, [
          Panel({ title: "Project Details" }, [
            InputFieldSelect({
              label: "Assigned reviewer:",
              id: "assignedAdmin",
              name: "assignedAdmin",
              options: this.state.orspAdmins,
              value: this.state.formData.assignedReviewer,
              onChange: this.handleSelect("assignedReviewer"),
              placeholder: "Select...",
              readOnly: !this.state.isAdmin,
              edit: false
            }),
            InputFieldTextArea({
              label: "Admin notes",
              id: "inputAdminComments",
              name: "adminComments",
              value: this.state.formData.adminComments,
              readOnly: !this.state.isAdmin,
              required: true,
              onChange: this.textHandler,
            }),
            InputFieldRadio({
              id: "radioProjectStatus",
              name: "projectStatus",
              label: "Project Status",
              value: this.state.formData.projectStatus,
              optionValues: ['Approved', 'Disapproved', 'Withdrawn', 'Closed', 'Abandoned', 'On Hold'],
              optionLabels: [
                "Approved",
                "Disapproved",
                "Withdrawn",
                "Closed",
                "Abandoned",
                "On Hold"
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
          ]),
        ]),
        div({ id: "projectDetails2" }, [
          Panel({ title: "Project Details (continued)" }, [
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
            div({ isRendered: this.state.formData.initialReviewType.value === 'Exempt', style: { 'marginTop': '20px' } }, [
              p({ className: "inputFieldLabel" }, [
                "Exempt Categories. ",
                span({ className: "normal" }, ["Select all that apply."])
              ]),
              InputFieldCheckbox({
                id: "ckb_category_two",
                name: "categoryTwo",
                onChange: this.handleChange,
                label: span({ className: "bold" }, ["Category 2", span({ className: "normal italic" }, [" (Research that only includes interactions involving educational tests (cognitive, diagnostic, aptitude, achievement), survey procedures, interview procedures, or observation of public behavior (including visual or auditory recording) if at least one of the following criteria is met:)"])]),
                checked: this.state.formData.categoryTwo,
                readOnly: this.state.readOnly
              }),
              div({ style: { 'marginLeft': '20px' } }, [
                small({ isRendered: this.state.textCategoryTwoError, className: "errorMessage" }, ['At least one selected option is required']),
                InputFieldCheckbox({
                  isRendered: this.state.formData.categoryTwo === true,
                  id: "ckb_categoryTwo_i",
                  name: "exemptCategoryTwoI",
                  onChange: this.handleChange,
                  label: span({ className: "normal" }, ['(i) The information obtained is recorded by the investigator in such a manner that the identity of the human subjects cannot readily be ascertained, directly or through identifiers linked to the subjects.']),
                  checked: this.state.formData.exemptCategoryTwoI,
                  readOnly: this.state.readOnly
                }),
                InputFieldCheckbox({
                  isRendered: this.state.formData.categoryTwo === true,
                  id: "ckb_categoryTwo_iI",
                  name: "exemptCategoryTwoII",
                  onChange: this.handleChange,
                  label: span({ className: "normal" }, ['(ii) Any disclosure of the human subjects responses outside the research would not reasonably place the subjects at risk of criminal or civil liability or be damaging to the subjects financial standing, employability, educational advancement, or reputation.']),
                  checked: this.state.formData.exemptCategoryTwoII,
                  readOnly: this.state.readOnly
                }),
                InputFieldCheckbox({
                  isRendered: this.state.formData.categoryTwo === true,
                  id: "ckb_categoryTwo_iii",
                  name: "exemptCategoryTwoIII",
                  onChange: this.handleChange,
                  label: span({ className: "normal" }, ['(iii) The information obtained is recorded by the investigator in such a manner that the identity of the human subjects can readily be ascertained, directly or through identifiers linked to the subjects, and an IRB conducts a limited IRB review to make the determination required by §46.111(a)(7)']),
                  checked: this.state.formData.exemptCategoryTwoIII,
                  readOnly: this.state.readOnly
                })
              ]),
              InputFieldCheckbox({
                id: "ckb_categoryFour",
                name: "categoryFour",
                onChange: this.handleChange,
                label: span({ className: "bold" }, ["Category 4", span({ className: "normal italic" }, [" (Secondary research for which consent is not required: Secondary research uses of identifiable private information or identifiable biospecimens, if at least one of the following criteria is met:)"])]),
                checked: this.state.formData.categoryFour,
                readOnly: this.state.readOnly
              }),
              div({ style: { 'marginLeft': '20px', isRendered: this.state.formData.categoryFour === true } }, [
                small({ isRendered: this.state.textCategoryFourError, className: "errorMessage" }, ['At least one selected option is required']),
                InputFieldCheckbox({
                  isRendered: this.state.formData.categoryFour === true,
                  id: "ckb_categoryFour_i",
                  name: "exemptCategoryFourI",
                  onChange: this.handleChange,
                  label: span({ className: "normal" }, ['(i) The identifiable private information or identifiable biospecimens are publicly available.']),
                  checked: this.state.formData.exemptCategoryFourI,
                  readOnly: this.state.readOnly
                }),
                InputFieldCheckbox({
                  isRendered: this.state.formData.categoryFour === true,
                  id: "ckb_categoryFour_ii",
                  name: "exemptCategoryFourII",
                  onChange: this.handleChange,
                  label: span({ className: "normal" }, ['(ii) Information, which may include information about biospecimens, is recorded by the investigator in such a manner that the identity of the human subjects cannot readily be ascertained directly or through identifiers linked to the subjects, the investigator does not contact the subjects, and the investigator will not re-identify subjects.']),
                  checked: this.state.formData.exemptCategoryFourII,
                  readOnly: this.state.readOnly
                }),
                InputFieldCheckbox({
                  isRendered: this.state.formData.categoryFour === true,
                  id: "ckb_categoryFour_iii",
                  name: "exemptCategoryFourIII",
                  onChange: this.handleChange,
                  label: span({ className: "normal" }, ["(iii) The research involves only information collection and analysis involving the investigator's use of identifiable health information when that use is regulated under 45 CFR parts 160 and 164, subparts A and E, for the purposes of “health care operations” or “research” as those terms are defined at 45 CFR 164.501 or for “public health activities and purposes” as described under 45 CFR 164.512(b)."]),
                  checked: this.state.formData.exemptCategoryFourIII,
                  readOnly: this.state.readOnly
                }),
                InputFieldCheckbox({
                  isRendered: this.state.formData.categoryFour === true,
                  id: "ckb_categoryFour_iv",
                  name: "exemptCategoryFourIV",
                  onChange: this.handleChange,
                  label: span({ className: "normal" }, ["(iv) The research is conducted by, or on behalf of, a Federal department or agency using government-generated or government-collected information obtained for nonresearch activities, if the research generates identifiable private information that is or will be maintained on information technology that is subject to and in compliance with section 208(b) of the E-Government Act of 2002, 44 U.S.C. 3501 note, if all of the identifiable private information collected, used, or generated as part of the activity will be maintained in systems of records subject to the Privacy Act of 1974, 5 U.S.C. 552a, and, if applicable, the information used in the research was collected subject to the Paperwork Reduction Act of 1995, 44 U.S.C. 3501 et seq."]),
                  checked: this.state.formData.exemptCategoryFourIV,
                  readOnly: this.state.readOnly
                })
              ]),
              InputFieldCheckbox({
                id: "ckb_other_category",
                name: "otherCategory",
                onChange: this.handleChange,
                label: span({ className: "bold" }, ['Other']),
                checked: this.state.formData.otherCategory,
                readOnly: this.state.readOnly
              }),

              div({ style: { 'marginBottom': '20px' } }, [
                InputFieldText({
                  isRendered: this.state.formData.otherCategory === true,
                  id: "inputTextOtherCategory",
                  name: "textOtherCategory",
                  label: " Please describe “other”:",
                  value: this.state.formData.textOtherCategory,
                  disabled: false,
                  required: true,
                  onChange: this.textHandler,
                  error: this.state.textOtherCategoryError,
                  errorMessage: "Required field"
                })
              ])
            ]),

            div({ isRendered: this.state.formData.initialReviewType.value === 'Not Engaged', style: { 'marginTop': '20px' } }, [
              p({ className: "inputFieldLabel" }, [
                "Not Engaged Categories. ",
                span({ className: "normal" }, ["Select one."])
              ]),
              InputFieldRadio({
                id: "radioNotEngaged",
                name: "notEngagedCategories",
                value: this.state.formData.notEngagedCategories,
                optionValues: ['b1', 'b7', 'other'],
                optionLabels: [
                  span({ className: "bold" }, ["Fee-for-Service (B1) ", span({ className: "normal italic" }, [
                    p({}, ["Institutions whose employees or agents perform commercial or other services for investigators provided that all of the following conditions also are met:"]),
                    ul({}, [
                    li({}, ["The services performed do not merit professional recognition or publication privileges;"]),
                    li({}, ["The services performed are typically performed by those institutions for non-research purposes; and"]),
                    li({}, ["The institution’s employees or agents do not administer any study intervention being tested or evaluated under the protocol."])
                  ])]) ]),
                  span({ className: "bold" }, ["Not Engaged (B7) ", span({ className: "normal italic" }, [
                    p({}, ["Institutions whose employees or agents:"]),
                    ul({}, [
                      li({}, ["Obtain coded private information or human biological specimens from another institution involved in the research that retains a link to individually identifying information (such as name or social security number); and"]),
                      li({}, ["Are unable to readily ascertain the identity of the subjects to whom the coded information or specimens pertain because, for example:",
                      ul({}, [
                        li({}, ["the institution’s employees or agents and the holder of the key enter into an agreement prohibiting the release of the key to the those employees or agents under any circumstances;"]),
                        li({}, ["the releasing institution has IRB-approved written policies and operating procedures applicable to the research project that prohibit the release of the key to the institution’s employees or agents under any circumstances; or"]),
                        li({}, ["there are other legal requirements prohibiting the release of the key to the institution’s employees or agents"])
                      ])
                      ])
                    ])
                  ])]),
                  span({ className: "bold" }, ["Other "]),
                ],
                onChange: this.radioBtnHandler,
                readOnly: !this.state.isAdmin
              }),

              div({ style: { 'marginBottom': '20px' } }, [
                InputFieldText({
                  isRendered: this.state.formData.notEngagedCategories === 'other',
                  id: "inputTextOtherNotEngagedCategory",
                  name: "textOtherNotEngagedCategory",
                  label: " Please describe “other”:",
                  value: this.state.formData.textOtherNotEngagedCategory,
                  disabled: false,
                  required: true,
                  onChange: this.textHandler,
                  error: this.state.textOtherNotEngagedCategoryError,
                  errorMessage: "Required field"
                })
              ])
              
            ]),

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
              isRendered: this.state.formData.projectType === IRB,
              selected: this.state.formData.irbExpirationDate,
              value: isEmpty(this.state.formData.irbExpirationDate) ? format(new Date(this.state.formData.irbExpirationDate), 'MM/DD/YYYY') : null,
              name: "irbExpirationDate",
              label: "Expiration Date",
              onChange: this.datePickerHandler,
              placeholder: "Enter date...",
              readOnly: !this.state.isAdmin,
            })

          ]),
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
