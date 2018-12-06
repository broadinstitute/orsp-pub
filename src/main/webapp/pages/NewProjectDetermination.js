import { Component } from 'react';
import { hh } from 'react-hyperscript-helpers';
import { WizardStep } from '../components/WizardStep';
import { QuestionnaireWorkflow } from '../components/QuestionnaireWorkflow';
import { QuestionnaireStep } from '../components/QuestionnaireStep';

export const NewProjectDetermination = hh(class NewProjectDetermination extends Component {

  componentDidCatch(error, info) {
    console.log('----------------------- error ----------------------')
    console.log(error, info);
  }

  render() {

    const qs1 = new QuestionnaireStep({
      question: "Question Nbr. 1",

    }, []);

    const qs2 = new QuestionnaireStep({
      question: "Question Nbr. 2",

    }, []);

    const qs3 = new QuestionnaireStep({
      question: "Question Nbr. 3",

    }, []);
    
    return (
      WizardStep({ title: "2. Determination Questions" }, [

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