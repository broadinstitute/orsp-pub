import React from 'react'
import { formatExcelData } from "../util/TableUtil";
import { JsonToExcel } from "./ExportExcelComponent";

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
export const Export = ({csvData, columns, fileName, fileType, fileExtension, hide, btnClassName}) => {

  let formatedCsvData
  formatedCsvData = formatExcelData(csvData, columns, hide);
  console.log(formatedCsvData);
  
  return (

    <JsonToExcel
        title={'Export Excel'}
        data={formatedCsvData}
        fileName={fileName}
        btnClassName={btnClassName}
    />
  )
  
};

