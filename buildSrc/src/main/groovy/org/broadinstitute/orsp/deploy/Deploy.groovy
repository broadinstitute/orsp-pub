package org.broadinstitute.orsp.deploy

import org.gradle.api.DefaultTask
import org.gradle.api.InvalidUserDataException
import org.gradle.api.internal.tasks.options.Option
import org.gradle.api.tasks.TaskAction

@SuppressWarnings("unused")
class Deploy extends DefaultTask {

    enum DeployEnv { dev, prod }

    String userHome = System.properties['user.home']
    public String projectHome
    String appPath
    String branch = Utilities.getExecutionResult("git rev-parse --abbrev-ref HEAD")
    String hash = Utilities.getExecutionResult("git rev-parse --short HEAD")
    String version = "${branch}_${hash}"
    String env

    String user
    @Option(option = 'user', description = 'Set the app server user')
    void setUser(String user) { this.user = user }

    String pass
    @Option(option = 'pass', description = 'Set the app server password')
    void setPass(String pass) { this.pass = pass }

    String host
    @Option(option = 'host', description = 'Set the app server host')
    void setHost(String host) { this.host = host }

    @TaskAction
    void deploy() {
        if (projectHome.isEmpty() || appPath.isEmpty()) {
            throw new InvalidUserDataException("Project information must be specified.")
        }
        if (user.isEmpty() || pass.isEmpty()) {
            throw new InvalidUserDataException("Username and Password must both be specified.")
        }
        Utilities.executeLine("curl --upload-file ${projectHome}/build/libs/orsp.war -u ${user}:${pass} ${host}/manager/text/deploy?path=${appPath}&update=true&version=${version}")
    }

}
