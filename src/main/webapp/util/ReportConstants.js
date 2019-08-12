export const FUNDING_SORT_NAME_INDEX = {
  'type': 0,
  'projectKey': 1,
  'summary': 2,
  'status': 3,
  'protocol': 4, // Not implemented
  'pis': 5, // Not implemented
  'source': 6,
  'name': 7,
  'awardNumber': 8
};

export const CATEGORY_SORT_NAME_INDEX = {
  "projectKey": 0,
  "summary": 1,
  "status": 2
};

export const RESTRICTION_SORT_NAME_INDEX = {
  "consentGroupKey": 0,
  "vaultExportDate": 1
};

export const styles = {
  fundingReport: { 
    issueTypeWidth: '96px',
    projectKeyWidth: '109px',
    titleWidth: '280px',
    statusWidth: '98px',
    pisWidth: '80px',
    protocolWidth: '94px',
    fundingNameWidth: '124px',
    generalWidth: '136px'
  },
  reviewCategories: { 
    projectKeyWidth: '120px',
    summaryWidth: '600px',
    statusWidth: '180px',
    reviewCategoryWidth: '180'
  },
  consentCollection: { 
    consentKeyWidth: '140px',
    collectionsWidth: '750px'
  }
}
