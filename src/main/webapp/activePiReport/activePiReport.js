import React from "react";
import "./activePiReport.css";
import {useEffect} from "react";
import {Reports} from "../util/ajax";
import {useState} from "react";
import LoadingWrapper from "../components/LoadingWrapper";
import {TableComponent} from "../components/TableComponent";
import {
    PI_LIST_REPORT,
    SIZE_PER_PAGE_LIST,
    PI_LIST_REPORT_DEFAULT_SORT
} from "../util/ReportConstants";
import {ConfirmationDialog} from "../components/ConfirmationDialog";
import { h } from 'react-hyperscript-helpers';


const ActivePiReport = (props) => {
    const [broadPIList, setBroadPIList] = useState([]);
    const [rowToBeDeleted, setRowToBeDeleted] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        props.showSpinner();
        const fetchPIList = async () => {
            try {
                const piList = await Reports.getAllPiList();
                setBroadPIList(piList.data);
            } catch (error) {
                console.log(error);
            } finally {
                props.hideSpinner();
            }
        };
        fetchPIList();
    }, []);

    async function DeleteUser() {
        try {
            props.showSpinner();
            const res = await Reports.deletePiFromList('PI_report', 'user', 'user_name', rowToBeDeleted.user_name)
            deleteUserFromReport()
            setIsModalOpen(false)
        } catch (error) {
            console.log(error);
        } finally {
            props.hideSpinner();
        }
    }

    const deleteUserFromReport = () => {
        setBroadPIList((prevBroadPIList) =>
            prevBroadPIList.filter((user) => user.user_name !== rowToBeDeleted.user_name));
    }

    const columns = [...PI_LIST_REPORT, {
        dataField: '',
        text: 'Actions',
        sort: false,
        editable: false,
        headerStyle: {width: '20px', textAlign: 'center'},
        formatter: (cell, row, rowIndex, colIndex) =>
            <div className='delete-btn-align-center'>
                <i className="glyphicon glyphicon-trash methodButton"
                   title="Delete"
                   onClick={() => getDeletionEvent(row)}
                ></i>
            </div>


    }]

    const getDeletionEvent = (row) => {
        setRowToBeDeleted(row);
        setIsModalOpen(true)
    }

    return (
        <div>
            {rowToBeDeleted && <ConfirmationDialog
                closeModal={() => setIsModalOpen(false)}
                show={isModalOpen}
                handleOkAction={DeleteUser}
                title="PI removal confirmation"
                bodyText={ h('span', [
                    'Are you sure you want to remove ',
                    h('b', [rowToBeDeleted.display_name]),
                    ' from Broad PI Report?'
                ])}
                actionLabel="Yes"
            />
            }
            <h1>List of all PIs</h1>
            <div className="pi-table">
                <TableComponent
                    remoteProp={false}
                    data={broadPIList}
                    columns={columns}
                    keyField="user_name"
                    search={true}
                    fileName="Broad PI list Report"
                    showPrintButton={false}
                    sizePerPageList={SIZE_PER_PAGE_LIST}
                    defaultSorted={PI_LIST_REPORT_DEFAULT_SORT}
                    pagination={true}
                    showExportButtons={true}
                    showSearchBar={true}
                    showPdfExport={false}
                    showTotal={true}
                ></TableComponent>
            </div>
        </div>
    );
};

export default LoadingWrapper(ActivePiReport);

