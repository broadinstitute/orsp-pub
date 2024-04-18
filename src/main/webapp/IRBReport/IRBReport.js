import React, {Component, useEffect, useState} from "react";
import LoadingWrapper from "../components/LoadingWrapper";
import { Panel } from "../components/Panel";
import { Reports } from "../util/ajax";
import { TableComponent } from "../components/TableComponent";
import { IRB_REPORT_COLUMNS, SIZE_PER_PAGE_LIST, defaultSorted } from "../util/ReportConstants";

import './IRBReport.css'

const IRBReport = () => {

    const [reportData, setReportData] = useState([])

    useEffect(() => {
        Reports.getIRBReport().then(data => {
            let reportData = data.data.map((item, i) => {
                const {
                    investigatorFirstName,
                    investigatorLastName,
                    degree,
                    protocol,
                    irb,
                    projectTitle,
                    initialDate,
                    initialReviewType,
                    bioMedical
                } = JSON.parse(item[1]);
                let irbData = irb && JSON.parse(irb).label;
                let typeOfInitialReview = initialReviewType && JSON.parse(initialReviewType).label;
                let funding = item[2];
                return {irb: irbData, investigatorFirstName, investigatorLastName, degree, protocol, projectKey: item[0], projectTitle, initialDate, funding, typeOfInitialReview, bioMedical, id: i};
            })
            setReportData(reportData);
        }).catch(error => console.log(error))
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
                ></TableComponent>
            </div>
        </div>
    )
}

export default LoadingWrapper(IRBReport)