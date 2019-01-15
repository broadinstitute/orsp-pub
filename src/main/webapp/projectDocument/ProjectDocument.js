import { Component } from 'react';
import { Documents } from '../components/Documents'
import { DocumentHandler } from "../util/ajax";
import { ProjectKeyDocuments } from '../util/KeyDocuments';

 class ProjectDocument extends Component {

   constructor(props) {
    super(props);
    this.state = {
      documentsCollection: [],
      keyDocuments:  [],
      additional: []
    };
  }

   componentDidMount() {
    this.getAttachedDocuments();
  }

   getAttachedDocuments = () => {
    DocumentHandler.attachedDocuments(this.props.attachedDocumentsUrl, this.props.projectKey).then(resp => {
      this.setKeyDocuments(JSON.parse(resp.data.documents))
    }).catch(error => {
      console.error(error);
    });
  };

   setKeyDocuments = (documentsCollection) => {
    const keyDocuments = [];
    const additionalDocuments = [];
    documentsCollection.forEach(documentData => {
      if (ProjectKeyDocuments.lastIndexOf(documentData.fileType) !== -1) {
        keyDocuments.push(documentData);
      } else {
        additionalDocuments.push(documentData);
      }
    });
    this.setState({
      keyDocuments: keyDocuments,
      additionalDocuments: additionalDocuments
    })
  };

   render() {
    return (
      Documents({
        keyDocuments: this.state.keyDocuments,
        additionalDocuments: this.state.additionalDocuments
      })
    )}

 }
export default ProjectDocument
