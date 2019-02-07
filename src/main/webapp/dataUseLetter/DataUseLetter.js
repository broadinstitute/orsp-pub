import { Component } from 'react';
import { Wizard } from '../components/Wizard';
import { hh, p, div, h1, h2, small, input, label, span, a, button } from 'react-hyperscript-helpers';

import { Panel } from '../components/Panel';
import { InputFieldText } from '../components/InputFieldText';
import { InputFieldRadio } from '../components/InputFieldRadio';
import { InputFieldSelect } from '../components/InputFieldSelect';
import { InputFieldDatePicker } from '../components/InputFieldDatePicker';
import { InputYesNo } from '../components/InputYesNo';
import { InputFieldCheckbox } from '../components/InputFieldCheckbox';
import { InputFieldTextArea } from '../components/InputFieldTextArea';

class DataUseLetter extends Component {

    constructor(props) {
        super(props);
        this.state = {
            readOnly: false,
            formData: {
                protocolTitle: '',
                protocolNumber: '',
                consentFormTitle: '',
                principalInvestigator: '',
                dataManagerName: '',
                dataManagerEmail: '',
                startDate: null,
                endDate: null,
                onGoingProcess: false,
                noRestrictions: false,
                generalUse: false,
                researchRestricted: false,
                diseaseRestricted: false,
                parasiticDisease: false,
                cancer: false,
                endocrineDisease: false,
                endocrineDiabetes: false,
                mentalDisorder: false,
                nervousDisease: false,
                eyeDisease: false,
                earDisease: false,
                digestiveDisease: false,
                inflammatoryDisease: false,
                diseaseRestricted: false,
                skinDisease: false,
                musculoskeletalDisease: false,
                genitourinaryDisease: false,
                pregnancy: false,
                congenitalMalformation: false,
                bloodDisorder: false,
                otherDisease: false,
                otherDiseaseSpecify: '',
                commercialPurposes: false,
                methodsResearch: false,
                noPopulationRestricted: false,
                under18: false,
                above18: false,
                onlyMen: false,
                onlyWomen: false,
                ethnic: false,
                ethnicSpecify: '',
                otherRestrictions: '',
            }
        };
    }

    componentDidMount() {
    }

    handleExtraPropsInputChange() {
    }

    handleChange() {
    }

    handleCheck = (e) => {
        const checked = e.target.checked;
        this.setState(prev => {
            prev.formData.noRestrictions = checked;
            return prev;
        });

    };

    handleInputChange() {
    }

    cancelDUL = (e) => () => {
    }

    submitDUL = (e) => () => {
    }

    render() {

        return (
            div({}, [
                h1({ className: "pageTitle" }, ["Data Use Limitation Record"]),
                div({ className: "pageContainer" }, [
                    div({ style: { 'marginBottom': '20px' } }, [
                        InputFieldText({
                            id: "inputProtocolTitle",
                            name: "protocolTitle",
                            label: "Title of Specimen Collection Protocol",
                            disabled: true,
                            value: "Some autopopulated value",
                            // currentValue: this.state.current.consentForm.summary,
                            onChange: this.handleExtraPropsInputChange,
                            readOnly: false
                        }),
                        InputFieldText({
                            id: "inputProtocolNumber",
                            name: "protocolNumber",
                            label: "Protocol Number",
                            disabled: true,
                            value: "Some autopopulated value",
                            // currentValue: this.state.current.consentForm.summary,
                            onChange: this.handleExtraPropsInputChange,
                            readOnly: false
                        }),
                        InputFieldText({
                            id: "inputConsentFormTitle",
                            name: "consentFormTitle",
                            label: "Consent Form Title",
                            disabled: true,
                            value: "Some autopopulated value",
                            // currentValue: this.state.current.consentForm.summary,
                            onChange: this.handleExtraPropsInputChange,
                            readOnly: false
                        }),
                        InputFieldText({
                            id: "inputPrincipalInvestigator",
                            name: "principalInvestigator",
                            label: "Principal Investigator Listed on Consent Form",
                            disabled: true,
                            value: "Some autopopulated value",
                            // currentValue: this.state.current.consentForm.summary,
                            onChange: this.handleExtraPropsInputChange,
                            readOnly: false
                        })
                    ]),

                    Panel({ title: "Data Manager ", moreInfo: "(individual decisions regarding data access and transfer)" }, [
                        div({ className: "row" }, [
                            div({ className: "col-lg-6 col-md-6 col-sm-12 col-12" }, [
                                InputFieldText({
                                    id: "inputDataManagerName",
                                    name: "dataManagerName",
                                    label: "Data Manager Name",
                                    disabled: true,
                                    value: "Some autopopulated value",
                                    // currentValue: this.state.current.consentForm.summary,
                                    onChange: this.handleExtraPropsInputChange,
                                    readOnly: false
                                })
                            ]),
                            div({ className: "col-lg-6 col-md-6 col-sm-12 col-12" }, [
                                InputFieldText({
                                    id: "inputDataManagerEmail",
                                    name: "dataManagerEmail",
                                    label: "Data Manager Email",
                                    disabled: true,
                                    value: "Some autopopulated value",
                                    // currentValue: this.state.current.consentForm.summary,
                                    onChange: this.handleExtraPropsInputChange,
                                    readOnly: false
                                })
                            ])
                        ])
                    ]),

                    Panel({ title: "Sample Collection Date Range" }, [
                        div({ className: "row" }, [
                            div({ className: "col-lg-4 col-md-4 col-sm-4 col-12" }, [
                                InputFieldDatePicker({
                                    selected: this.state.formData.startDate,
                                    name: "startDate",
                                    label: "Start Date",
                                    onChange: this.handleChange,
                                    placeholder: "Enter Start Date",
                                    maxDate: this.state.formData.endDate !== null ? this.state.formData.endDate : null
                                })
                            ]),
                            div({ className: "col-lg-4 col-md-4 col-sm-4 col-12" }, [
                                InputFieldDatePicker({
                                    startDate: this.state.formData.startDate,
                                    name: "endDate",
                                    label: "End Date",
                                    selected: this.state.formData.endDate,
                                    onChange: this.handleChange,
                                    placeholder: "Enter End Date",
                                    disabled: (this.state.formData.onGoingProcess === true) || (this.state.formData.startDate === null),
                                    minDate: this.state.formData.startDate
                                })
                            ]),
                            div({ className: "col-lg-4 col-md-4 col-sm-4 col-12 checkbox", style: { 'marginTop': '32px' } }, [
                                input({
                                    type: 'checkbox',
                                    id: "onGoingProcess",
                                    name: "onGoingProcess",
                                    onChange: this.handleCheck,
                                    defaultChecked: this.state.formData.onGoingProcess
                                }),
                                label({ id: "lbl_onGoingProcess", htmlFor: "onGoingProcess", className: "regular-checkbox" }, ["Ongoing Process"])
                            ])
                        ])
                    ]),

                    InputYesNo({
                        id: "radioRepositoryDeposition",
                        name: "repositoryDeposition",
                        value: this.state.formData.repositoryDeposition,
                        // currentValue: this.state.current.consentExtraProps.individualDataSourced,
                        label: "Data is intended for repository deposition?",
                        readOnly: this.state.readOnly,
                        onChange: this.handleExtraPropsInputChange,
                    }),

                    div({ className: "boxWrapper" }, [
                        p({}, ["Samples from the above referenced protocol have been or will be part of a genomic research collaboration with the Broad Institute."]),
                        p({}, ["In order to be responsible stewards of the genomic data that is generated, we are asking your IRB/Ethics Committee to identify appropriate use and sharing limitations based on a review of the consent form research participants signed when the samples were collected."]),
                        p({}, ["Identification of these data use limitations will ensure that future use is aligned with the commitments made to research subjects in the consent. The data use limitations may be used in one of two ways to identify use restrictions: 1) to facilitate data management, and/or 2) if appropriate, for data deposition into a controlled-access or open-access repository.  "]),
                        p({}, ["Please answer the following questions to describe data use limitations based on the consent form interpretation."])
                    ]),

                    h2({ className: "pageSubtitle" }, [
                        small({}, ["Section 1"]),
                        "Information required for data management"
                    ]),

                    console.log(this.state.formData.noRestrictions),
                    Panel({ title: "1. Primary Restrictions" }, [
                        InputFieldCheckbox({
                            id: "ckb_noRestrictions",
                            name: "noRestrictions",
                            onChange: this.handleCheck,
                            label: "No restrictions",
                            checked: this.state.formData.noRestrictions === 'true' || this.state.formData.noRestrictions === true,
                            readOnly: this.state.readOnly
                        }),
                        InputFieldCheckbox({
                            id: "ckb_generalUse",
                            name: "generalUse",
                            onChange: this.handleCheck,
                            label: span({}, ['General research use ', span({ className: 'normal italic' }, ['(Data can be used for any research purpose but would not be made available for non-research purposes. These data would generally be made available to any qualified investigator, irrespective of the specific research purpose for which the data are requested.)'])]),
                            checked: this.state.formData.generalUse === 'true' || this.state.formData.generalUse === true,
                            readOnly: this.state.readOnly
                        }),
                        InputFieldCheckbox({
                            id: "ckb_researchRestricted",
                            name: "researchRestricted",
                            onChange: this.handleCheck,
                            label: span({}, [span({ className: 'normal' }, ['Future use is ']), span({ className: 'bold' }, ['restricted to health/medical/biomedical research (any type)'])]),
                            checked: this.state.formData.researchRestricted === 'true' || this.state.formData.researchRestricted === true,
                            readOnly: this.state.readOnly
                        }),
                        InputFieldCheckbox({
                            id: "ckb_diseaseRestricted",
                            name: "diseaseRestricted",
                            onChange: this.handleCheck,
                            label: span({}, [span({ className: 'normal' }, ['Future research is ']), span({ className: 'bold' }, ['restricted to (a) specific disease(s): ']), span({ className: 'normal italic' }, ['(Please note that checking any of these boxes precludes all future research outside of the indicated disease.)'])]),
                            checked: this.state.formData.diseaseRestricted === 'true' || this.state.formData.diseaseRestricted === true,
                            readOnly: this.state.readOnly
                        }),

                        div({ isRendered: true, className: "row subGroup" }, [
                            div({ className: "col-lg-6 col-md-6 col-sm-12 col-12" }, [
                                InputFieldCheckbox({
                                    id: "ckb_parasiticDisease",
                                    name: "parasiticDisease",
                                    onChange: this.handleCheck,
                                    label: span({ className: "normal" }, ['Infectious and parasitic diseases']),
                                    checked: this.state.formData.parasiticDisease === 'true' || this.state.formData.parasiticDisease === true,
                                    readOnly: this.state.readOnly
                                }),
                                InputFieldCheckbox({
                                    id: "ckb_cancer",
                                    name: "cancer",
                                    onChange: this.handleCheck,
                                    label: span({ className: "normal" }, ['Cancer']),
                                    checked: this.state.formData.cancer === 'true' || this.state.formData.cancer === true,
                                    readOnly: this.state.readOnly
                                }),
                                InputFieldCheckbox({
                                    id: "ckb_endocrineDisease",
                                    name: "endocrineDisease",
                                    onChange: this.handleCheck,
                                    label: span({ className: "normal" }, ['Endocrine, nutritional and metabolic diseases']),
                                    checked: this.state.formData.endocrineDisease === 'true' || this.state.formData.endocrineDisease === true,
                                    readOnly: this.state.readOnly
                                }),
                                //if endocrineDisease is checked
                                div({ isRendered: false, className: "subGroup" }, [
                                    InputFieldCheckbox({
                                        id: "ckb_endocrineDiabetes",
                                        name: "endocrineDiabetes",
                                        onChange: this.handleCheck,
                                        label: span({ className: "normal" }, ['Diabetes mellitus']),
                                        checked: this.state.formData.endocrineDiabetes === 'true' || this.state.formData.endocrineDiabetes === true,
                                        readOnly: this.state.readOnly
                                    })
                                ]),
                                InputFieldCheckbox({
                                    id: "ckb_mentalDisorder",
                                    name: "mentalDisorder",
                                    onChange: this.handleCheck,
                                    label: span({ className: "normal" }, ['Mental, Behavioral and Neurodevelopmental disorders']),
                                    checked: this.state.formData.mentalDisorder === 'true' || this.state.formData.mentalDisorder === true,
                                    readOnly: this.state.readOnly
                                }),
                                InputFieldCheckbox({
                                    id: "ckb_nervousDisease",
                                    name: "nervousDisease",
                                    onChange: this.handleCheck,
                                    label: span({ className: "normal" }, ['Nervous system diseases']),
                                    checked: this.state.formData.nervousDisease === 'true' || this.state.formData.nervousDisease === true,
                                    readOnly: this.state.readOnly
                                }),
                                InputFieldCheckbox({
                                    id: "ckb_diseaseRestricted",
                                    name: "diseaseRestricted",
                                    onChange: this.handleCheck,
                                    label: span({ className: "normal" }, ['Eye diseases']),
                                    checked: this.state.formData.diseaseRestricted === 'true' || this.state.formData.diseaseRestricted === true,
                                    readOnly: this.state.readOnly
                                }),
                                InputFieldCheckbox({
                                    id: "ckb_eyeDisease",
                                    name: "eyeDisease",
                                    onChange: this.handleCheck,
                                    label: span({ className: "normal" }, ['Ear and mastoid process diseases']),
                                    checked: this.state.formData.eyeDisease === 'true' || this.state.formData.eyeDisease === true,
                                    readOnly: this.state.readOnly
                                }),
                                InputFieldCheckbox({
                                    id: "ckb_earDisease",
                                    name: "earDisease",
                                    onChange: this.handleCheck,
                                    label: span({ className: "normal" }, ['Ear and mastoid process diseases']),
                                    checked: this.state.formData.earDisease === 'true' || this.state.formData.earDisease === true,
                                    readOnly: this.state.readOnly
                                })
                            ]),

                            div({ className: "col-lg-6 col-md-6 col-sm-12 col-12" }, [
                                InputFieldCheckbox({
                                    id: "ckb_digestiveDisease",
                                    name: "digestiveDisease",
                                    onChange: this.handleCheck,
                                    label: span({ className: "normal" }, ['Digestive system diseases']),
                                    checked: this.state.formData.digestiveDisease === 'true' || this.state.formData.digestiveDisease === true,
                                    readOnly: this.state.readOnly
                                }),
                                //if digestiveDisease is checked 
                                div({ isRendered: false, className: "subGroup" }, [
                                    InputFieldCheckbox({
                                        id: "ckb_inflammatoryDisease",
                                        name: "inflammatoryDisease",
                                        onChange: this.handleCheck,
                                        label: span({ className: "normal" }, ['Inflammatory bowel disease']),
                                        checked: this.state.formData.inflammatoryDisease === 'true' || this.state.formData.inflammatoryDisease === true,
                                        readOnly: this.state.readOnly
                                    })
                                ]),
                                InputFieldCheckbox({
                                    id: "ckb_skinDisease",
                                    name: "skinDisease",
                                    onChange: this.handleCheck,
                                    label: span({ className: "normal" }, ['Skin and subcutaneous tissue diseases']),
                                    checked: this.state.formData.skinDisease === 'true' || this.state.formData.skinDisease === true,
                                    readOnly: this.state.readOnly
                                }),
                                InputFieldCheckbox({
                                    id: "ckb_musculoskeletalDisease",
                                    name: "musculoskeletalDisease",
                                    onChange: this.handleCheck,
                                    label: span({ className: "normal" }, ['Musculoskeletal system & connective tissue diseases']),
                                    checked: this.state.formData.musculoskeletalDisease === 'true' || this.state.formData.musculoskeletalDisease === true,
                                    readOnly: this.state.readOnly
                                }),
                                InputFieldCheckbox({
                                    id: "ckb_genitourinaryDisease",
                                    name: "genitourinaryDisease",
                                    onChange: this.handleCheck,
                                    label: span({ className: "normal" }, ['Genitourinary system diseases']),
                                    checked: this.state.formData.genitourinaryDisease === 'true' || this.state.formData.genitourinaryDisease === true,
                                    readOnly: this.state.readOnly
                                }),
                                InputFieldCheckbox({
                                    id: "ckb_pregnancy",
                                    name: "pregnancy",
                                    onChange: this.handleCheck,
                                    label: span({ className: "normal" }, ['Pregnancy, childbirth and the puerperium']),
                                    checked: this.state.formData.pregnancy === 'true' || this.state.formData.pregnancy === true,
                                    readOnly: this.state.readOnly
                                }),
                                InputFieldCheckbox({
                                    id: "ckb_congenitalMalformation",
                                    name: "congenitalMalformation",
                                    onChange: this.handleCheck,
                                    label: span({ className: "normal" }, ['Congenital malformations, deformations and chromosomal abnormalities']),
                                    checked: this.state.formData.congenitalMalformation === 'true' || this.state.formData.congenitalMalformation === true,
                                    readOnly: this.state.readOnly
                                }),
                                InputFieldCheckbox({
                                    id: "ckb_bloodDisorder",
                                    name: "bloodDisorder",
                                    onChange: this.handleCheck,
                                    label: span({ className: "normal" }, ['Blood and blood-forming organs and certain disorders involving the immune mechanism diseases']),
                                    checked: this.state.formData.bloodDisorder === 'true' || this.state.formData.bloodDisorder === true,
                                    readOnly: this.state.readOnly
                                }),
                                InputFieldCheckbox({
                                    id: "ckb_otherDisease",
                                    name: "otherDisease",
                                    onChange: this.handleCheck,
                                    label: span({ className: "normal" }, ['Other']),
                                    checked: this.state.formData.otherDisease === 'true' || this.state.formData.otherDisease === true,
                                    readOnly: this.state.readOnly
                                }),
                                //if otherDisease is checked
                                div({ isRendered: false, className: "subGroup", style: { 'marginTop': '5px' } }, [
                                    InputFieldText({
                                        id: "inputOtherDiseaseSpecify",
                                        name: "otherDiseaseSpecify",
                                        label: "Please describe",
                                        disabled: false,
                                        value: "",
                                        // currentValue: this.state.current.consentForm.summary,
                                        onChange: this.handleExtraPropsInputChange,
                                        readOnly: this.state.readOnly
                                    })
                                ])
                            ])
                        ])
                    ]),

                    Panel({ title: "2. Does the informed consent form or the IRB/EC prohibit any of the following?" }, [
                        InputFieldCheckbox({
                            id: "ckb_commercialPurposes",
                            name: "commercialPurposes",
                            onChange: this.handleCheck,
                            label: "Use by commercial entities or for commercial purposes",
                            checked: this.state.formData.commercialPurposes === 'true' || this.state.formData.commercialPurposes === true,
                            readOnly: this.state.readOnly
                        }),
                        InputFieldCheckbox({
                            id: "ckb_methodsResearch",
                            name: "methodsResearch",
                            onChange: this.handleCheck,
                            label: span({}, ['Methods research', span({ className: "normal italic" }, ['(analytic/software/technology development)'])]),
                            checked: this.state.formData.methodsResearch === 'true' || this.state.formData.methodsResearch === true,
                            readOnly: this.state.readOnly
                        })
                    ]),

                    Panel({ title: "3. Future research is restricted to the following populations" }, [
                        InputFieldCheckbox({
                            id: "ckb_noPopulationRestricted",
                            name: "noPopulationRestricted",
                            onChange: this.handleCheck,
                            label: "No population restrictions",
                            checked: this.state.formData.noPopulationRestricted === 'true' || this.state.formData.noPopulationRestricted === true,
                            readOnly: this.state.readOnly
                        }),
                        InputFieldCheckbox({
                            id: "ckb_under18",
                            name: "under18",
                            onChange: this.handleCheck,
                            label: "Research in children under 18 years of age only",
                            checked: this.state.formData.under18 === 'true' || this.state.formData.under18 === true,
                            readOnly: this.state.readOnly
                        }),
                        InputFieldCheckbox({
                            id: "ckb_above18",
                            name: "above18",
                            onChange: this.handleCheck,
                            label: "Research in adults 18 years of age and older only",
                            checked: this.state.formData.above18 === 'true' || this.state.formData.above18 === true,
                            readOnly: this.state.readOnly
                        }),
                        InputFieldCheckbox({
                            id: "ckb_onlyMen",
                            name: "onlyMen",
                            onChange: this.handleCheck,
                            label: "Research in men only",
                            checked: this.state.formData.onlyMen === 'true' || this.state.formData.onlyMen === true,
                            readOnly: this.state.readOnly
                        }),
                        InputFieldCheckbox({
                            id: "ckb_onlyWomen",
                            name: "onlyWomen",
                            onChange: this.handleCheck,
                            label: "Research in women only",
                            checked: this.state.formData.onlyWomen === 'true' || this.state.formData.onlyWomen === true,
                            readOnly: this.state.readOnly
                        }),
                        InputFieldCheckbox({
                            id: "ckb_ethnic",
                            name: "ethnic",
                            onChange: this.handleCheck,
                            label: "Research in the following ethnic or geographic population",
                            checked: this.state.formData.ethnic === 'true' || this.state.formData.ethnic === true,
                            readOnly: this.state.readOnly
                        }),
                        //if ethnic is checked
                        div({ isRendered: false, className: "subGroup", style: { 'marginTop': '5px' } }, [
                            InputFieldText({
                                id: "inputEthnicSpecify",
                                name: "ethnicSpecify",
                                label: "Please specify",
                                disabled: false,
                                value: "",
                                // currentValue: this.state.current.consentForm.summary,
                                onChange: this.handleExtraPropsInputChange,
                                readOnly: this.state.readOnly
                            })
                        ])
                    ]),

                    Panel({ title: "4. Other restrictions" }, [
                        InputFieldTextArea({
                            id: "inputOtherRestrictions",
                            name: "otherRestrictions",
                            label: "Please describe. ",
                            moreInfo: "(For example: future research use requires review by the data recipient’s IRB/EC; no data deposition from samples collected using consent forms before 1992)",
                            value: this.state.formData.otherRestrictions,
                            disabled: false,
                            onChange: this.handleInputChange
                          })
                    ]),

                    div({ className: "buttonContainer", style: { 'margin': '20px 0 40px 0' } }, [
                        button({
                            className: "btn buttonPrimary floatRight",
                            onClick: this.submitDUL(),
                            disabled: false
                        }, ["Submit"]),

                        button({
                            className: "btn buttonSecondary floatRight",
                            onClick: this.cancelDUL(),
                            disabled: false
                        }, ["Cancel"])
                    ])
                ])
            ])
        )
    }
}

export default DataUseLetter;
