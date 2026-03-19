import { Component } from "react";
import { hh, div, ins, del, label, p, span, i } from "react-hyperscript-helpers";
import { Panel } from "../components/Panel";
import { isEmpty, getDateString } from "../util/Utils";

const ProjectChangeComparision = hh(
  class ProjectChangeComparison extends Component {
    constructor(props) {
      super(props);
      this.state = {};
    }

    getUsersArray(array) {
      let usersArray = [];
      if (array !== undefined && array !== null && array.length > 0) {
        array.map(element => {
          usersArray.push({
            key: element.userName,
            label: element.displayName + " (" + element.emailAddress + ") ",
            value: element.displayName
          });
        });
      }
      return usersArray;
    }

    getVersionedKeyPersonArray(keyPersons) {
      if (!keyPersons || !keyPersons.length) return [];

      return keyPersons.map(keyPerson => ({
        current:{
          name: this.getUsersArray([keyPerson])[0] || null,
          role: keyPerson.role ? { label: keyPerson.role, value: keyPerson.role.split(" ").join("_").toLowerCase() } : '',
          otherRole: keyPerson.otherRole || ''
        },
        future:{
          name: this.getUsersArray([keyPerson])[0] || null,
          role:keyPerson.role ? { label: keyPerson.role, value: keyPerson.role.split(" ").join("_").toLowerCase() } : '',
          otherRole: keyPerson.otherRole || ''
        }
      }));
    } 

    ensureWrappedKeyPersons = (arr) => {
      if (!Array.isArray(arr) || arr.length === 0) return [];
      const first = arr[0];
      if (first && (first.current || first.future)) return arr;
      // Flat API shape -> wrapped shape
      return this.getVersionedKeyPersonArray(arr);
    };

    normalizeNameOption = (nameField) => {
      if (!nameField) return null;
      if (Array.isArray(nameField)) return nameField[0] || null;
      if (typeof nameField === 'object') return nameField;
      return null;
    };

    getKeyPersonRowKey = (row, fallbackKey) => {
      const snap = (row && row.future) ? row.future : (row && row.current) ? row.current : row;
      const opt = this.normalizeNameOption(snap && snap.name);
      return (opt && opt.key) || (opt && opt.label) || (row && row._uiKey) || fallbackKey;
    };

    compareData = (newData, oldData, dataType="") => {
      // Handle array types before converting to empty string
      if (dataType === "fundings") {
        return this.getFundingComparison(newData || [], oldData || []);
      } else if (dataType === "keyPersons") {
        return this.getKeyPersonsComparison(
          this.ensureWrappedKeyPersons(newData || []),
          this.ensureWrappedKeyPersons(oldData || [])
        );
      }

      newData = isEmpty(newData) ? "" : newData;
      oldData = isEmpty(oldData) ? "" : oldData;

      if (dataType === "jsonArray") {
        newData = !isEmpty(newData) ? newData.map(element => element.label).join(", ") : null;
        oldData = !isEmpty(oldData) ? oldData.map(element => element.label).join(", ") : null;
      } else if (dataType === "json") {
        newData = !isEmpty(newData) ? newData.label : null;
        oldData = !isEmpty(oldData) ? oldData.label : null;
      } else if (dataType === "irbReviewedProtocol") {
        newData = this.getIrbReviewDescription(newData);
        oldData = this.getIrbReviewDescription(oldData);
      }

      if (newData === "true") newData = "Yes"
      if (oldData === "true") oldData = "Yes"
      if (newData === "false") newData = "No"
      if (oldData === "false") oldData = "No"

      if (newData !== oldData) {
        return div([
          del({isRendered: !isEmpty(oldData)}, [oldData]), 
          ins({isRendered: !isEmpty(newData)}, [newData])
        ]);
      } else {
        return newData || "--";
      }
    };

    getIrbReviewDescription = (data) => {
      switch(data) {
        case "irbReviewedProtocol":
          return "This is a project that will be/has been reviewed by an IRB, with Broad listed as a study site.";
        case "sensitiveInformationSource":
          return "This project will include an intervention/interaction with subjects, or identifiable information or identifiable private biospecimens will be used.";
        case "secondaryResearch":
          return "This project is secondary research using data or biospecimens not collected specifically for this study.";
        case "privateInformation":
          return "This is not a secondary use study. The Broad scientist/team will obtain coded private information/biospecimens from another institution that retains a link to identifiers, ', b(['AND ']), ' be unable to readily ascertain the identity of subjects, ', b(['AND ']), 'will not receive a direct federal grant/award at Broad.";
      };
    }

    getFundingComparison = (newData, oldData) => {
      const headers = [
          div({ className: "col-lg-4 col-md-4 col-sm-4 col-12" }, [label({ className: "inputFieldLabel" }, ["Funding Source"])]),
          div({ className: "col-lg-4 col-md-4 col-sm-4 col-12" }, [label({ className: "inputFieldLabel" }, ["Sponsor Name/Payer"])]),
          div({ className: "col-lg-4 col-md-4 col-sm-4 col-12" }, [label({ className: "inputFieldLabel" }, ["Award Number/Identifier"])]),
      ];
  
      const maxLength = Math.max(newData.length, oldData.length);
  
      const rows = Array.from({ length: maxLength }, (_, index) => {
          const oldItem = oldData[index] || {};
          const newItem = newData[index] || {};
  
          const oldSource = oldItem.current && oldItem.current.source ? oldItem.current.source.label : "";
          const newSource = newItem.current && newItem.current.source ? newItem.current.source.label : "";
  
          const oldSponsor = oldItem.current && oldItem.current.sponsor ? oldItem.current.sponsor : "";
          const newSponsor = newItem.current && newItem.current.sponsor ? newItem.current.sponsor : "";
  
          const oldIdentifier = oldItem.current && oldItem.current.identifier ? oldItem.current.identifier : "";
          const newIdentifier = newItem.current && newItem.current.identifier ? newItem.current.identifier : "";
  
          return div({ className: "row" }, [
              div({ className: "col-lg-4 col-md-4 col-sm-4 col-12" }, [
                  oldSource && !newSource ? del([oldSource]) : 
                  !oldSource && newSource ? ins([newSource]) : 
                  oldSource !== newSource ? [del([oldSource]), ins([newSource])] : newSource
              ]),
              div({ className: "col-lg-4 col-md-4 col-sm-4 col-12" }, [
                  oldSponsor && !newSponsor ? del([oldSponsor]) : 
                  !oldSponsor && newSponsor ? ins([newSponsor]) : 
                  oldSponsor !== newSponsor ? [del([oldSponsor]), ins([newSponsor])] : newSponsor
              ]),
              div({ className: "col-lg-4 col-md-4 col-sm-4 col-12" }, [
                  oldIdentifier && !newIdentifier ? del([oldIdentifier]) : 
                  !oldIdentifier && newIdentifier ? ins([newIdentifier]) : 
                  oldIdentifier !== newIdentifier ? [del([oldIdentifier]), ins([newIdentifier])] : newIdentifier
              ]),
          ]);
      });
  
      return div({ className: "row" }, [...headers, ...rows]);
    };

    getKeyPersonsComparison = (newData, oldData) => {
      const headers = [
          div({ className: "col-lg-3 col-md-3 col-sm-3 col-12" }, [label({ className: "inputFieldLabel" }, ["Name"])]),
          div({ className: "col-lg-3 col-md-3 col-sm-3 col-12" }, [label({ className: "inputFieldLabel" }, ["Role"])]),
          div({ className: "col-lg-3 col-md-3 col-sm-3 col-12" }, [label({ className: "inputFieldLabel" }, ["Role (Other)"])]),
          div({ className: "col-lg-3 col-md-3 col-sm-3 col-12" }, [label({ className: "inputFieldLabel" }, ["Date Added"])]),
      ]

      const newArr = Array.isArray(newData) ? newData : [];
      const oldArr = Array.isArray(oldData) ? oldData : [];

      const newKeyed = newArr.map((row, idx) => ({
        key: this.getKeyPersonRowKey(row, `new-${idx}`),
        row
      }));
      const oldKeyed = oldArr.map((row, idx) => ({
        key: this.getKeyPersonRowKey(row, `old-${idx}`),
        row
      }));

      const newMap = new Map(newKeyed.map(it => [it.key, it.row]));
      const oldMap = new Map(oldKeyed.map(it => [it.key, it.row]));

      const orderedKeys = [
        ...newKeyed.map(it => it.key),
        ...oldKeyed.map(it => it.key).filter(k => !newMap.has(k))
      ];

      const showDiff = (oldVal, newVal) => {
        const o = oldVal || "";
        const n = newVal || "";
        if (o === n) return n || "--";
        return [
          del({ isRendered: !isEmpty(o) }, [o]),
          ins({ isRendered: !isEmpty(n) }, [n]),
        ];
      };

      const rows = orderedKeys.map((k) => {
        const oldItem = oldMap.get(k) || null;
        const newItem = newMap.get(k) || null;

        const oldSnap = oldItem && (oldItem.current || oldItem.future) ? (oldItem.current || oldItem.future) : {};
        const newSnap = newItem && (newItem.future || newItem.current) ? (newItem.future || newItem.current) : {};

        const oldNameOpt = this.normalizeNameOption(oldSnap.name);
        const newNameOpt = this.normalizeNameOption(newSnap.name);
        const oldName = oldNameOpt && oldNameOpt.label ? oldNameOpt.label : "";
        const newName = newNameOpt && newNameOpt.label ? newNameOpt.label : "";

        const oldRole = oldSnap.role && oldSnap.role.label ? oldSnap.role.label : "";
        const newRole = newSnap.role && newSnap.role.label ? newSnap.role.label : "";

        const oldOtherRole = oldSnap.otherRole || "";
        const newOtherRole = newSnap.otherRole || "";

        const oldRoleIsOther = oldSnap.role && oldSnap.role.value === "other";
        const newRoleIsOther = newSnap.role && newSnap.role.value === "other";
        const showRoleOther =
          oldRoleIsOther || newRoleIsOther || !isEmpty(oldOtherRole) || !isEmpty(newOtherRole);
        const addedDate = newItem && newItem.current && newItem.current.updatedDate;
        return div({ className: "row",style: {paddingBottom: '10px'}, key: k }, [
          div({ className: "col-lg-3 col-md-3 col-sm-3 col-12" }, [
            showDiff(oldName, newName)
          ]),
          div({ className: "col-lg-3 col-md-3 col-sm-3 col-12" }, [
            showDiff(oldRole, newRole)
          ]),
          div({
            className: "col-lg-3 col-md-3 col-sm-3 col-12",
          }, [
            showDiff(oldOtherRole, newOtherRole)
          ]),
          div({
            className: "col-lg-3 col-md-3 col-sm-3 col-12",
          }, [
             getDateString(addedDate, 'mmddyyyy')
          ])
        ]);
      });

      return div({ className: "row" }, [...headers, ...rows]);
    };

    render() {
      return div({}, [
        div({ id: "principalInvestigator" }, [
          Panel({ title: "Key Personnel" }, [
            div([
              label({className: 'inputFieldLabel'}, ["Broad Principal Investigator (PI) Responsible for Project Conduct and Oversight"]),
              p({}, [
                this.compareData(this.props.formData.piList, this.props.versionedData.piList, "jsonArray"),
              ]),
            ]),
            // div([
            //   label({className: 'inputFieldLabel'}, ["Additional Broad Co-Investigators"]),
            //   p({}, [
            //     this.compareData(this.props.formData.additionalPi, this.props.versionedData.additionalPi, "jsonArray"),
            //   ]),
            // ]),
            div([
              label({className: 'inputFieldLabel'}, [" PI’s Primary Institutional Affiliation"]),
              p({}, [
                this.compareData(this.props.formData.projectExtraProps.affiliations, this.props.versionedData.projectExtraProps.affiliations, "json"),
              ]),
            ]),

            div({
              isRendered: !isEmpty(this.props.formData.projectExtraProps.affiliations) && 
                this.props.formData.projectExtraProps.affiliations.value === "other"
            }, [
              label({className: 'inputFieldLabel'}, ["Primary Investigator Other Affiliation"]),
              p({}, [
                this.compareData(this.props.formData.projectExtraProps.affiliationOther, this.props.versionedData.projectExtraProps.affiliationOther),
              ])
            ]),

            div([
              label({className: 'inputFieldLabel'}, ["Key Study Contact (will receive email notifications about this project)"]),
              p({}, [
                this.compareData(this.props.formData.pmList, this.props.versionedData.pmList, "jsonArray"),
              ]),
            ]),
            // div([
            //   label({className: 'inputFieldLabel'}, ["Additional Broad Study Staff &/or Broad individuals"]),
            //   p({}, [
            //     this.compareData(this.props.formData.additionalPm, this.props.versionedData.additionalPm, "jsonArray"),
            //   ]),
            // ]),
          ]),

          div({ id: "funding" }, [
            Panel({ title: "Funding" }, [
              div([
                this.compareData(this.props.formData.fundings, this.props.versionedData.fundings, "fundings")
              ]),
            ])
          ]),

          div({ 
            id: "keyPersons",
            isRendered: (this.props.formData.keyPersons && this.props.formData.keyPersons.length > 0) ||
                        (this.props.versionedData.keypersons && this.props.versionedData.keypersons.length > 0)
          }, [
            Panel({ title: "Broad Study Staff" }, [
              div([
                this.compareData(
                  this.props.formData.keyPersons,
                  this.getVersionedKeyPersonArray(this.props.versionedData.keypersons),
                  "keyPersons"
                )
              ]),
            ])
          ]),

          div({ id: "projectSummary" }, [
            Panel({ title: "Project Summary" }, [

              div([
                label({className: 'inputFieldLabel'}, ["Broad study activities"]),
                p({}, [
                  this.compareData(this.props.formData.description, this.props.versionedData.issue.description),
                ]),
              ]),

              // div([
              //   label({className: 'inputFieldLabel'}, ["Broad individuals who require access to this project record"]),
              //   p({}, [
              //     this.compareData(this.props.formData.collaborators, this.props.versionedData.collaborators, "jsonArray"),
              //   ]),
              // ]),

              div([
                label({className: 'inputFieldLabel'}, ["Title of project/protocol"]),
                p({}, [
                  this.compareData(this.props.formData.projectExtraProps.projectTitle, this.props.versionedData.projectExtraProps.projectTitle),
                ]),
              ]),

              div([
                label({className: 'inputFieldLabel'}, ["Protocol # at Broad IRB-of-record"]),
                p({}, [
                  this.compareData(this.props.formData.projectExtraProps.protocol, this.props.versionedData.projectExtraProps.protocol),
                ]),
              ]),

              div([
                label({className: 'inputFieldLabel'}, ["IRB-of-record"]),
                p({}, [
                  this.compareData(this.props.formData.projectExtraProps.irb.label, this.props.versionedData.projectExtraProps.irb.label),
                ]),
              ]),
            ]),

            div({ id: "determinationQuestions" }, [
              Panel({ title: "Determination Questions" }, [
                
                div({isRendered: !isEmpty(this.props.formData.projectExtraProps.feeForService)}, [
                  label({className: 'inputFieldLabel'}, ["Is this a “fee for service” project? "]),
                  p([
                    this.compareData(this.props.formData.projectExtraProps.feeForService, this.props.versionedData.projectExtraProps.feeForService),
                  ]),
                ]),

                div({isRendered: !isEmpty(this.props.formData.projectExtraProps.broadInvestigator)}, [
                  label({className: 'inputFieldLabel'}, ["Is a Broad scientist(s) conducting research (generating or contributing to generalizable knowledge, with the intention to publish results)? "]),
                  p([
                    this.compareData(this.props.formData.projectExtraProps.broadInvestigator, this.props.versionedData.projectExtraProps.broadInvestigator),
                  ])
                ]),

                div({isRendered: this.props.formData.projectExtraProps.broadInvestigator == "false" || this.props.formData.projectExtraProps.broadInvestigator == false}, [
                  label({className: 'inputFieldLabel'}, ["Please provide a rationale for why this project/work would not be considered as research "]),
                  p([
                    this.compareData(this.props.formData.projectExtraProps.broadInvestigatorTextValue, this.props.versionedData.projectExtraProps.broadInvestigatorTextValue),
                  ]),
                ]),

                div({isRendered: !isEmpty(this.props.formData.projectExtraProps.subjectsDeceased)}, [
                  label({className: 'inputFieldLabel'}, ["Does this project  involve only specimens or data from deceased individuals? "]),
                  p([
                    this.compareData(this.props.formData.projectExtraProps.subjectsDeceased, this.props.versionedData.projectExtraProps.subjectsDeceased),
                  ]),
                ]),

                div({isRendered: !isEmpty(this.props.formData.projectExtraProps.sensitiveInformationSource)}, [
                  label({className: 'inputFieldLabel'}, [span(['Will specimens or data be provided to the Broad ', i({style: { 'color': '#0A3356' }}, ['without ']), 'identifiable information? '])]),
                  p([
                    this.compareData(this.props.formData.projectExtraProps.sensitiveInformationSource, this.props.versionedData.projectExtraProps.sensitiveInformationSource),
                  ]),
                ]),

                div({isRendered: !isEmpty(this.props.formData.projectExtraProps.isIdReceive)}, [
                  label({className: 'inputFieldLabel'}, ["Does the sample or data provider have access to identifiers? "]),
                  p([
                    this.compareData(this.props.formData.projectExtraProps.isIdReceive, this.props.versionedData.projectExtraProps.isIdReceive),
                  ]),
                ]),

                div({isRendered: !isEmpty(this.props.formData.projectExtraProps.isCoPublishing)}, [
                  label({className: 'inputFieldLabel'}, ["Will anyone at the Broad be co-publishing or jointly analyzing data with the sample/data provider who has access to identifiable information about the original sample/data donor? "]),
                  p([
                    this.compareData(this.props.formData.projectExtraProps.isCoPublishing, this.props.versionedData.projectExtraProps.isCoPublishing),
                  ]),
                ]),

                div({
                  isRendered: !isEmpty(this.props.formData.projectExtraProps.irbReviewedProtocol) && 
                      (this.props.formData.projectExtraProps.irbReviewedProtocol === 'secondaryResearch' || 
                      this.props.formData.projectExtraProps.irbReviewedProtocol === 'sensitiveInformationSource' || 
                      this.props.formData.projectExtraProps.irbReviewedProtocol === 'irbReviewedProtocol' || 
                      this.props.formData.projectExtraProps.irbReviewedProtocol === 'privateInformation')
                }, [
                  label({className: 'inputFieldLabel'}, ["Please select the option which best describes your research "]),
                  p([
                    this.compareData(this.props.formData.projectExtraProps.irbReviewedProtocol, this.props.versionedData.projectExtraProps.irbReviewedProtocol, "irbReviewedProtocol"),
                  ]),
                ]),

                div({isRendered: !isEmpty(this.props.formData.projectExtraProps.humanSubjects)}, [
                  label({className: 'inputFieldLabel'}, ["Is this a project that only includes interactions involving ", span({style: {fontWeight: 'bold', textDecoration: 'underline'}}, ["surveys or interview procedures"]), " (including visual or auditory recording) "]),
                  p([
                    this.compareData(this.props.formData.projectExtraProps.humanSubjects, this.props.versionedData.projectExtraProps.humanSubjects),
                  ]),
                ]),
                
                div({isRendered: !isEmpty(this.props.formData.projectExtraProps.interactionSource)}, [
                  label({className: 'inputFieldLabel'}, ["Does the statement below accurately describe your project? "]),
                  p([
                    this.compareData(this.props.formData.projectExtraProps.interactionSource, this.props.versionedData.projectExtraProps.interactionSource),
                  ]),
                ])
                
              ])
            ]),
          ]),
        ]),
      ]);
    }
  }
);

export default ProjectChangeComparision;
