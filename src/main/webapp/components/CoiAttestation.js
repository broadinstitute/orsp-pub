import { Component } from "react";
import { hh, div, p, small, span } from 'react-hyperscript-helpers';
import { InputFieldCheckbox } from "./InputFieldCheckbox";
import "./CoiAttestation.css"

export const CoiAttestation = hh( class CoiAttestation extends Component{

    constructor(props) {
        super(props);
        this.state = {
            readOnly: this.props.isReadOnly
        }
    }

    updateCoiAttestationHandler = (option) => {
        const {name} = option.target;
        this.props.handler(name);
    }

    render() {
        return (
            div({id:'coi_attestation_component'},[
                p({},[`Please check, if Duos is using the attestation information and if any changes are needed
                with that integration`]),
                div({className: "mt-10"}, [
                    div({className: "mt-10"},[
                        p({className:'bold'},['1. Accuracy of Information']),
                        span({className:'italic'},['I confirm that the information provided above is accurate and complete.']),
                        div({className: "ml-10 mt-10"},[
                        InputFieldCheckbox({
                            id: "coi_attestation_1",
                            name: "accuracyConfirmed",
                            label: "I confirm",
                            checked: this.props.coiAttestation.accuracyConfirmed,
                            onChange: this.updateCoiAttestationHandler,
                            readOnly: this.state.readOnly
                        }),
                            small({ isRendered: this.state.readOnly? false : this.props.coiAttestationError.accuracyError, className: "errorMessage" }, 'Required Field')
                        ])
                    ]),
                    div({className: "mt-10"},[
                        p({className:'bold'},['2. Authorization to Submit']),
                        span({className:'italic'},[`The Broad Institute researcher associated with this project is aware of this
                        application, and I have the authority to submit it on their behalf.`]),
                        div({className: "ml-10 mt-10"},[
                        InputFieldCheckbox({
                            id: "coi_attestation_2",
                            name: "authorizationConfirmed",
                            label: "I confirm",
                            checked: this.props.coiAttestation.authorizationConfirmed,
                            onChange: this.updateCoiAttestationHandler,
                            readOnly: this.state.readOnly

                        }),
                            small({ isRendered: this.state.readOnly? false : this.props.coiAttestationError.authorizationError, className: "errorMessage" }, 'Required Field')
                        ])
                    ]),
                    div({className: "mt-10"},[
                        p({className:'bold'},['3. Use of Coded Specimens/Data',span({className:'italic'},[' (if applicable)'])]),
                        span({className:'italic'},[`If obtaining coded specimens or data, I certify that no Broad Institute staff or
                        researchers working on this project will have access to identifying information that could be
                        used to re-identify individuals from whom the coded samples or data were derived.
                        I also certify that the study team will not attempt to obtain such identifying information.`]),
                        div({className: "ml-10 mt-10"},[
                        InputFieldCheckbox({
                            id: "coi_attestation-3_1",
                            name: "codedConfirmed",
                            label: "I confirm",
                            checked: this.props.coiAttestation.codedConfirmed,
                            onChange: this.updateCoiAttestationHandler,
                            readOnly: this.state.readOnly
                        }),
                        InputFieldCheckbox({
                            id: "coi_attestation-3_2",
                            name: "codedNotApplicable",
                            label: "Not applicable (no coded specimens or data)",
                            checked: this.props.coiAttestation.codedNotApplicable,
                            onChange: this.updateCoiAttestationHandler,
                            readOnly: this.state.readOnly
                        }),
                            small({ isRendered: this.state.readOnly? false : this.props.coiAttestationError.codedConfirmedError, className: "errorMessage" }, 'Required Field'),
                        ])
                    ]),
                    div({className: "mt-10"},[
                        p({className:'bold'},['4. Data and Specimen Sharing']),
                        span({className:'italic'},[`I will not share any data or specimens approved under this project with individuals 
                            outside the designated study team without prior approval from ORSP and, 
                            if applicable, the IRB.`]),
                        div({className: "ml-10 mt-10"},[
                        InputFieldCheckbox({
                            id: "coi_attestation_4",
                            name: "dataSharingConfirmed",
                            label: "I confirm",
                            checked: this.props.coiAttestation.dataSharingConfirmed,
                            onChange: this.updateCoiAttestationHandler,
                            readOnly: this.state.readOnly
                        }),
                            small({ isRendered: this.state.readOnly? false : this.props.coiAttestationError.dataSharingError, className: "errorMessage" }, 'Required Field'),
                        ])
                    ]),
                    div({className: "mt-10"},[
                        p({className:'bold'},['5. Disclosure of Financial Interests',span({className:'italic'},[' (if applicable)'])]),
                        span({className:'italic'},[`If this study requires IRB review, all relevant financial interests have been—or will 
                            be—disclosed in accordance with the policies of the IRB of record. Disclosures will be updated
                            promptly if any financial interests change during the course of the study.`]),
                        div({className: "ml-10 mt-10"},[
                        InputFieldCheckbox({
                            id: "coi_attestation-5_1",
                            name: "financialConfirmed",
                            label: "I confirm",
                            checked: this.props.coiAttestation.financialConfirmed,
                            onChange: this.updateCoiAttestationHandler,
                            readOnly: this.state.readOnly
                        }),
                        InputFieldCheckbox({
                            id: "coi_attestation_5_2",
                            name: "financialNotApplicable",
                            label: "Not applicable (not subject to IRB review)",
                            checked: this.props.coiAttestation.financialNotApplicable,
                            onChange: this.updateCoiAttestationHandler,
                            readOnly: this.state.readOnly
                        }),
                        small({ isRendered: this.state.readOnly? false : this.props.coiAttestationError.financialError, className: "errorMessage" }, 'Required Field')
                        ]),
                    ]),
                ])
            ])
        )
    }
})
