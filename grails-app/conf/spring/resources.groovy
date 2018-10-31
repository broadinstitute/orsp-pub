package spring

import org.broadinstitute.orsp.config.AppInfoConfiguration
import org.broadinstitute.orsp.config.BspConfiguration
import org.broadinstitute.orsp.config.ConsentConfiguration
import org.broadinstitute.orsp.config.CrowdConfiguration
import org.broadinstitute.orsp.config.DataBioConfiguration
import org.broadinstitute.orsp.config.NotifyConfiguration
import org.broadinstitute.orsp.config.StorageConfiguration

// Place your Spring DSL code here
beans = {

    // Grails/Spring doesn't seem to be able to autowire these configuration beans otherwise
    appInfoConfiguration(AppInfoConfiguration) {}
    bspConfiguration(BspConfiguration) {}
    consentConfiguration(ConsentConfiguration) {}
    crowdConfiguration(CrowdConfiguration) {}
    dataBioConfiguration(DataBioConfiguration) {}
    notifyConfiguration(NotifyConfiguration) {}
    storageConfiguration(StorageConfiguration) {}
}
