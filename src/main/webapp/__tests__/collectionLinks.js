import React from 'react';
import { configure, shallow } from "enzyme";
import Adapter from 'enzyme-adapter-react-16';
import CollectionLinks from '../collectionLinks/CollectionLinks'
import CollectionTable from '../collectionLinks/CollectionTable'
import ResponseView from '../collectionLinks/ResponseView'
import ProjectAutocomplete from '../util/ProjectAutocomplete'
import SampleCollectionAutocomplete from '../util/SampleCollectionAutocomplete'

configure({ adapter: new Adapter() });

describe('CollectionLinks', () => {

  let props;
  let collectionLinks;

  const component = () => {
    if (!collectionLinks) {
      collectionLinks = shallow(
        <CollectionLinks {...props} />
      )
    }
    return collectionLinks;
  };

  beforeEach(() => {
    props = {
      cclPostUrl: "http://localhost",
      cclSummariesUrl: "http://localhost",
      consentKeySearchUrl: "http://localhost",
      projectKeySearchUrl: "http://localhost",
      sampleSearchUrl: "http://localhost"
    }
  });

  it("page renders", () => {
    const linksComponent = component();
    const projectAutocompletes = linksComponent.find(ProjectAutocomplete);
    expect(projectAutocompletes.length).toBe(2);
    const sampleCollectionAutocompletes = linksComponent.find(SampleCollectionAutocomplete);
    expect(sampleCollectionAutocompletes.length).toBe(1);
  });

  it("data table with no records should not have table", () => {
    const tableComponent = component().find(CollectionTable);
    expect(tableComponent.length).toBe(0);
  });

  it("data table with records should have table", () => {
    const linksComponent = component();
    linksComponent.setState({
      data: [{project_key: "PROJECT_KEY", consent_key: "CONSENT_KEY", sample_collection_id: "SAMPLE_COLLECTION_ID"}],
      loading: false,
      loaded: true,
    });
    const tableComponent = linksComponent.find(CollectionTable);
    expect(tableComponent.length).toBe(1);
  });

  it("page renders errors", () => {
    const linksComponent = component();
    linksComponent.setState({
      data: [{project_key: "PROJECT_KEY", consent_key: "CONSENT_KEY", sample_collection_id: "SAMPLE_COLLECTION_ID"}],
      loading: false,
      loaded: true,
      errorResponse: { response: { data: ["Error 1", "Error 2"]}},
      successResponse: {}
    });
    const responseView = linksComponent.find(ResponseView).dive();
    expect(responseView.length).toBe(1);
    expect(responseView.state().isError).toBeTruthy();
  });

  it("page renders success", () => {
    const linksComponent = component();
    linksComponent.setState({
      data: [{project_key: "PROJECT_KEY", consent_key: "CONSENT_KEY", sample_collection_id: "SAMPLE_COLLECTION_ID"}],
      loading: false,
      loaded: true,
      errorResponse: {},
      successResponse: { data: ["Success 1", "Success 2"]}
    });
    const responseView = linksComponent.find(ResponseView).dive();
    expect(responseView.length).toBe(1);
    expect(responseView.state().isError).toBeFalsy();
  });

});
