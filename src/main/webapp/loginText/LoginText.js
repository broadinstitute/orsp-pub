import React, { Component } from 'react';
import '../components/Wizard.css'
import '../index.css'
import { button, hh, h1, div } from 'react-hyperscript-helpers';

import { InputFieldText } from '../components/InputFieldText'; 
import { InputFieldTextArea } from '../components/InputFieldTextArea';
import { LoginText } from '../util/ajax';
import { AlertMessage } from '../components/AlertMessage';

export const LogintText = hh(class LogintText extends Component {

    constructor(props) {
        super(props);
        this.state = {
            heading: '',
            body: '',
            currentValue: {},
            alert: ''
        };
    }

    componentDidMount() {
        let current = {};
        LoginText.getLoginText().then(loginText => {
            console.log(loginText);
            console.log('logintext: ', loginText);
            let data = loginText.data[0];
            current.heading = data[1];
            current.body = data[2];
            console.log(current);
        });
        this.setState({
            currentValue: current,
            heading: current.heading,
            body: current.body
        })
    }

    getLoginText = () => {
        let current = {};
        LoginText.getLoginText().then(loginText => {
            console.log(loginText);
            let data = loginText.data[0];
            current.heading = data[1];
            current.body = data[2];
        });
        this.setState(prev => {
            prev.currentValue = current;
            prev.heading = current.heading;
            prev.body = current.body;
            return prev;
        })
    }

    handleHeadingChange = (e) => {
        let value = e.target.value;
        this.setState(prev => {
            prev.heading = value;
            return prev;
        })
    }

    handleBodyChange = (e) => {
        let value = e.target.value;
        this.setState(prev => {
            prev.body = value;
            return prev;
        })
    }

    submitEditResponses = () => {
        let heading = this.state.heading;
        let body = this.state.body;
        console.log("heading: "+heading, "body: "+body);
        LoginText.updateLoginText(heading, body).then(() => {
            this.getLoginText();
            // this.setState(prev => {
            //     prev.heading = '';
            //     prev.body = '';
            //     return prev;
            // })
        }).catch(error => {
            this.setState(prev => {
                prev.alert = "We had an unexpected error "+error;
                return prev;
            })
        })
    }

    render() {
        return (
            div({}, [
                h1({ className: "wizardTitle" }, ["Login Text"]),
                div({}, [
                    InputFieldText({
                        id: "LoginTextHeading",
                        name: "heading",
                        label: "Heading for login page text",
                        value: this.state.heading,
                        // currentValue: this.state.currentValue.heading,
                        required: true,
                        error: this.state.heading == '' ? true : false,
                        errorMessage: "Heading cannot be empty",
                        onChange: this.handleHeadingChange
                    }),
                    InputFieldTextArea({
                        id: "loginTextBody",
                        name: "body",
                        label: "Body for login page text",
                        value: this.state.body,
                        // currentValue: this.state.currentValue.body,
                        required: true,
                        error: this.state.body == '' ? true : false,
                        errorMessage: "Body cannot be empty",
                        onChange: this.handleBodyChange
                    }),
                    div({ className: "buttonContainer", style: { 'margin': '0 0 0 0' } }, [
                        button({
                            className: "btn buttonPrimary floatRight",
                            onClick: this.submitEditResponses,
                        }, ["Submit"])
                    ]),
                    AlertMessage({
                        msg: this.state.alert,
                        show: this.state.alert !== '' ? true : false,
                        type: 'danger'
                    })
                ])
            ])
        );
    }
})