import { Component } from 'react';
import { button, div, h, hh, p, a, br } from 'react-hyperscript-helpers';
import { WizardStep } from '../components/WizardStep';
import { InputFieldSelect } from '../components/InputFieldSelect';
import { InputFieldCheckbox } from '../components/InputFieldCheckbox';
import { InputFieldDatePicker } from '../components/InputFieldDatePicker';
import { Panel } from '../components/Panel';
import AddDocumentDialog from '../components/AddDocumentDialog';
import { Table } from '../components/Table';
import { CONSENT_DOCUMENTS } from '../util/DocumentType';
import { ConsentGroup, SampleCollections, User } from '../util/ajax';

const styles = {
  addDocumentContainer: {
    display: 'block', height: '50px', margin: '5px 0 15px 0'
  },
  addDocumentBtn: {
    position: 'relative', float: 'right'
  }
};
const headers =
  [
    { name: 'Document Type', value: 'fileKey' },
    { name: 'File Name', value: 'fileName' },
    { name: '', value: 'remove' }
  ];

export const SelectSampleConsent = hh(class SelectSampleConsent extends Component {

  state = {};
  _isMounted = false;

  constructor(props) {
    super(props);
    this.state = {
      showAddDocuments: false,
      documentOptions: [],
      documents: [],
      sampleCollectionList: [],
      sampleCollection: null,
      consentGroupsList: {},
      collectionSample: {},
      consentGroup: {},
      sampleCollectionIsLoading: false,
      consentGroupIsLoading: false,
      startDate: null,
      endDate: null,
      onGoingProcess: false,
      dropEvent: null,
      viewDocDetails: []
    };
  }

  componentDidMount() {
    this._isMounted = true;
    this.loadOptions();
    this.getConsentGroups();
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  fileHandler = (docs) => {
    this.setState({
      files: docs
    });
  };

  handleSampleCollectionChange = () => (data) => {
    if (this._isMounted) {
      this.setState(prev => {
        prev.sampleCollection = data;
        return prev;
      }, () => this.props.updateForm(this.state.sampleCollection, "sampleCollection"));
      this.props.removeErrorMessage();
    }
  };

  handleConsentGroupChange = (values) => (data) => {
    this.getAllSampleCollections(data.key);
    this.setState(prev => {
      prev.consentGroup = data;
      return prev;
    }, () => this.props.updateForm(this.state.consentGroup, "consentGroup"));
    this.props.removeErrorMessage();
  };

  closeModal = () => {
    this.setState({
      showAddDocuments: !this.state.showAddDocuments,
      dropEvent: null
    });
  };

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true }
  }

  setFilesToUpload = async (doc) => {
    let name, createdDate;
    await User.getUserSession().then(user => {
      name = user.data.displayName;
      createdDate = new Date().toISOString().substring(0,10);
    })
    let viewDocDetail = {};
    let document = { fileKey: doc.fileKey, file: doc.file, fileName: doc.file.name, id: Math.random(), fileDescription: doc.fileDescription };
    viewDocDetail['fileType'] = doc.fileKey;
      viewDocDetail['file'] = doc.file;
      viewDocDetail['fileName'] = doc.file.name;
      viewDocDetail['fileDescription'] = doc.fileDescription;
      viewDocDetail['displayName'] = name;
      viewDocDetail['createdDate'] = createdDate;
      viewDocDetail['id'] = document.id;
    this.setState(prev => {
      let documents = prev.documents;
      documents.push(document);
      prev.documents = documents;
      let viewDocDetails = prev.viewDocDetails;
      viewDocDetails.push(viewDocDetail);
      prev.viewDocDetails = viewDocDetails;
      return prev;
    }, () => {
      this.props.fileHandler(this.state.documents);
      this.closeModal();
    });
  };

  removeFile = (row) => {
    const documentsToUpdate = this.state.documents.filter(doc => doc.id !== row.id);
    this.setState(prev => {
      prev.documents = documentsToUpdate;
      return prev;
    }, () => this.props.fileHandler(this.state.documents));
  };

  addDocuments = () => {
    this.setState({
      showAddDocuments: !this.state.showAddDocuments
    });
  };

  loadOptions() {
    const documentOptions = CONSENT_DOCUMENTS.map(type => {
      return { value: type, label: type };
    });
    if (this._isMounted) {
      this.setState({ documentOptions: documentOptions });
    }
  };

  getConsentGroups = () => {
    this.setState({ consentGroupIsLoading: true });
    ConsentGroup.getConsentGroupNames().then(result => {
      if (this._isMounted) {
        const existingConsentGroups = result.data.map(item => {
          return {
            key: item.id,
            value: item.label,
            label: item.label
          }
        });

        this.setState({
          existingConsentGroups: existingConsentGroups,
          consentGroupIsLoading: false,
          consentGroup: existingConsentGroups[0]
        }, () => this.props.updateForm(this.state.consentGroup, "consentGroup"));
        this.getAllSampleCollections(existingConsentGroups[0].key);
      }
    }).catch(() => {});
  };

  getAllSampleCollections = (consentKey) => {
    if (this._isMounted) {
      this.setState({ sampleCollectionIsLoading: true });
    }

    SampleCollections.getCollectionsCGLinked(consentKey).then(
      resp => {
        const label = "Sample Collections Linked to ";
        const sampleCollectionList = this.setOptionsValues(resp.data, consentKey, label);

        if (this._isMounted) {
          this.setState({
            sampleCollectionList: sampleCollectionList,
            sampleCollectionIsLoading: false
          })
        }
      }).catch(() => {});

    SampleCollections.getSampleCollections(consentKey).then(
      resp => {

        const label = "Link New Sample Collections to Sample Data/Cohort: ";
        const sampleCollectionList = this.setOptionsValues(resp.data, consentKey, label);

        if (this._isMounted) {
          this.setState({
            sampleCollectionList: sampleCollectionList,
            sampleCollectionIsLoading: false
          });
        }
      }).catch(() => {});
  };

  setOptionsValues = (items, consentKey, label) => {
    let sampleCollectionList = [];
    let index = 0;

    if (this.state.sampleCollectionList.length === 1) {
      index = 1;
      sampleCollectionList = this.state.sampleCollectionList.splice(0);
    }

    sampleCollectionList.push({label: label + consentKey, options: []});

    sampleCollectionList[index].options = items.map(item => {
      return {
        key: item.id,
        value: item.collectionId,
        label: item.collectionId + ": " + item.name + " ( " + item.category + " )",
      };
    });

    return sampleCollectionList;
  };

  handleCheck = () => {
    this.setState(prev => {
      prev.onGoingProcess = !this.state.onGoingProcess;
      prev.endDate = null;
      return prev;
    }, () => this.props.updateDateRange(this.state.onGoingProcess, this.state.endDate, this.state.startDate));
  };

  handleChange = (id) => (date) => {
    this.setState(prev => {
      prev[id] = date;
      return prev;
    }, () =>
        this.props.updateForm(this.state.sampleCollection, id) 
    );
  };

  handleDateChange = (id) => (date) => {
    this.setState(prev => {
      prev[id] = date;
      return prev;
    }, () =>
        this.props.updateDateRange(this.state.onGoingProcess, this.state.endDate, this.state.startDate)
    );
  };

  dropHandler = (event) => {
    event.preventDefault();
    let file
    if (event.dataTransfer.items) {
        [...event.dataTransfer.items].forEach((item, i) => {
            if (item.kind === 'file') {
                file = item.getAsFile();
            }
        })
    }
    this.setState(prev => {
      prev.dropEvent = file
    }, () => {
      this.addDocuments();
    })
  }

  dragOverHandler(event) {
    event.preventDefault();
  }

  render() {
    let documents = this.props.files;

    return (
      WizardStep({
        title: this.props.title,
        step: 0,
        currentStep: this.props.currentStep,
        error: this.props.errors.collectionSample || this.props.errors.consentGroup,
        errorMessage: 'Please complete all required fields'
      }, [
        Panel({
          title: "Sample/Data Cohort",
        }, [
          InputFieldSelect({
            id: "consentGroup_select",
            label: "Select Sample/Data Cohort",
            isDisabled: false,
            options: this.state.existingConsentGroups,
            onChange: this.handleConsentGroupChange,
            value: this.state.consentGroup,
            placeholder: "Select...",
            error: this.props.errors.consentGroup,
            errorMessage: "Please select a Sample/Data Cohort",
            isMulti: false,
            edit: false,
            isLoading: this.state.consentGroupIsLoading,
            readOnly: false
          }),
        ]),
        Panel({
          title: "Sample Collection",
        }, [
          InputFieldSelect({
            id: "sampleCollection_select",
            label: "Link Sample Collection to " + this.props.projectKey,
            isDisabled: false,
            options: this.state.sampleCollectionList,
            onChange: this.handleSampleCollectionChange,
            value: this.state.sampleCollection,
            placeholder: "Choose a Sample Collection ...",
            isMulti: false,
            edit: false,
            isLoading: this.state.sampleCollectionIsLoading,
            readOnly: false
          }),
        ]),
        Panel({ title: "Sample Collection Date Range*" }, [
          div({ className: "row" }, [
            div({ className: "col-lg-4 col-md-4 col-sm-4 col-12" }, [
              InputFieldDatePicker({
                selected: this.state.startDate,
                name: "startDate",
                label: "Start Date",
                onChange: this.handleDateChange,
                placeholder: "Enter Start Date",
                maxDate: this.state.endDate !== null ? this.state.endDate : null,
                error: this.props.errors.errorSampleCollectionDateRange && this.props.generalError,
                errorMessage: 'Required Fields'
              })
            ]),
            div({ className: "col-lg-4 col-md-4 col-sm-4 col-12" }, [
              InputFieldDatePicker({
                startDate: this.state.startDate,
                name: "endDate",
                label: "End Date",
                selected: this.state.endDate,
                onChange: this.handleDateChange,
                placeholder: "Enter End Date",
                disabled: (this.state.onGoingProcess === true) || (this.state.startDate === null),
                minDate: this.state.startDate
              })
            ]),
            div({ className: "col-lg-4 col-md-4 col-sm-4 col-12 col-padding checkbox" }, [
              InputFieldCheckbox({
                id: "onGoingProcess",
                name: "onGoingProcess",
                onChange: this.handleCheck,
                label: "Ongoing Process",
                checked: this.state.onGoingProcess
              })
            ])
          ])
        ]),
        Panel({
          title: "Documents"
        }, [
          div({ className: "questionnaireContainerLight" }, [
            p({ className: "col-12"},["Please upload any documents related to your specific sample or data cohort, for example: consent forms, assent forms, waivers of consent, attestations, data use letters, and Institutional Certifications."]),
            h(AddDocumentDialog, {
              isRendered: this.state.showAddDocuments,
              closeModal: this.closeModal,
              show: this.state.showAddDocuments,
              options: this.state.documentOptions,
              attachDocumentsUrl: this.props.attachDocumentsUrl,
              user: this.props.user,
              handleLoadDocuments: this.props.handleLoadDocuments,
              serverURL: this.props.serverURL,
              emailUrl: this.props.emailUrl,
              userName: this.props.userName,
              documentHandler: this.setFilesToUpload,
              dropEvent: this.state.dropEvent
            }),
            div({ style: styles.addDocumentContainer }, [
              div({
                isRendered: !component.isViewer,
                id: 'drop_zone',
                onDrop: this.dropHandler,
                onDragOver: this.dragOverHandler,
                style: {padding: '10px 0 10px 0', textAlign: 'center', border: '1px solid #ddd', width: '100%'}
              }, [
                p(['Drag and drop your documents here or ', a({onClick:() => {this.addDocuments()}}, ['click here to add documents'])])
              ]),
            ]),br(),
            Table({
              headers: headers,
              data: documents,
              sizePerPage: 10,
              paginationSize: 10,
              handleDialogConfirm: this.props.handleDialogConfirm,
              remove: this.removeFile,
              reviewFlow: false,
              pagination: false
            }),
          ])
        ])
      ])
    );
  }
});
