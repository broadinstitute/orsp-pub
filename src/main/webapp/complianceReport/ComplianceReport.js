import React, { Component } from 'react'
import { Reports } from '../util/ajax';

class ComplianceReport extends Component {

    constructor(props) {
        super(props);
        this.state = {
            data: ''
        }
    }

    componentDidMount() {
        this.init();
    }

    async init() {
        await Reports.getComplianceReportData('2020-01-01', '2022-09-27').then(data => {
            console.log(data);
            this.setState({
                data: data
            })
        })
    }

    render() {
        return (
            <div>
                <h1>{this.state.data}</h1>
            </div>
        )
    }
}

export default ComplianceReport