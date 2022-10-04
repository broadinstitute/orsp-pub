import React, { Component } from 'react';
import { Reports } from '../util/ajax';
import {div, button, h1} from 'react-hyperscript-helpers';
import { Panel } from '../components/Panel';
import { InputFieldDatePicker } from '../components/InputFieldDatePicker';

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
            let complianceData = data[0];
            console.log(complianceData);
        })
    }

    handleAfterDatePicker = (e) => {
        console.log('afterDate: ', e)
    }

    handleBeforeDatePicker = (e) => {
        console.log('afterDate: ', e)
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
                        onChange:  this.handleAfterDatePicker,
                        disabled: false
                        })
                    ]),
                    div({className: "col-xs-12 col-sm-6"}, [
                        InputFieldDatePicker({
                        selected: this.state.beforeDate,
                        name: "beforeDate",
                        label: "Created Before",
                        onChange: this.handleBeforeDatePicker,
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
