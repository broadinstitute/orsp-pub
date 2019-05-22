import React from 'react';
import ReactDOM from 'react-dom';
import ConsentGroupDocuments from './ConsentGroupDocuments';
import ErrorHandler from '../components/ErrorHandler';

ReactDOM.render(
  <ErrorHandler>
    <ConsentGroupDocuments
      attachmentsUrl={consentGroupDocumentsComponent.attachmentsUrl}
      serverURL={consentGroupDocumentsComponent.serverURL}
      userUrl={consentGroupDocumentsComponent.userUrl}
      attachDocumentsUrl={consentGroupDocumentsComponent.attachDocumentsUrl}
      projectKey={consentGroupDocumentsComponent.projectKey}
      approveDocumentUrl={consentGroupDocumentsComponent.approveDocumentUrl}
      rejectDocumentUrl={consentGroupDocumentsComponent.rejectDocumentUrl}
      sessionUserUrl={consentGroupDocumentsComponent.sessionUserUrl}
      downloadDocumentUrl={consentGroupDocumentsComponent.downloadDocumentUrl}
      emailDulUrl={consentGroupDocumentsComponent.emailDulUrl}
      loadingImage={consentGroupDocumentsComponent.loadingImage}
      useRestrictionUrl={consentGroupDocumentsComponent.useRestrictionUrl}
      createRestrictionUrl={consentGroupDocumentsComponent.createRestrictionUrl}
      removeDocumentUrl={consentGroupDocumentsComponent.removeDocumentUrl}
    />
  </ErrorHandler>,
  document.getElementById('consentGroupDocuments')
);
