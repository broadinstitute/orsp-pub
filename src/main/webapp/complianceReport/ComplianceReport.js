import React, { Component } from 'react'
import { Reports } from '../util/ajax';

class ComplianceReport extends Component {
    constructor(props) {
        super(props)
        this.state = {
            data: []
        }
    }

    componentDidMount() {
        this.init();
    }

    async init() {
        await Reports.getComplianceReportData().then(data => {
            console.log(data)
            this.setState({
                data: data
            })
        })
    }

    render() {
        return(
            <div>
                <h1>Compliance Report</h1>
                <p>{this.state.data}</p>
            </div>
        )
    }
}

export default ComplianceReport
