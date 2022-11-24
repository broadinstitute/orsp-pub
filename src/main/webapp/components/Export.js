import React from 'react'
import { formatExcelData } from "../util/TableUtil";
import { read, writeFileXLSX } from "xlsx";
import * as XLSX from 'xlsx/xlsx.mjs';
import { Readable } from 'stream';
import * as cpexcel from 'xlsx/dist/cpexcel.full.mjs';
import { set_cptable } from "xlsx";
import * as cptable from 'xlsx/dist/cpexcel.full.mjs';

XLSX.stream.set_readable(Readable);
XLSX.set_cptable(cpexcel);
set_cptable(cptable);

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
    console.log(formatedCsvData);
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(formatedCsvData);
    XLSX.utils.book_append_sheet(workbook, worksheet, fileName);
    let data = XLSX.write(workbook, { type: "array", bookType: "xlsx" });
    XLSX.writeFileXLSX(workbook, fileName + fileExtension);

    // let ws = utils.json_to_sheet(formatedCsvData,{skipHeader:true});
    // const wb = { Sheets: { 'data': ws }, SheetNames: ['data'] };
    // const excelBuffer = write(wb, { bookType: fileExtension, type: 'array' });
    // const excelData = new Blob([excelBuffer], {type: fileType});
    // saveAs(excelData, fileName + '.' + fileExtension);
  };

  return (
    <button className= { "btn buttonSecondary pull-right" } style= {{ marginLeft:'15px' }} onClick={(e) => exportToExcel(csvData, columns, fileName, hide)}>
      <i style={{ marginRight:'5px' }} className= { "fa fa-download" }></i> Excel</button>
  )
  
};
