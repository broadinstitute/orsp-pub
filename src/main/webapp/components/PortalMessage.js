import React, { Component } from 'react';
import { LoginText } from '../util/ajax';
import { hh } from 'react-hyperscript-helpers';

export const PortalMessage = hh(class PortalMessage extends Component {

    constructor(props) {
        super(props);
        this.state = {
            heading: '',
            body: ''
        }
    }

    componentDidMount() {
        LoginText.getLoginText().then(loginText => {
            let data = loginText.data[0];
            let bodyData = data[2];
            bodyData = bodyData.replaceAll("&lt;", "<");
            bodyData = bodyData.replaceAll("&gt;", ">");
            this.setState({
                heading: data[1],
                body: bodyData
            })
        })
    }

    render() {
        return(
            <div>
                { this.state.heading !== '' ?
                    <div style={{ padding:"15px", border:"1px solid #CCCCCC", borderRadius:"6px", margin:"20px 0 30px 0" }}>
                        <h3 style={{ fontSize: '24px', color: '#ED1D24', fontWeight: 'bold' }}>{this.state.heading}</h3>
                        <p 
                            style={{ fontSize: '14px' }}
                            dangerouslySetInnerHTML={{ __html: this.state.body }}
                        ></p>
                    </div> : undefined
                }
            </div>
        )
    }
})
