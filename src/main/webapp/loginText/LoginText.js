import React, { Component } from 'react';
import '../components/Wizard.css'
import '../index.css'
import { button, hh, h1, h3, p, div, br } from 'react-hyperscript-helpers';

import { InputFieldText } from '../components/InputFieldText'; 
import { InputFieldTextArea } from '../components/InputFieldTextArea';
import { LoginText } from '../util/ajax';
import { AlertMessage } from '../components/AlertMessage';
import { InputFieldSelect } from '../components/InputFieldSelect';

import ReactQuill from "react-quill";
import 'react-quill/dist/quill.snow.css';

const styles = {
    titleSize: '24px',
    fontFamily : '"Helvetica Neue",Helvetica,Arial,sans-serif',
    textFontSize: '14px'
  };

export const LogintText = hh(class LogintText extends Component {

    constructor(props) {
        super(props);
        this.state = {
            heading: '',
            body: '',
            formattedBody: '',
            currentValue: {},
            alert: '',
            loginTextResponse: '',
            optionData: [],
            alertType: ''
        };
        this.getLoginText();
    }

    componentDidMount() {
        this.init();
    }

    async init() {
        let current = {};
        let optionData = []
        await LoginText.getLoginText().then(loginText => {
            let data = loginText.data[0];
            current.heading = data[1];
            let bodyData = data[2];
            bodyData = bodyData.replaceAll("&lt;", "<");
            bodyData = bodyData.replaceAll("&gt;", ">");
            current.body = bodyData;
            this.setState({
                currentValue: current,
                heading: current.heading,
                body: current.body
            });
        }).catch(error => {
            console.log(error);
            this.setState(() => { throw error; });
        });
        await LoginText.getLoginTextResponse().then(loginTextResponse => {
            let responseData = loginTextResponse.data;
            responseData.forEach(element => {
                if(element[1] == current.heading)  {
                    this.setState({
                        loginTextResponse: current.heading
                    });
                }
                optionData.push({label: element[1], value: element[1], body: element[2]});
            });
            this.setState(prev => {
                prev.optionData = optionData;
                return prev;
            });
        }).catch(error => {
            console.log(error);
            this.setState(() => { throw error; });
        });
    }

    getLoginText = () => {
        let current = {};
        LoginText.getLoginText().then(loginText => {
            let data = loginText.data[0];
            current.heading = data[1];
            let bodyData = data[2];
            bodyData = bodyData.replaceAll("&lt;", "<");
            bodyData = bodyData.replaceAll("&gt;", ">");
            current.body = bodyData;
            this.setState(prev => {
                prev.currentValue = current;
                prev.heading = current.heading;
                prev.body = current.body;
                return prev;
            })
        });
    }

    handleSelect = (field) => () => (selectedOption) => {
        this.setState(prev => {
          prev.heading = selectedOption.value;
          prev.body = selectedOption.body;
          prev.currentValue = {heading: selectedOption.value, body: selectedOption.body};
          prev.loginTextResponse = selectedOption.value;
          return prev;
        })
    };

    handleHeadingChange = (e) => {
        let value = e.target.value;
        this.setState(prev => {
            prev.heading = value;
            return prev;
        })
    }

    handleBodyChange = (e) => {
        this.setState({
            body: e
        })
        let formattedBody = e
        formattedBody = formattedBody.replaceAll("<", "&lt;");
        formattedBody = formattedBody.replaceAll(">", "&gt;");
        this.setState({
            formattedBody: formattedBody
        })
    }

    clearFields = () => {
        this.setState({
            heading: '',
            body: ''
        })
    }

    setShowMessage = () => {
        let heading = '';
        let body = '';
        LoginText.updateLoginText(heading, body, 'N').then(() => {
            this.getLoginText();
            this.setState(prev => {
                prev.loginTextResponse = '';
                prev.alert = 'Login text defaulted to About details'
                prev.alertType = 'success'
            })
        }).catch(error => {
            this.setState(prev => {
                prev.alert = "We had an unexpected error "+error;
                prev.alertType = 'danger';
                return prev;
            })
        })
    }

    submitEditResponses = () => {
        let heading = this.state.heading;
        let body = this.state.formattedBody || this.state.body;
        LoginText.updateLoginText(heading, body, 'Y').then(() => {
            this.getLoginText();
            this.setState(prev => {
                prev.alert = 'Submitted Successfully'
                prev.alertType = 'success'
            })
        }).catch(error => {
            this.setState(prev => {
                prev.alert = "We had an unexpected error "+error;
                prev.alertType = 'danger';
                return prev;
            })
        })
    }

    render() {
        return (
            <div>
                <h1 className="wizardTitle">Login Text</h1>
                <div style={{marginTop: '1rem'}}>
                    <InputFieldSelect
                        label="Portal Message"
                        id="loginTextResponse"
                        name="loginTextResponse"
                        options={this.state.optionData}
                        value={this.state.loginTextResponse}
                        currentValue={this.state.loginTextResponse}
                        onChange={this.handleSelect("loginTextResponse")}
                        readOnly={false}
                        placeholder={this.state.loginTextResponse || "Select a quick response"}
                        edit={true}
                        onClick={this.clickSelect}
                    ></InputFieldSelect>
                    <InputFieldText
                        id="LoginTextHeading"
                        name="heading"
                        label="Heading for login page text"
                        value={this.state.heading}
                        currentValue={this.state.currentValue.heading}
                        onChange={this.handleHeadingChange}
                    ></InputFieldText>
                    <label style={{ color: '#286090', fontWeight: '700', fontSize: '1rem', marginBottom: '3px', marginTop: '10px' }}>Body for the login page text</label>
                    <ReactQuill
                        theme='snow'
                        value={this.state.body}
                        onChange={this.handleBodyChange}
                        style={{height: '12rem'}}
                    /><br/>
                    <div className="buttonContainer" style={{margin: '3rem 0 1rem 0', display: 'flex', justifyContent: 'right'}}>
                        <button
                            ref={el => {
                                if(el) {
                                    el.style.setProperty('background', 'none', 'important');
                                    el.style.setProperty('color', '#000000', 'important');
                                }
                            }}
                            className='btn buttonSecondary'
                            style={{ margin: '0 1rem 0 0' }}
                            onClick={this.clearFields}
                        >Clear</button>
                        <button 
                            ref={el => {
                                if(el) {
                                    el.style.setProperty('background', 'none', 'important');
                                    el.style.setProperty('color', '#000000', 'important');
                                }
                            }}
                            className="btn buttonSecondary"
                            style={{ margin: '0 1rem 0 0' }}
                            onClick={this.setShowMessage}
                        >Default</button>
                        <button 
                            className="btn buttonPrimary" 
                            onClick={this.submitEditResponses}
                        >Submit</button>
                    </div>
                    <AlertMessage
                        msg={this.state.alert}
                        show={this.state.alert !== '' ? true : false}
                        type={this.state.alertType}
                    ></AlertMessage>
                </div>
            </div>
        );
    }
})
