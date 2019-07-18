import React from 'react'
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';

export const Export = ({csvData, fileName}) => {

  const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
  const fileExtension = '.xlsx';

  const exportToExcel = (csvData, fileName) => {
    const ws = XLSX.utils.json_to_sheet(csvData);
    const wb = { Sheets: { 'data': ws }, SheetNames: ['data'] };
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const data = new Blob([excelBuffer], {type: fileType});
    FileSaver.saveAs(data, fileName + fileExtension);
  };

  return (
    <button className= { "btn buttonSecondary pull-right" } style= {{ marginLeft:'15px' }} onClick={(e) => exportToExcel(csvData, fileName)}>
      <i style={{ marginRight:'5px' }} className= { "fa fa-download" }></i> Download Excel</button>
  )
};