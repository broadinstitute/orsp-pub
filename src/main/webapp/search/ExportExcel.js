import React, {Component} from 'react';
import ReactExport from 'react-data-export';

const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;

class ExportExcel extends Component {
    render(props) {
        return (
            <div>
                <ExcelFile filename={this.props.filename} element={
                    <button className={this.props.buttonClassName}> <span>
                        <i className={this.props.spanClassName}></i>
                        Export to Excel</span>
                    </button>}>
                    <ExcelSheet dataSet={this.props.excelDataSet} name={this.props.sheetName} />
                </ExcelFile>
            </div>
        );
    }
}

export default ExportExcel;
