import React, { Component } from 'react';
import { Reports } from '../util/ajax';
import {hh, div, button, h1} from 'react-hyperscript-helpers';
import { Panel } from '../components/Panel';
import DatePicker from 'react-datepicker';
import { formatDataPrintableFormat } from '../util/TableUtil';
import { exportData, isEmpty } from '../util/Utils';
import LoadingWrapper from '../components/LoadingWrapper';
import { InputFieldSelect } from '../components/InputFieldSelect'

import './ComplianceReport.css';
import "react-datepicker/dist/react-datepicker.css";

import { TableComponent } from '../components/TableComponent';
import { COMPLIANCE_REPORT_COLUMNS, defaultSorted, COMPLIANCE, SIZE_PER_PAGE_LIST } from '../util/ReportConstants';

const ComplianceReport = hh(class ComplianceReport extends Component {
    constructor(props) {
        super(props)
        this.state = {
            complianceReportData: [],
            afterDate: null,
            beforeDate: null,
            showTable: false,
            noDataFound: false,
            projectType: 'All',
            dateWarning: false
        }
    }

    applyFilterPanel = async () => {
        this.setState({
            showTable: false
        })
        if (!this.state.beforeDate) {
            this.setState({
                dateWarning: true
            })
        } else {
            this.props.showSpinner();
            this.setState({
                dateWarning: false
            })
            let afterDateStr = this.state.afterDate ? this.state.afterDate.toISOString().substring(0, 10) : "";
            let beforeDateStr = this.state.beforeDate ? this.state.beforeDate.toISOString().substring(0, 10) : "";
            let projectType = this.state.projectType === 'All' ? '' : this.state.projectType;
            await Reports.getComplianceReportData(afterDateStr, beforeDateStr, projectType).then(data => {
                let dataLength = data.data[0].complianceReportData.length
                if(dataLength == 0 ) {
                    this.setState({
                        noDataFound: true
                    }, () => {
                        this.props.hideSpinner();
                    })
                } else {
                    this.setState({
                        noDataFound: false
                    })
                    let complianceData = data.data[0];
                    let complianceDataArr = [];
                    let submissionDataArr = [];

                    /*
                        Note for Dev: The operations you see below are 
                        due to the unformatted data we recieve from backend
                    */
                    /* 
                        Converting array of strings to array of objects,
                        data recieved from api call is an array of strings
                    */
                    const complianceReportData = complianceData.complianceReportData;
                    complianceReportData.forEach(complianceReportDataElement => {
                        let tempComplianceData = {
                            eventTypeCount: 0,
                            eventCreatedDate: [],
                        }
                        tempComplianceData['projectKey'] = complianceReportDataElement[0];
                        tempComplianceData['requestDate'] = complianceReportDataElement[1].slice(0,10);
                        tempComplianceData['type'] = complianceReportDataElement[2];
                        tempComplianceData['name'] = complianceReportDataElement[3];
                        tempComplianceData['value'] = complianceReportDataElement[4];
                        tempComplianceData['funding'] = complianceReportDataElement[5];
                        complianceDataArr.push(tempComplianceData);
                    })

                    /* 
                        Converting array of strings to array of objects
                        array of strings is received from the api call that filters
                        using IRB project type and Other event type
                    */
                    const submissionReportData = complianceData.submissionData;
                    submissionReportData.forEach(submissionReportDataElement => {
                        let submissionData = {};
                        submissionData['projectKey'] = submissionReportDataElement[0];
                        submissionData['projectType'] = submissionReportDataElement[1];
                        submissionData['createdDate'] = submissionReportDataElement[2].slice(0, 10);
                        submissionData['eventType'] = submissionReportDataElement[3];
                        submissionDataArr.push(submissionData);
                    })

                    /*
                        Taking required values from submission details above
                        and joining it with the complianceReportData
                    */
                    submissionDataArr.forEach(submissionDataArrElement => {
                        complianceDataArr.forEach(complianceDataArrElement => {
                        if (submissionDataArrElement.projectKey === complianceDataArrElement.projectKey) {
                                complianceDataArrElement.eventTypeCount = complianceDataArrElement.eventTypeCount + 1;
                                complianceDataArrElement.eventCreatedDate.push(submissionDataArrElement.createdDate);
                            }
                        })
                    })

                    /*
                        Converting resultant data from above operation to get required data
                        by adding new fields needed for the report
                    */
                    let reportDataArr = [];

                    complianceDataArr.forEach(complDataArrElement => {
                        let reportData = {
                            projectKey: '',
                            submittedDate: '',
                            funding: '',
                            numberofOtherEvents: '',
                            eventCreatedDates: '',
                            firstNameOfInvestigator: '',
                            lastNameOfInvestigator: '',
                            degree: '',
                            typeOfInitialReview: '',
                            biomedical: '',
                            approveDate: '',
                            financialConflict: '',
                            financialConflictDescription: '',
                            daysFromSubmissionToApproval: ''
                        };
                        let tempReportData = [];
                        let onHoldDays = 0;
                        complianceDataArr.forEach(complianceElement => {
                            if (complDataArrElement.projectKey === complianceElement.projectKey) {
                                tempReportData.push(complianceElement);   
                            }
                        })
                        tempReportData.forEach(tempData => {
                            reportData["projectKey"] = tempData.projectKey;
                                reportData["submittedDate"] = tempData.requestDate;
                                reportData["funding"] = tempData.funding;
                                reportData["numberofOtherEvents"] = tempData.eventTypeCount;
                                reportData["eventCreatedDates"] = tempData.eventCreatedDate;

                                if (tempData.name == 'investigatorFirstName') 
                                    reportData["firstNameOfInvestigator"] = tempData.value;
                                if (tempData.name == 'investigatorLastName')
                                    reportData["lastNameOfInvestigator"] = tempData.value;
                                if (tempData.name == "degree")
                                    reportData["degree"] = tempData.value;
                                if (tempData.name == "initialReviewType")
                                    reportData["typeOfInitialReview"] = (tempData.value[0] == "{") ? JSON.parse(tempData.value).label : tempData.value;
                                if (tempData.name == "bioMedical")
                                    reportData["biomedical"] = tempData.value;
                                if (tempData.name == "initialDate")
                                    reportData["approveDate"] = tempData.value;
                                if (tempData.name == "financialConflict")
                                    reportData["financialConflict"] = tempData.value;
                                if (tempData.name == "financialConflictDescription")
                                    reportData["financialConflictDescription"] = tempData.value;
                                if (tempData.name == "onHoldDays") {
                                    onHoldDays = tempData.value
                                }
                                let daysCount = Math.round((new Date(reportData.approveDate).getTime() - new Date(reportData.submittedDate).getTime()) / (1000*3600*24));
                                daysCount = onHoldDays ? (daysCount - onHoldDays) : daysCount;
                                reportData["daysFromSubmissionToApproval"] = isNaN(daysCount) ? 'Not yet approved' : daysCount;
                        })
                        reportDataArr.push(reportData);
                    })

                    /*
                        Removing duplicate objects from the above resultant
                    */
                    let startIndex = 0
                    let tempSave = [].concat(reportDataArr[0])
                    reportDataArr.forEach(arrElement => {
                        let endIndex = 0
                        reportDataArr.forEach(element => {
                            if (arrElement.projectKey === element.projectKey) {
                                endIndex += 1
                            }
                        })
                        reportDataArr.splice(startIndex, endIndex)
                        startIndex += 1
                    })
                    reportDataArr.unshift(tempSave[0])
                    this.setState(prev => {
                        prev.complianceReportData = reportDataArr;
                        prev.showTable = true
                    }, () => {
                        this.props.hideSpinner();
                    })
                }
            }).catch(err => {
                this.setState({
                    showTable: false
                })
                this.props.hideSpinner();
                console.log(err);
            })
        }
    }

    setBeforeDate(date) {
        this.setState({
            beforeDate: date,
            dateWarning: false
        })
    }

    setAfterDate(date) {
        this.setState({
            afterDate: date,
            dateWarning: false
        })
    }

    clearFilterPanel = () => {
        this.setState({
            afterDate: null,
            beforeDate: null,
            showTable: false,
            projectType: 'All',
            noDataFound: false
        })
    }

    exportTable = (action, tab) => {
        let cols = COMPLIANCE_REPORT_COLUMNS.filter(el => el.dataField !== 'id');
        let elementsArray = formatDataPrintableFormat(this.state.complianceReportData, cols);
        const headerText = 'Compliance Report';
        const columnsWidths = ['*', '*', '*', '*', '*', '*', '*', '*', '*', '*', '*', '*', '*', '*'];
        exportData(action,'Compliance Report', elementsArray, columnsWidths, headerText, columnsWidths, 'A2', 'landscape');
      };

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
                            <br/>
                            <DatePicker style={{display: 'block'}}
                                selected={this.state.afterDate}
                                onChange={(date) => this.setAfterDate(date)}
                                className="DatePicker"
                            ></DatePicker>
                        </div>
                    ]),
                    div({className: "col-xs-12 col-sm-6"}, [
                        <div>
                            <label className='inputFieldLabel'>Created Before</label>
                            <br/>
                            <DatePicker style={{display: 'block'}}
                                selected={this.state.beforeDate}
                                onChange={(date) => this.setBeforeDate(date)}
                                className="DatePicker"
                            ></DatePicker>
                        </div>
                    ]),
                    ]),
                    div({
                        isRendered: this.state.dateWarning,
                        className: "date-warning"
                    }, ['Please select "Created Before" date']),
                    div({}, [
                        <div>
                            <label className='option-label'>Project Type</label><br></br>
                            <select className='project-select' onChange={(e) => {this.setState({projectType: e.target.value})}}>
                                <option value="All">All</option>
                                <option value="IRB">IRB</option>
                                <option value="NHSR">NHSR</option>
                                <option value="EX">Exempt</option>
                                <option value="NE">Not Engaged</option>
                            </select>
                        </div>
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
                div({ isRendered: this.state.showTable && this.state.complianceReportData, className: "compliance-table" }, [
                    <TableComponent
                        remoteProp= {false}
                        data= {this.state.complianceReportData}
                        columns= {COMPLIANCE_REPORT_COLUMNS}
                        keyField= 'projectKey'
                        search= {true}
                        fileName= 'Compliance Report'
                        showPrintButton= {false}
                        sizePerPageList= {SIZE_PER_PAGE_LIST}
                        printComments= {() => this.exportTable('print', COMPLIANCE)}
                        downloadPdf= {() => this.exportTable('download', COMPLIANCE)}
                        defaultSorted= {defaultSorted}
                        pagination= {true}
                        showExportButtons= {true}
                        showSearchBar= {true}
                        showPdfExport= {true}
                        className= "compliance-table"
                    ></TableComponent>
                ]),
                div({
                    isRendered: this.state.noDataFound,
                    className: 'no-data'
                }, ['No Data Found'])
            ])
        )
    }
});

export default LoadingWrapper(ComplianceReport)
