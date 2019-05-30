import { Component, Fragment} from 'react';
import { h, div, h2, label, span, a } from 'react-hyperscript-helpers';
import { StatusBox } from "../components/StatusBox";
import { ProjectContainer } from "../projectContainer/ProjectContainer";
import { isEmpty } from "../util/Utils";
import get from 'lodash/get';
import { ProjectDocument } from "../projectDocument/ProjectDocument";
import AdminOnly from "../adminOnly/AdminOnly";


class Main extends Component {
  constructor(props) {
    super(props);
    this.state = {
      status: {},
      info: {}
    };
  }

  initStatusBoxInfo = (elementInfo) => {
    let info = {
      type : get(elementInfo,'issue.type', ''),
      projectKey: get(elementInfo,'issue.projectKey', ''),
      summary: get(elementInfo,'issue.summary', ''),
      approvalStatus: get(elementInfo,'issue.approvalStatus', ''),
      status: get(elementInfo,'issue.status', ''),
      actor: get(elementInfo,'extraProperties.actor', ''),
      projectReviewApproved: get(elementInfo,'extraProperties.projectReviewApproved', '')
    };

    this.setState(prev => {
      prev.info = info;
      return prev;
    });
  };

  statusBoxHandler = (issue) => {
    let status = {
      summary: get(issue,'summary', ''),
      projectReviewApproved: get(issue,'projectReviewApproved', ''),
    };
    if (!isEmpty(issue.approvalStatus)) {
      status.approvalStatus = issue.approvalStatus
    }
    if (!isEmpty(issue.status)) {
      status.status = issue.status
    }

    this.setState(prev => {
      prev.status = issue;
      return prev;
    });
  };

  render () {
    return (
      div({},[
        StatusBox({
          info: this.state.info,
          status: this.state.status
        }),
        ProjectContainer({
          searchUsersURL : component.searchUsersURL, // searchUsersURL = "/dev/search/getMatchingUsers"
          projectKey : component.projectKey,
          projectUrl : component.projectUrl, //         projectUrl: "${createLink(controller: 'project', action: 'getProject')}",
          isAdmin : component.isAdmin,
          isViewer : component.isViewer,
          serverURL : component.serverURL,
          rejectProjectUrl : component.rejectProjectUrl,
          updateProjectUrl : component.updateProjectUrl,
          discardReviewUrl : component.discardReviewUrl,
          clarificationUrl : component.clarificationUrl,
          loadingImage : component.loadingImage,
          saveExtraPropUrl: component.saveExtraPropUrl,
          initStatusBoxInfo: this.initStatusBoxInfo,
          statusBoxHandler: this.statusBoxHandler,

          // projectKey: component.projectKey,
          attachedDocumentsUrl: component.attachedDocumentsUrl, //"${createLink(uri: '/api/files-helper/attached-documents', method: 'GET')}",
          attachDocumentsUrl: component.attachDocumentsUrl,//"${createLink(uri: '/api/files-helper/attach-document', method: 'POST')}",
          rejectDocumentUrl:component.rejectDocumentUrl,// "${createLink(uri: '/api/files-helper/reject-document', 'PUT')}",
          approveDocumentUrl:component.approveDocumentUrl,// "${createLink(uri: '/api/files-helper/approve-document', method: 'PUT')}",
          downloadDocumentUrl: component.downloadDocumentUrl,//"${createLink(controller: 'authenticated', action: 'downloadDocument')}",
          sessionUserUrl: component.sessionUserUrl,//"${createLink(controller: 'authenticated', action: 'getSessionUser')}",
          // loadingImage: component.loadingImage,//"${resource(dir: 'images', file: 'loading-indicator.svg')}",
          removeDocumentUrl: component.removeDocumentUrl,//"${createLink(uri: '/api/files-helper/delete', 'DELETE')}"
        }),
        //Import and implement these two
        // ProjectDocument({
        //   projectKey: component.projectKey,
        //   attachedDocumentsUrl: component.attachedDocumentsUrl, //"${createLink(uri: '/api/files-helper/attached-documents', method: 'GET')}",
        //   attachDocumentsUrl: component.attachDocumentsUrl,//"${createLink(uri: '/api/files-helper/attach-document', method: 'POST')}",
        //   rejectDocumentUrl:component.rejectDocumentUrl,// "${createLink(uri: '/api/files-helper/reject-document', 'PUT')}",
        //   approveDocumentUrl:component.approveDocumentUrl,// "${createLink(uri: '/api/files-helper/approve-document', method: 'PUT')}",
        //   downloadDocumentUrl: component.downloadDocumentUrl,//"${createLink(controller: 'authenticated', action: 'downloadDocument')}",
        //   sessionUserUrl: component.sessionUserUrl,//"${createLink(controller: 'authenticated', action: 'getSessionUser')}",
        //   loadingImage: component.loadingImage,//"${resource(dir: 'images', file: 'loading-indicator.svg')}",
        //   removeDocumentUrl: component.removeDocumentUrl,//"${createLink(uri: '/api/files-helper/delete', 'DELETE')}"
        // })
        // AdminOnly()
      ])
    );
  }
}

export default Main;
