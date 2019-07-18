import React from 'react'
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';

export const Export = ({csvData, fileName}) => {

  const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
  const fileExtension = '.xlsx';

  const exportToExcel = (csvData, fileName) => {
    let ws = XLSX.utils.json_to_sheet(csvData,{skipHeader:true});
    // let range = XLSX.utils.decode_range(ws['!ref'])
    let noCols = XLSX.utils.decode_range(ws['!ref']).e.c; // No. of cols
    let noRows = XLSX.utils.decode_range(ws['!ref']).e.r; // No. of rows
    let wsCols = [];
    let wsRows = [];

    for (let i = 0; i <= noCols; i++) {
      if (i === 0) wsCols.push({hidden: true});
      wsCols.push({wpx: 150, wch: 3,});
      // https://github.com/SheetJS/js-xlsx/blob/master/types/write.ts
      // ws['A'+i].s({fill:{patternType: "solid", bgColor:"055eed"}})
    }

    for (let j = 0; j <= noRows; j++) {
      wsRows.push({hpx: 20});
    }

    // for(let R = range.s.r; R <= range.e.r; ++R) {
    //   for(let C = range.s.c; C <= range.e.c; ++C) {
    //     let cell_address = {c:C, r:R};
    //     console.log("address?", cell_address)
    //     /* if an A1-style address is needed, encode the address */
    //     let cell_ref = XLSX.utils.encode_cell(cell_address);
    //   }
    // }


    // https://www.npmjs.com/package/xlsx-style
    ws['!printHeader'] = [1,1];
    // ws['!colBreaks'] = [1,1];
    // ws['!rowBreaks'] =
    ws['!margins'] =  { left:10.0, right:10.0, top:10.0, bottom:1.0, header:0.5, footer:0.5 };
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