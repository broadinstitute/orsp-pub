import { Component } from 'react';
import { Wizard } from '../components/Wizard';
import { NewProjectGeneralData } from './NewProjectGeneralData';
import { NewProjectDetermination } from './NewProjectDetermination';
import { NewProjectDocuments } from './NewProjectDocuments';

class NewProject extends Component {

  constructor(props) {
    super(props);
    this.state = {
      determination: {
        projectType: 'IRB'
      },
      currentStep: 0,
      files: []
    }
  }

  submitNewProject = () => {

  }

  stepChanged = (newStep) => {
    console.log(newStep);
    this.setState({
      currentStep: newStep
    });
  }

  determinationHandler = (determination) => {
    this.setState({
      determination: determination
    }, () => {
      console.log("project determination ", determination);
    });
  }

  componentDidCatch(error, info) {
    console.log('----------------------- error ----------------------')
    console.log(error, info);
  }

  fileHandler =  (file) => {
    if (file.fileData !== undefined && file.fileData) {
      let result = this.state.files.filter(element => element.fileKey !== file.fileKey);
      result.push(file);
      this.setState(prev => {
        prev.files = result;
        return prev
      });
    }
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true }
  }

  render() {

    const { currentStep, determination } = this.state;

    let projectType = determination.projectType;

    return (
      Wizard({ title: "New Project", style: { "margin": "5px 5px 15px 5px", "padding": "5px 5px 15px 5px" }, stepChanged: this.stepChanged }, [
        NewProjectGeneralData({ title: "1. General Data", currentStep: currentStep }),
        NewProjectDetermination({ title: "2. Determination Questions", currentStep: currentStep, handler: this.determinationHandler }),
        NewProjectDocuments({ title:"3. Documents", currentStep: currentStep, fileHandler: this.fileHandler, projectType: projectType }),
      ])
    );
  }
}

export default NewProject;