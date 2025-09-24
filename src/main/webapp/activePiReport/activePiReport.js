import React from "react";
import "./activePiReport.css";
import { useEffect } from "react";
import { Reports } from "../util/ajax";
import { useState } from "react";
import LoadingWrapper from "../components/LoadingWrapper";
import { TableComponent } from "../components/TableComponent";
import {
  PI_LIST_REPORT,
  SIZE_PER_PAGE_LIST,
  PI_LIST_REPORT_DEFAULT_SORT,
} from "../util/ReportConstants";

const ActivePiReport = (props) => {
  const [broadPIList, setBroadPIList] = useState([]);

  useEffect(() => {
    props.showSpinner();
    const fetchPIList = async () => {
      try {
        const piList = await Reports.getAllPiList();
        setBroadPIList(piList.data);
        props.hideSpinner();
      } catch (error) {
        console.log(error);
        props.hideSpinner();
      }
    };
    fetchPIList();
  }, []);

  return (
    <div>
      <h1>List of all PIs</h1>
      <div className="pi-table">
        <TableComponent
          remoteProp={false}
          data={broadPIList}
          columns={PI_LIST_REPORT}
          keyField="user_name"
          search={true}
          fileName="Broad PI list Report"
          showPrintButton={false}
          sizePerPageList={SIZE_PER_PAGE_LIST}
          defaultSorted={PI_LIST_REPORT_DEFAULT_SORT}
          pagination={true}
          showExportButtons={true}
          showSearchBar={true}
          showPdfExport={false}
          showTotal={true}
        ></TableComponent>
      </div>
    </div>
  );
};

export default LoadingWrapper(ActivePiReport);
