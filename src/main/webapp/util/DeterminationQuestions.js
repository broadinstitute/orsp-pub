import _ from 'lodash';
import { DETERMINATION } from "../util/TypeDescription";
import { b, span, i } from 'react-hyperscript-helpers';

export const initQuestions = () => {
  let questions = [];   

  questions.push({
    isYesNo: true,
    question: 'Is a Broad scientist(s) conducting research (generating or contributing to generalizable knowledge, with the intention to publish results)? ',
    moreInfo: span({style: { 'display': 'block' }}, ['Examples of projects that ', b(['DO NOT ']), 'contribute to generalizable knowledge include small case studies and internal technology development/validation projects. ']),
    progress: 0,
    yesOutput: 2,
    noOutput: DETERMINATION.NHSR,
    answer: null,
    key: 'broadInvestigator',
    id: 1
  });
  questions.push({
    isRadio: true,
    moreInfo: '',
    question: 'Does this project  involve only specimens or data from deceased individuals?',
    progress: 20,
    value: 'subjectsDeceased',
    answer: null,
    key: 'subjectsDeceased',
    optionLabels: [
          span(['Yes']), 
          span(['No/Unknown'])
        ],
    optionValues: ['true', 'false'],
    outputs: [{key: 'true', value: DETERMINATION.NHSR}, {key: 'false', value: 3}],
    id: 2
  });   
  questions.push({
    isRadio: true,
    moreInfo: '',
    question: span(['Will specimens or data be provided to the Broad ', i({style: { 'color': '#0A3356' }}, ['without ']), 'identifiable information?']),
    progress: 37,
    value: 'sensitiveInformationSource',
    answer: null,
    key: 'sensitiveInformationSource',
    optionLabels: [
          span(['Yes']), 
          span(['No'])
        ],
    optionValues: ['true', 'false'],
    outputs: [{key: 'true', value: 4}, {key: 'false', value: 6}],
    id: 3
  });

  questions.push({
    isYesNo: true,
    question: 'Does the sample or data provider have access to identifiers?',
    progress: 46,
    yesOutput: 5,
    noOutput: DETERMINATION.NHSR,
    answer: null,
    key: 'isIdReceive',
    id: 4
  });

  questions.push({
    isYesNo: true,
    question: 'Will anyone at the Broad be co-publishing or jointly analyzing data with the sample/data provider who has access to identifiable information about the original sample/data donor?',
    progress: 57,
    yesOutput: 6,
    noOutput: DETERMINATION.NHSR,
    answer: null,
    key: 'isCoPublishing',
    id: 5
  });

  questions.push({
    isRadio: true,
    question: 'Please select the option which best describes your research: ',
    progress: 67,
    value: 'irbReviewedProtocol',
    answer: null,
    key: 'irbReviewedProtocol',
    optionLabels: [
          span(['This is a project that will be/has been reviewed by an IRB, with Broad listed as a study site.']), 
          span(['This project will include an intervention/interaction with subjects, or identifiable information or identifiable private biospecimens will be used.']), 
          span(['This project is secondary research using data or biospecimens not collected specifically for this study.']),
          span(['This is not a secondary use study. The Broad scientist/team will obtain coded private information/biospecimens from another institution that retains a link to identifiers, ', b(['AND ']), ' be unable to readily ascertain the identity of subjects, ', b(['AND ']), 'will not receive a direct federal grant/award at Broad.'])
        ],
    optionValues: ['irbReviewedProtocol', 'sensitiveInformationSource', 'secondaryResearch', 'privateInformation'],
    outputs: [{key: 'irbReviewedProtocol', value: DETERMINATION.IRB}, {key: 'sensitiveInformationSource', value: 7}, {key: 'secondaryResearch', value: 8}, {key: 'privateInformation', value: DETERMINATION.NE}],
    id: 6
  });

  questions.push({
    isYesNo: true,
    question: " ",
    moreInfo: span([
                span({style: { 'display': 'block' }}, ["Is this a project that only includes interactions involving ", span({style: {fontWeight: 'bold', textDecoration: 'underline'}}, ["surveys or interview procedures"]), " (including visual or auditory recording) ", b(["IF AT LEAST ONE OF THE FOLLOWING IS TRUE:"])]),
                span({style: { 'display': 'block' }}, ["(i) The information is recorded in such a manner that the identity of the subjects cannot readily be ascertained;"]), 
                span({style: { 'display': 'block' }}, [b(["OR"])]), 
                span({style: { 'display': 'block' }}, ["(ii) Any disclosure of the responses outside the research would not reasonably place the subjects at risk of criminal or civil liability or be damaging to the subjects' financial standing, employability, educational advancement, or reputation "])
              ]),
    progress: 78,
    yesOutput: DETERMINATION.EX,
    noOutput: DETERMINATION.IRB,
    answer: null,
    key: 'humanSubjects',
    id: 7
  });

  questions.push({
    isYesNo: true,
    question: "Does the statement below accurately describe your project?",
    moreInfo: span({style: { 'display': 'block' }}, ["I or another member of the project team (including a collaborator, sample/data contributor, or co-investigator) have recorded study data (including data about biospecimens) in such a way that the identity of the subjects cannot be readily ascertained ",
                b(["directly or indirectly "]), "through identifiers linked to the subjects; ", b([" AND "]), "no one on the research team will attempt to contact or re-identify subjects."]),
    progress: 88,
    yesOutput: DETERMINATION.EX,
    noOutput: DETERMINATION.IRB,
    answer: null,
    key: 'interactionSource',
    id: 8
  });

  return questions
};

export const getProjectType = (projectType) => {
  switch (projectType) {
    case DETERMINATION.NE:
      return 'NE';
    case DETERMINATION.NHSR:
      return 'NHSR';
    case DETERMINATION.IRB:
      return 'IRB';
    case DETERMINATION.EX:
      return 'EX';
    default:
      return '';
  }
};
