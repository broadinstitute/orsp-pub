package org.broadinstitute.orsp.consent

import com.google.gson.Gson
import com.google.gson.GsonBuilder
import com.google.gson.JsonObject
import groovy.transform.AutoClone

import java.sql.Timestamp

@AutoClone
class ConsentResource {

    String consentId
    Boolean requiresManualReview
    String dataUseLetter
    JsonObject useRestriction
    String name
    String groupName
    String dulName
    Timestamp createDate
    Timestamp lastUpdate
    Timestamp sortDate
    String translatedUseRestriction
    DataUseDTO dataUse
    @Override
    String toString() {
        new GsonBuilder().setPrettyPrinting().create().toJson(this).toString()
    }

    static ConsentResource fromMap(Map json) {
        Gson gson = new GsonBuilder().create()
        ConsentResource resource = new ConsentResource()
        if (!json.get("consentId")) {
            throw new IllegalArgumentException("Invalid consent resource: ${json.toMapString()}")
        }
        if (json.get("consentId")) {
            resource.setConsentId(json.get("consentId").toString())
        }
        if (json.get("requiresManualReview")) {
            resource.setRequiresManualReview(json.get("requiresManualReview").asBoolean())
        }
        if (json.get("dataUseLetter")) {
            resource.setDataUseLetter(json.get("dataUseLetter").toString())
        }
        if (json.get("useRestriction")) {
            String useRestrictionString = gson.toJson(json.get("useRestriction"))
            JsonObject jsObj = gson.fromJson(useRestrictionString, JsonObject)
            resource.setUseRestriction(jsObj)
        }
        if (json.get("name")) {
            resource.setName(json.get("name").toString())
        }
        if (json.get("groupName")) {
            resource.setGroupName(json.get("groupName").toString())
        }
        if (json.get("dulName")) {
            resource.setDulName(json.get("dulName").toString())
        }
        if (json.get("createDate")) {
            resource.setCreateDate(new Date(json.get("createDate").asType(Long)).toTimestamp())
        }
        if (json.get("lastUpdate")) {
            resource.setLastUpdate(new Date(json.get("lastUpdate").asType(Long)).toTimestamp())
        }
        if (json.get("sortDate")) {
            resource.setSortDate(new Date(json.get("sortDate").asType(Long)).toTimestamp())
        }
        if (json.get("dataUse")) {
            Map dataUseMap = json.get("dataUse").asType(Map)
            resource.setDataUse(new DataUseDTO(dataUseMap))
        }
        resource
    }

}
