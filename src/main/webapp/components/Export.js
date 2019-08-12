import React from 'react'
import { saveAs } from 'file-saver';
import { utils, write } from 'xlsx';
import { formatExcelData } from "../util/TableUtil";

export const Export = ({csvData, columns, fileName, fileType, fileExtension}) => {

  const exportToExcel = (csvData, columns, fileName) => {
    let formatedCsvData = formatExcelData(csvData, columns);
    let ws = utils.json_to_sheet(formatedCsvData,{skipHeader:true});
    const wb = { Sheets: { 'data': ws }, SheetNames: ['data'] };
    const excelBuffer = write(wb, { bookType: fileExtension, type: 'array' });
    const excelData = new Blob([excelBuffer], {type: fileType});
    saveAs(excelData, fileName + '.' + fileExtension);
  };

  return (
    <button className= { "btn buttonSecondary pull-right" } style= {{ marginLeft:'15px' }} onClick={(e) => exportToExcel(csvData, columns, fileName)}>
      <i style={{ marginRight:'5px' }} className= { "fa fa-download" }></i> Excel</button>
  )
};
