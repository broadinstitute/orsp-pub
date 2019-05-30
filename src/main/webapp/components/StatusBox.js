import { Component, React } from 'react';
import { hh, h1, span, div, p} from 'react-hyperscript-helpers';
import './QuestionnaireWorkflow.css';
import { isEmpty } from "../util/Utils";

export const StatusBox = hh(class StatusBox extends Component {

  render() {
    const { type = '',
      projectKey = '',
      summary = '',
      approvalStatus = '',
      status= ''
    } = this.props.info;

    const { actor= '',
      projectReviewApproved= ''
    } = isEmpty(this.props.status) ? this.props.info : this.props.status;

    return(
      div({className: "headerBox"}, [
        p({className: "issue-type"}, [type]),
        h1({className: "projectTitle"}, [
          span({className: "projectKey"}, [projectKey+": " ]),
          span({className: "italic"}, [summary])
        ]),
        p({className: "headerLabel"}, [
          "Status: ",
          span({className: "block"}, [status])
        ]),

        p({className: "headerLabel"}, [
          "Awaiting action from: ",
          span({className: "block"}, [actor[0]])
        ]),
        p({className: "headerBoxStatus"}, [
          span({className: "bold"}, ["New Status: "]),
          span({className: "italic"}, [approvalStatus])
        ]),
        p({className: "headerBoxStatus"}, [
          span({className: "bold"}, ["Information Sub-Status: "]),
          span({className: "italic"}, [projectReviewApproved ? 'Approved' : 'Pending'])
        ]),
        p({className: "headerBoxStatus"}, [
          span({className: "bold"}, ["Documents Sub-Status: "]),
          span({className: "italic"}, ["SomeStatus"])
        ])
      ])
    );
  }
});