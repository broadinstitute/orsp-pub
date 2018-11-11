import React from 'react';
import { configure, shallow } from "enzyme";
import Adapter from 'enzyme-adapter-react-16';
import CollectionTable from '../collectionLinks/CollectionTable'
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';

configure({ adapter: new Adapter() });

describe('CollectionTable', () => {

    let props;
    let collectionTable;

    const component = () => {
        if (!collectionTable) {
            collectionTable = shallow(
                <CollectionTable {...props} />
            )
        }
        return collectionTable;
    };

    beforeEach(() => {
        props = {
            data: []
        }
    });

    it("page renders", () => {
        const divs = component().find("div");
        expect(divs.length).toBeGreaterThan(0);
    });

    it("data table loads data", () => {
        props = {
            data: [
                {project_key: "PROJECT_KEY", consent_key: "CONSENT_KEY", sample_collection_id: "SAMPLE_COLLECTION_ID"}
                ]
        };
        const tableComponent = component().find(BootstrapTable);
        const tableHeaderComponent = tableComponent.find(TableHeaderColumn);
        expect(tableComponent.length).toBe(1);
        expect(tableHeaderComponent.length).toBe(3);
        expect(tableHeaderComponent.get(0).props.dataField).toBe("project_key");
        expect(tableHeaderComponent.get(1).props.dataField).toBe("consent_key");
        expect(tableHeaderComponent.get(2).props.dataField).toBe("sample_collection_id");
    });

});
