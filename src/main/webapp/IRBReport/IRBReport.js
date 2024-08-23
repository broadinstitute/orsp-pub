import React, {Component, useEffect, useState} from "react";
import LoadingWrapper from "../components/LoadingWrapper";
import { Panel } from "../components/Panel";
import { Reports } from "../util/ajax";
import { TableComponent } from "../components/TableComponent";
import { IRB_REPORT_COLUMNS, SIZE_PER_PAGE_LIST, defaultSorted } from "../util/ReportConstants";

import './IRBReport.css'

const IRBReport = (props) => {

    const [reportData, setReportData] = useState([]);
    const [columnWidth, setColumnWidth] = useState('*');

    useEffect(() => {
        props.showSpinner();
        Reports.getIRBReport().then(data => {
            props.hideSpinner();
            let fundingDataLength = 0;
            let reportData = data.data.map((item, i) => {
                const {
                    investigatorFirstName,
                    investigatorLastName,
                    degree,
                    protocol,
                    irb,
                    irbReferralText,
                    projectTitle,
                    initialDate,
                    initialReviewType,
                    bioMedical
                } = JSON.parse(item[1]);
                let initDate = initialDate && new Date(initialDate);
                initDate = initialDate && ((initDate.getMonth() + 1).toString().padStart(2, '0') + "/" + initDate.getDate().toString().padStart(2, '0') + "/" + initDate.getFullYear());
                let irbData = irb && JSON.parse(irb).label;
                irbData = (irbData === "Other" && irbReferralText) ? irbReferralText : irbData;
                let typeOfInitialReview = initialReviewType && JSON.parse(initialReviewType).label;
                let funding = item[2];
                funding = funding && funding.split(',');
                if (funding && (funding.length > fundingDataLength)) fundingDataLength = funding.length;
                let reportJson = {irb: irbData, investigatorFirstName, investigatorLastName, degree, protocol, projectKey: item[0], projectTitle, initialDate: initDate, typeOfInitialReview, bioMedical, id: i};
                funding && funding.forEach((item, i) => {
                    reportJson[`funding${i + 1}`] = item;
                });
                return reportJson;
            });
            for(let i = 1; i<=fundingDataLength; i++) {
                IRB_REPORT_COLUMNS.push({
                    dataField: `funding${i}`,
                    text: `Funding ${i}`,
                    sort: true,
                    editable: false
                });
            }
            setReportData(reportData);
        }).catch(error => {
            props.hideSpinner();
            console.log(error)
        })
    }, []);

    const exportTable = (action) => {
        let cols = IRB_REPORT_COLUMNS.filter(el => el.dataField !== 'id');
        let elementsArray = formatDataPrintableFormat(reportData, cols);
        const headerText = 'IRB Report';
        const columnsWidths = ['*', '*', '*', '*', '*', '*', '*', '*', '*', '*', '*', '*', '*', '*'];
        exportData(action,'IRB Report', elementsArray, columnsWidths, headerText, columnsWidths, 'A2', 'landscape');
    };

    return(
        <div>
            <h1>IRB Report</h1>
            <div className="irb-table">
                <TableComponent
                    remoteProp= {false}
                    data= {reportData}
                    columns= {IRB_REPORT_COLUMNS}
                    keyField= 'id'
                    search= {true}
                    fileName= 'IRB Report'
                    showPrintButton= {false}
                    sizePerPageList= {SIZE_PER_PAGE_LIST}
                    printComments= {() => exportTable('print')}
                    defaultSorted= {defaultSorted}
                    pagination= {true}
                    showExportButtons= {true}
                    showSearchBar= {true}
                    showPdfExport= {false}
                    showTotal= {true}
                ></TableComponent>
            </div>
        </div>
    )
}

export default LoadingWrapper(IRBReport)