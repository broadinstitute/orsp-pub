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
            afterDate: null,
            beforeDate: null,

        }
    }

    applyFilterPanel = () => {
        let afterDateStr = this.state.afterDate.toISOString().substring(0, 10);
        let beforeDateStr = this.state.beforeDate.toISOString().substring(0, 10);
        Reports.getComplianceReportData(afterDateStr, beforeDateStr).then(data => {
            let complianceData = data[0];
            console.log(complianceData);

            

        })
    }

    setBeforeDate(date) {
        this.setState({
            beforeDate: date
        })
    }

    setAfterDate(date) {
        this.setState({
            afterDate: date
        })
    }

    clearFilterPanel = () => {
        this.setState({
            afterDate: null,
            beforeDate: null
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
                        <div className="inputFieldSelectWrapper">
                            <label className='inputFieldLabel'>Created After</label>
                            <br/>
                            <DatePicker 
                                selected={this.state.afterDate}
                                onChange={(date) => this.setAfterDate(date)}
                                className="inputFieldDatePicker"
                            ></DatePicker>
                        </div>
                    ]),
                    div({className: "col-xs-12 col-sm-6"}, [
                        <div className="inputFieldSelectWrapper">
                            <label className='inputFieldLabel'>Created Before</label>
                            <br/>
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
