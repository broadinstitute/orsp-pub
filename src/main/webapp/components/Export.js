import React from 'react'
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import { formatExcelData } from "../util/TableUtil";

export const Export = ({csvData, columns, fileName}) => {

  const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
  const fileExtension = '.xlsx';

  const exportToExcel = (csvData, columns, fileName) => {
    let formatedCsvData = formatExcelData(csvData, columns);
    let ws = XLSX.utils.json_to_sheet(formatedCsvData,{skipHeader:true});
    const wb = { Sheets: { 'data': ws }, SheetNames: ['data'] };
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const excelData = new Blob([excelBuffer], {type: fileType});
    FileSaver.saveAs(excelData, fileName + fileExtension);
  };

  return (
    <button className= { "btn buttonSecondary pull-right" } style= {{ marginLeft:'15px' }} onClick={(e) => exportToExcel(csvData, columns, fileName)}>
      <i style={{ marginRight:'5px' }} className= { "fa fa-download" }></i> Download Excel</button>
  )
};