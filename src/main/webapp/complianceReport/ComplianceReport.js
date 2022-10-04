import React, { Component } from 'react';
import { Reports } from '../util/ajax';
import {div, button} from 'react-hyperscript-helpers'

class ComplianceReport extends Component {
    constructor(props) {
        super(props)
        this.state = {
            data: [],
            afterDate: '',
            beforeDate: '',

        }
    }

    applyFilterPanel = () => {
        Reports.getComplianceReportData(this.state.afterDate, this.state.beforeDate).then(data => {
            console.log(data);
        })
    }

    handleAfterDatePicker = (e) => {
        console.log('afterDate: ', e)
        this.setState({
            afterDate: (e.target.value).toString()
        })
    }

    handleBeforeDatePicker = (e) => {
        console.log('afterDate: ', e)
        this.setState({
            afterDate: (e.target.value).toString()
        })
    }

    clearFilterPanel = () => {
        this.setState({
            afterDate: '',
            beforeDate: ''
        })
    }

    render() {
        return(
            div({
            },[
                h1({},['Compliance Report']),
                Panel({ title: "Filter Compliance report" }, [
                    div({className: "row"}, [
                    div({className: "col-xs-12 col-sm-6"}, [
                        InputFieldDatePicker({
                        selected: this.state.afterDate,
                        name: "afterDate",
                        label: "Created After",
                        onChange:  (e) => this.handleAfterDatePicker(e),
                        disabled: false
                        })
                    ]),
                    div({className: "col-xs-12 col-sm-6"}, [
                        InputFieldDatePicker({
                        selected: this.state.beforeDate,
                        name: "beforeDate",
                        label: "Created Before",
                        onChange: (e) => this.handleBeforeDatePicker(e),
                        disabled: false
                        })
                    ])
                    ]),
                    button({
                    className: "btn buttonPrimary",
                    style: { marginTop: '20px', marginRight: '10px' },
                    onClick: this.applyFilterPanel
                    }, ['Filter']),
                    button({
                    className: "btn buttonSecondary",
                    style: { marginTop: '20px' },
                    onClick: this.clearFilterPanel
                    }, ['Clear'])
                ]),
                <div>

                </div>
            ])
        )
    }
}

export default ComplianceReport
