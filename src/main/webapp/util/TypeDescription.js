export const DETERMINATION = {
  NE : 200,
  NHSR : 300,
  IRB : 400,
  EXIT : 500,
  DPA : 600,
  RA : 700,
  CTC : 800,
  OSAP : 900,
  EX : 1000
};

export const PREFERRED_IRB = [
  { label: 'Partners Health Care', value: 'healthCare' },
  { label: 'MIT', value: 'mit' },
  { label: 'Dana-Farber Cancer Institute', value: 'danaFarberCancerInst' },
  { label: 'Beth Israel Deaconess', value: 'bethIsraelDeaconess' },
  { label: 'Boston Children\'s Hospital', value: 'bostonChildrenHosp' },
  { label: 'Forsyth Institute', value: 'forsythInstitute' },
  { label: 'Harvard Medical School (and Dental Medicine)', value: 'harvardMedicalSchool' },
  { label: 'Harvard School of Public Health', value: 'harvardSchoolPublicHealth' },
  { label: 'Harvard Faculty of Arts & Sciences', value: 'harvardFacultyArtsAndSciences' },
  { label: 'Joslin Diabetes Center', value: 'joslinDiabetesCenter' },
  { label: 'Mass General Brigham', value: 'massGeneralBrigham' },
  { label: 'Other', value: 'other' }
];

export const PI_AFFILIATION = [
  { label: 'Broad', value: 'broad' },
  { label: 'Partners', value: 'partners' },
  { label: 'DFCI', value: 'dfci' },
  { label: 'MIT', value: 'mit' },
  { label: 'Children\'s Hospital', value: 'childrenHosp' },
  { label: 'Harvard', value: 'harvard' },
  { label: 'Other (specify below)', value: 'other' }
];

export const INITIAL_REVIEW = [
  { label: 'Expedited', value: 'Expedited'},
  { label: 'Exempt', value: 'Exempt'},
  { label: 'Full Board', value: 'Full Board'},
  { label: 'Not Human Subjects Research', value: 'Not Human Subjects Research'},
  { label: 'Not Engaged', value: 'Not Engaged'}
];
