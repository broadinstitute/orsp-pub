import React, { useEffect, useState } from "react";
import LoadingWrapper from "../components/LoadingWrapper";
import { Reports } from "../util/ajax";
import { TableComponent } from "../components/TableComponent";
import { defaultSorted, PII_PHI_REPORT_COLUMNS, SIZE_PER_PAGE_LIST } from "../util/ReportConstants";

const PIIReport = () => {
    
    const [piiReportData, setPiiReportData] = useState([]);

    useEffect(() => {
        Reports.getPiiReport().then(data => {
            setPiiReportData(data.data);
        })
    }, []);

    const exportTable = (action) => {
        let cols = IRB_REPORT_COLUMNS.filter(el => el.dataField !== 'id');
        let elementsArray = formatDataPrintableFormat(reportData, cols);
        const headerText = 'PII PHI Report';
        const columnsWidths = ['*', '*', '*', '*', '*', '*', '*', '*', '*', '*', '*', '*', '*', '*'];
        exportData(action,'PII PHI Report', elementsArray, columnsWidths, headerText, columnsWidths, 'A2', 'landscape');
    };

    return (
        <React.Fragment>
            <h1>PII/PHI Report</h1>
            <TableComponent 
                remoteProp= {false}
                data= {piiReportData}
                columns= {PII_PHI_REPORT_COLUMNS}
                keyField= 'id'
                search= {true}
                fileName= 'PII PHI Report'
                showPrintButton= {false}
                sizePerPageList= {SIZE_PER_PAGE_LIST}
                printComments= {() => exportTable('print')}
                defaultSorted= {defaultSorted}
                pagination= {true}
                showExportButtons= {true}
                showSearchBar= {true}
                showPdfExport= {false}
                showTotal= {true}
            />
        </React.Fragment>
    )

}

export default LoadingWrapper(PIIReport);
