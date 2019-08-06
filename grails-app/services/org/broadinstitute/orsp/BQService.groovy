package org.broadinstitute.orsp

import groovy.util.logging.Slf4j
import org.broadinstitute.orsp.config.BQConfiguration
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
class BQService {

    UserService userService
    BQConfiguration bqConfiguration

    private GoogleCredentials credential

    /**
     * Find all users that exist in Broad's users (BigQuery) 
     *
     * @return List of BroadUser objects
     */
    @SuppressWarnings("GroovyAssignabilityCheck")
    List<BroadUser> findMissingUsers() {
        Collection<String> filterUsers = userService.findAllUserNames()
        getNewOrspUsers(filterUsers, getBroadUserDetails())
    }

    /**
     * Return a List of BroadUser objects from a single search query
     *
     * @param filterUsers Collection of userNames to filter on
     * @return List of BroadUser objects that do NOT exists on filterUsers
     */
    private List<BroadUser> getBroadUserDetails() {
        List broadUsers = new ArrayList()

        // Instantiate a client.
        BigQuery bigquery =
                BigQueryOptions.newBuilder()
                        .setCredentials(getCredential())
                        .build()
                        .getService()

        QueryJobConfiguration queryConfig = QueryJobConfiguration
                .newBuilder("SELECT username, broad_email, first_name, last_name FROM `broad-bits.data_warehouse.people`")
                .setUseLegacySql(false).build()

        // Create a job ID .
        JobId jobId = JobId.of(UUID.randomUUID().toString());
        Job queryJob = bigquery.create(JobInfo.newBuilder(queryConfig).setJobId(jobId).build())

        // Wait for the query to complete.
        queryJob = queryJob.waitFor()

        // Check for errors
        if (queryJob == null) {
            log.error("Job no longer exists")
        } else if (queryJob.getStatus().getError() != null) {
            log.error(queryJob.getStatus().getError().toString())
        } else {
            // Get the results.
            TableResult result = queryJob.getQueryResults()
            // iterate over results to build BroadUser list
            for (FieldValueList row : result.iterateAll()) {
                String email = row.get("broad_email").getStringValue()
                String userName = row.get("username").getStringValue()
                String firstName = row.get("first_name").getStringValue()
                String lastName = row.get("last_name").getStringValue()
                String displayName = firstName + " " + lastName
                broadUsers.add(new BroadUser(userName: userName, displayName: displayName, email: email))
            }
        }
        broadUsers
    }

    /**
     * Return a List of BroadUser objects from a single search query
     *
     * @param orspUsers Collection of userNames to filter on
     * @param bigQueryUsers Collection of BroadUser from BigQuery
     * @return List of BroadUser objects that do NOT exists on orspUsers
     */
    private List<BroadUser> getNewOrspUsers(Collection<String> orspUsers, List<BroadUser> bigQueryUsers) {
        bigQueryUsers.findAll { !orspUsers.contains( it.userName) }
    }

    /**
     *
     * @return A GoogleCredentials from json secrets.
     */
    private GoogleCredentials getCredential() {
        if (!credential) {
            File credentialsPath = new File(bqConfiguration.config);
            FileInputStream serviceAccountStream = new FileInputStream(credentialsPath);
            setCredential(ServiceAccountCredentials.fromStream(serviceAccountStream))
        }
        credential
    }

    void setCredential(GoogleCredentials credential) {
        this.credential = credential
    }

}
