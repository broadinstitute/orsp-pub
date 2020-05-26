import _ from 'lodash';
import { DETERMINATION } from "../util/TypeDescription";
import { b, span, i } from 'react-hyperscript-helpers';

export const initQuestions = () => {
  let questions = [];   
  questions.push({
    isYesNo: true,
    question: 'Is this a “fee for service” project? ',
    moreInfo: '(Commercial service only, no direct federal funding, no data analysis, no data storage, no dbGaP deposition by Broad.)',
    progress: 0,
    yesOutput: DETERMINATION.NE,
    noOutput: 2,
    answer: null,
    key: 'feeForService',
    id: 1
  });

  questions.push({
    isYesNo: true,
    question: 'Is a Broad scientist(s) conducting research (generating or contributing to generalizable knowledge, with the intention to publish results)? ',
    moreInfo: span({style: { 'display': 'block' }}, ['Examples of projects that ', b(['DO NOT ']), 'contribute to generalizable knowledge include small case studies and internal technology development/validation projects. ']),
    progress: 12,
    yesOutput: 3,
    noOutput: DETERMINATION.NHSR,
    answer: null,
    key: 'broadInvestigator',
    id: 2
  });
  questions.push({
    isYesNo: true,
    question: 'Does this project  involve only specimens or data from deceased individuals?',
    progress: 25,
    yesOutput: DETERMINATION.NHSR,
    noOutput: 4,
    answer: null,
    key: 'subjectsDeceased',
    id: 3
  });   
  questions.push({
    isRadio: true,
    moreInfo: '',
    question: span(['Will specimens or data be provided ', i({style: { 'color': '#0A3356' }}, ['without ']), 'identifiable information? ']),
    progress: 37,
    value: 'sensitiveInformationSource',
    answer: null,
    key: 'sensitiveInformationSource',
    optionLabels: [
          span(['Yes']), 
          span(['No']), 
          span(['N/A (for example research with direct interaction with participants) '])
        ],
    optionValues: ['true', 'false', 'na'],
    outputs: [{key: 'true', value: 5}, {key: 'false', value: 7}, {key: 'na', value: 7}],
    id: 4
  });

  questions.push({
    isYesNo: true,
    question: 'Does the sample provider have access to identifiers?',
    progress: 46,
    yesOutput: 6,
    noOutput: DETERMINATION.NHSR,
    answer: null,
    key: 'isIdReceive',
    id: 5
  });

  questions.push({
    isYesNo: true,
    question: 'Will the Broad investigator be co-publishing or jointly analyzing data with the sample provider?',
    progress: 57,
    yesOutput: 7,
    noOutput: DETERMINATION.NHSR,
    answer: null,
    key: 'isCoPublishing',
    id: 6
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
    outputs: [{key: 'irbReviewedProtocol', value: DETERMINATION.IRB}, {key: 'sensitiveInformationSource', value: 8}, {key: 'secondaryResearch', value: 9}, {key: 'privateInformation', value: DETERMINATION.NE}],
    id: 7
  });

  questions.push({
    isYesNo: true,
    question: " ",
    moreInfo: span([
                span({style: { 'display': 'block' }}, ["Is this a project that only includes interactions involving surveys or interview procedures (including visual or auditory recording) ", b(["IF AT LEAST ONE OF THE FOLLOWING IS TRUE:"])]),
                span({style: { 'display': 'block' }}, ["(i) The information is recorded in such a manner that the identity of the subjects cannot readily be ascertained;"]), 
                span({style: { 'display': 'block' }}, [b(["OR"])]), 
                span({style: { 'display': 'block' }}, ["(ii) Any disclosure of the responses outside the research would not reasonably place the subjects at risk of criminal or civil liability or be damaging to the subjects' financial standing, employability, educational advancement, or reputation "])
              ]),
    progress: 78,
    yesOutput: DETERMINATION.EX,
    noOutput: 9,
    answer: null,
    key: 'humanSubjects',
    id: 8
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
    id: 9
  });

  return questions
};

export const getProjectType = (projectType) => {
  let type = '';
  if (projectType === DETERMINATION.NE) {
    type = 'NE';
  }
  else if (projectType === DETERMINATION.NHSR) {
    type = 'NHSR';
  }
  else if (projectType === DETERMINATION.IRB) {
    type = 'IRB';
  }
  else if (projectType === DETERMINATION.EX) {
    type = 'EX';
  }
  return type;
}
