import { Component } from 'react';
import { Wizard } from '../components/Wizard';
import { NewProjectGeneralData } from './NewProjectGeneralData';
import { NewProjectDetermination } from './NewProjectDetermination';
import { NewProjectDocuments } from './NewProjectDocuments';

class NewProject extends Component {


  componentDidCatch(error, info) {
    console.log('----------------------- error ----------------------')
    console.log(error, info);
  }

  submitNewProject = () => {

  }

  render() {

    return (
      Wizard({ title: "New Project", style: {"margin":"5px 5px 15px 5px", "padding":"5px 5px 15px 5px"}}, [
        NewProjectGeneralData(),
        NewProjectDetermination(),
        NewProjectDocuments({projectType: 'NE'}),
      ])
    );
  }
}

export default NewProject;