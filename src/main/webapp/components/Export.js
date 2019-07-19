import React from 'react'
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';

export const Export = ({csvData, fileName}) => {

  const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
  const fileExtension = '.xlsx';

  const exportToExcel = (csvData, fileName) => {
    let ws = XLSX.utils.json_to_sheet(csvData,{skipHeader:true});
    let noCols = XLSX.utils.decode_range(ws['!ref']).e.c; // No. of cols
    let noRows = XLSX.utils.decode_range(ws['!ref']).e.r; // No. of rows
    let wsCols = [];
    let wsRows = [];
    for (let i = 0; i < noCols; i++) {
      if (i === 0) wsCols.push({hidden: true});
      wsCols.push({wpx: 150, wch: 3,});
    }
    for (let j = 0; j <= noRows; j++) {
      wsRows.push({hpx: 20});
    }
    ws['!cols'] = wsCols;
    ws['!rows'] = wsRows;
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