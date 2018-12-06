import { Component } from 'react';
import { hh } from 'react-hyperscript-helpers';
import { WizardStep } from '../components/WizardStep';
import { QuestionnaireWorkflow } from '../components/QuestionnaireWorkflow';
import { QuestionnaireStep } from '../components/QuestionnaireStep';

export const NewProjectDetermination = hh(class NewProjectDetermination extends Component {

  state = {};
  
  componentDidCatch(error, info) {
    console.log('----------------------- error ----------------------')
    console.log(error, info);
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true }
  }
  
  render() {

    if (this.state.hasError) {
      // You can render any custom fallback UI
      return <h1>Something went wrong.</h1>;
    }

    const qs1 = new QuestionnaireStep({
      question: "Question Nbr. 1",

    }, ["yex", "no"]);

    const qs2 = new QuestionnaireStep({
      question: "Question Nbr. 2",

    }, ["True","False","N/A"]);

    const qs3 = new QuestionnaireStep({
      question: "Question Nbr. 3",

    }, ["Yes","No", "Other"]);

    return (
      WizardStep({ title: this.props.title, step:1, currentStep: this.props.currentStep }, [

        QuestionnaireWorkflow({}, [
          qs1,
          qs2,
          qs3
        ])
      ])
    )
  }
});

// export default NewProjectDetermination;