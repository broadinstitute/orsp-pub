import * as FileSaver from 'file-saver';
import XLSX from 'sheetjs-style'

const Export = ({excelData, fileName, btnClassName}) => {

    const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    const fileExtension = '.xlsx';

    const exportToExcel = async () => {
        const ws = XLSX.utils.json_to_sheet(excelData);
        const wb = { Sheets: { 'data': ws }, SheetNames: ['data'] };
        const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
        const data = new Blob([excelBuffer], { type: fileType });
        FileSaver.saveAs(data, fileName + fileExtension)
    }

    return (
        <>
            <button
                className= { btnClassName }
                style= {{ marginLeft:'15px' }}
                onClick={e => {exportToExcel(fileName)}}
            >Export to Excel</button>
        </>
    )

}

export default Export

