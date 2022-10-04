import React, { Component } from 'react';
import { Reports } from '../util/ajax';
import {div, button, h1} from 'react-hyperscript-helpers';
import { Panel } from '../components/Panel';
import DatePicker from 'react-datepicker';

import '../components/InputField.css';

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

    setBeforeDate(date) {
        let mm = date.getMonth() + 1;
        let dd = date.getDate();

        let beforeDate = [(dd>9 ? '' : '0') + dd,
                (mm>9 ? '' : '0') + mm,
                date.getFullYear()
                ].join('-');
        this.setState({
            beforeDate: beforeDate
        })
    }

    setAfterDate(date) {
        let mm = date.getMonth() + 1;
        let dd = date.getDate();

        let afterDate = [(dd>9 ? '' : '0') + dd,
                (mm>9 ? '' : '0') + mm,
                date.getFullYear()
                ].join('-');
        this.setState({
            afterDate: afterDate
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
                        <div>
                            <label className='inputFieldLabel'>Created After</label>
                            <DatePicker 
                                selected={this.state.afterDate}
                                onChange={(date) => this.setAfterDate(date)}
                                className="inputFieldDatePicker"
                            ></DatePicker>
                        </div>
                    ]),
                    div({className: "col-xs-12 col-sm-6"}, [
                        <div>
                            <label className='inputFieldLabel'>Created Before</label>
                            <DatePicker 
                                selected={this.state.beforeDate}
                                onChange={(date) => this.setBeforeDate(date)}
                                className="inputFieldDatePicker"
                            ></DatePicker>
                        </div>
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
