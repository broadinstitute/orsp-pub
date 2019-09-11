import React from 'react'
import { saveAs } from 'file-saver';
import { utils, write } from 'xlsx';
import { formatExcelData } from "../util/TableUtil";

/**
 *
 * @param csvData Data to be exported to excel
 * @param columns Columns header's name
 * @param fileName  File name to be used when saving into the hhd
 * @param fileType MimeType to be used
 * @param fileExtension eg: .xlsx
 * @param hide String array, containing the data object's property names to be hidden from the export
 * @returns {*} An excel data form
 */
export const Export = ({csvData, columns, fileName, fileType, fileExtension, hide}) => {
  const exportToExcel = (csvData, columns, fileName, hide) => {
    let formatedCsvData = formatExcelData(csvData, columns, hide);
    let ws = utils.json_to_sheet(formatedCsvData,{skipHeader:true});
    const wb = { Sheets: { 'data': ws }, SheetNames: ['data'] };
    const excelBuffer = write(wb, { bookType: fileExtension, type: 'array' });
    const excelData = new Blob([excelBuffer], {type: fileType});
    saveAs(excelData, fileName + '.' + fileExtension);
  };

  return (
    <button className= { "btn buttonSecondary pull-right" } style= {{ marginLeft:'15px' }} onClick={(e) => exportToExcel(csvData, columns, fileName, hide)}>
      <i style={{ marginRight:'5px' }} className= { "fa fa-download" }></i> Excel</button>
  )
};
