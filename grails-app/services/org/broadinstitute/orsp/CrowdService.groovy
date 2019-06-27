package org.broadinstitute.orsp

import groovy.util.logging.Slf4j
import org.broadinstitute.orsp.config.CrowdConfiguration
import com.google.cloud.bigquery.BigQuery
import com.google.cloud.bigquery.BigQueryOptions
import com.google.cloud.bigquery.FieldValueList
import com.google.cloud.bigquery.Job
import com.google.cloud.bigquery.JobId
import com.google.cloud.bigquery.JobInfo
import com.google.cloud.bigquery.QueryJobConfiguration
import com.google.cloud.bigquery.TableResult
import com.google.auth.oauth2.GoogleCredentials;
import com.google.auth.oauth2.ServiceAccountCredentials;

@Slf4j
class CrowdService implements Status {

    UserService userService
    CrowdConfiguration crowdConfiguration

    private GoogleCredentials credential

    SubsystemStatus getStatus() {
        // TODO: implement big query status 
        SubsystemStatus status = new SubsystemStatus()
        status.ok = true
        status
    }

    /**
     * Find all valid users that exist in Crowd, but not in ORSP 
     * as a List of CrowdUserDetail objects
     *
     * @return List of CrowdUserDetail objects
     */
    @SuppressWarnings("GroovyAssignabilityCheck")
    List<CrowdUserDetail> findMissingUsers() {
        Collection<String> filterUsers = userService.findAllUserNames()
        getCrowdQueryUserDetails(filterUsers)
    }

    /**
     * Return a List of CrowdUserDetail objects from a single search query
     *
     * @param filterUsers Collection of userNames to filter on
     * @return List of CrowdUserDetail objects that do NOT exists on filterUsers
     */
    private List<CrowdUserDetail> getCrowdQueryUserDetails(Collection<String> filterUsers) {
        List<CrowdUserDetail> crowdUsers = new ArrayList<>()

        // Instantiate a client.
        BigQuery bigquery =
                BigQueryOptions.newBuilder()
                        .setCredentials(getCredentials())
                        .build()
                        .getService();

        QueryJobConfiguration queryConfig = QueryJobConfiguration
                .newBuilder("SELECT * FROM `broad-bits.data_warehouse.people`")
                .setUseLegacySql(false).build()

        // Create a job ID so that we can safely retry.
        JobId jobId = JobId.of(UUID.randomUUID().toString());
        Job queryJob = bigquery.create(JobInfo.newBuilder(queryConfig).setJobId(jobId).build())

        // Wait for the query to complete.
        queryJob = queryJob.waitFor()

        // Check for errors
        if (queryJob == null) {
            log.error("Job no longer exists")
        } else if (queryJob.getStatus().getError() != null) {
            log.error(queryJob.getStatus().getError().toString())

            // Get the results.
            TableResult result = queryJob.getQueryResults()

            // Print all pages of the results.
            for (FieldValueList row : result.iterateAll()) {
                String email = row.get("broad_email").getStringValue()
                String userName = row.get("username").getStringValue()
                if (email && !filterUsers.contains(userName)) {
                    String firstName = row.get("first_name").getStringValue()
                    String lastName = row.get("last_name").getStringValue()
                    String displayName = firstName + " " + lastName
                    crowdUsers.add(new CrowdUserDetail(userName: userName,
                            firstName: firstName, lastName: lastName,
                            displayName: displayName, email: email))

                    System.out.printf("NEW : %s, %s\n", userName, email)
                } else {
                    System.out.printf("OLD : %s, %s\n", userName, email)
                }
            }
            crowdUsers
        }
    }

    /**
     *
     * @return A GoogleCredentials from json secrets.
     */
    private GoogleCredentials getCredential() {

        if (!credential) {
            File credentialsPath = new File(crowdConfiguration.config);
            FileInputStream serviceAccountStream = new FileInputStream(credentialsPath);
            setCredential(ServiceAccountCredentials.fromStream(serviceAccountStream))
        }
        credential
    }

    void setCredential(GoogleCredentials credential) {
        this.credential = credential
    }

}
