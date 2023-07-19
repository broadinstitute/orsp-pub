package org.broadinstitute.orsp

import com.google.cloud.bigquery.BigQueryException
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
     * @return List of BroadUser from BigQuery
     */
    private List<BroadUser> getBroadUserDetails() {
        List broadUsers = new ArrayList()
        try{

            // Instantiate a client.
            BigQuery bigquery =
                    BigQueryOptions.newBuilder()
                            .setCredentials(getCredential())
                            .build()
                            .getService()

            QueryJobConfiguration queryConfig = QueryJobConfiguration
                    .newBuilder("SELECT username, email, full_name FROM `broad-gaia-dev.gaia_shared_views.orsp_people_view`")
                    .setUseLegacySql(false)
                    .build()

            // Create a job ID .
            JobId jobId = JobId.of(UUID.randomUUID().toString());
            Job queryJob = bigquery.create(JobInfo.newBuilder(queryConfig).setJobId(jobId).build())

            // Wait for the query to complete.
            queryJob = queryJob.waitFor()

            // Check for errors
            if (queryJob == null) {
                log.error("Job no longer exists")
                throw new RuntimeException("Job no longer exists")
            } else if (queryJob.getStatus().getError() != null) {
                log.error(queryJob.getStatus().getError().toString())
                throw new RuntimeException(queryJob.getStatus().getError().toString());
            } else {
                // Get the results.
                TableResult result = queryJob.getQueryResults()

                // iterate over results to build BroadUser list
                for (FieldValueList row : result.iterateAll()) {
                    String email = row.get("email").getStringValue()
                    String userName = row.get("username").getStringValue()
                    String displayName = row.get("full_name").getStringValue()
                    broadUsers.add(new BroadUser(userName: userName, displayName: displayName, email: email))
                }
            }

        } catch (BigQueryException | InterruptedException e) {
            log.error("Error in executing BigQuery " + e.toString());
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
