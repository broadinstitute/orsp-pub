import { Component } from 'react';
import { Wizard } from '../components/Wizard';
import { NewProjectGeneralData } from './NewProjectGeneralData';
import { NewProjectDetermination } from './NewProjectDetermination';
import { NewProjectDocuments } from './NewProjectDocuments';

class NewProject extends Component {

  constructor(props) {
    super(props);
    this.state = {
      currentStep: 0
    }
  }

  componentDidCatch(error, info) {
    console.log('----------------------- error ----------------------')
    console.log(error, info);
  }

  submitNewProject = () => {

  }

  stepChanged = (newStep) => {
    console.log(newStep);
    this.setState({
      currentStep: newStep
    });
  }

  render() {

    const { currentStep } = this.state;

    return (
      Wizard({ title: "New Project", style: { "margin": "5px 5px 15px 5px", "padding": "5px 5px 15px 5px" }, stepChanged: this.stepChanged }, [
        NewProjectGeneralData({ title:"1. General Data", currentStep: currentStep }),
        NewProjectDetermination({ title: "2. Determination Questions", currentStep: currentStep }),
        NewProjectDocuments({ title:"3. Documents", currentStep: currentStep, projectType: 'IRB' }),
      ])
    );
  }
}

export default NewProject;