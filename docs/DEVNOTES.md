# Git Secrets
To help protect you from accidentally committing secrets, we recommend that 
you download and install git-secrets. 

Once installed, you can add the following patterns:

```
git secrets --add --allowed grails-app/assets/javascripts/search.js
git secrets --add 'CLIENT_ID\s*=\s*.+'
git secrets --add 'CLIENT_SECRET\s*=\s*.+'
git secrets --add --allowed 'REPLACE_ME'
```

# Grails Structure

This project began as a Grails 2 application and has been upgraded incrementally as new versions have come out.
As a result, some areas of the code are less up to date than others. Please consider moving to the latest best
practices with any future development work.

* Standard App Layout: http://docs.grails.org/latest/guide/single.html
* Services are broken up into transactional and non-transactional. 
  * Try to keep them small and domain/service specific.
  * Add common functionality via traits (e.g., `UserInfo`)
* Domain Classes: Keep small and do not add any business logic or service class injection
  * `Issue` is the complicated case due to the migration from a Jira-based model.
* Controllers: Similar to services, keep small and focused.
  * Moving to a more ajax-based approach to facilitate a more abstracted UI.
  * Consider making more generic REST-based API controllers (e.g., `ReportController`)
* API Development: See what [Google](https://cloud.google.com/apis/design/) is doing and use
that as best practice guidelines. Also, we use 
[DataTables.net](https://datatables.net/manual/server-side) so we are now supporting their 
pagination API to some degree (see Funding Reports). All new services should be written with 
this in mind and revisions to existing functionality should try to follow an API-based pattern 
instead of the traditional `controller`-`gsp` model. This will allow us to use a different UI
implementation should be ever get there (react/angular/etc.).  
  
# Local Development
* Java 8
* Grails 3.3.8: https://grails.org/download.html
* Gradle 3.5
* Groovy 2.4.11
* homebrew:
  - ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"
  - git
  - grails
* Requires Docker and Vault for generating configuration files: https://broadinstitute.atlassian.net/wiki/display/DO/Vault
  - See [Deployment](DEPLOY.md) for more information about how to render configurations.
* If the database already exists mark all changes as executed in the database
  -  grails dbm-changelog-sync
* Run locally with `grails run-app -https` and ignore the cert-error when accessing the site locally.
  
**Local Testing**  
* **IMPORTANT** If you run tests through the IDE, set your default JUnit test to include the environment variable, 
    `-Dgrails.env=test` so that they don't run against development or production
* Test with `./gradlew cleanTest` or for a single test, `./gradlew test --tests *.TestName`, 
    or through the IDE. I tend to use JUnit (more legible test output) instead of Gradle, but both should work. 
    `grails test-app` tends to be flaky so I don't usually test that way.

# PRs
* PRs are tested run through CirlceCI
* Follow the circle link to the artifacts to see test and coverage results.