package org.broadinstitute.orsp

import grails.testing.gorm.DataTest
import grails.testing.services.ServiceUnitTest

class UserServiceSpec extends BaseSpec implements ServiceUnitTest<UserService>, DataTest {

    User USER

    void setupSpec() {
        mockDomain User
    }

    private void setUpUsers() {
        USER = service.findOrCreateUser(
                "testuser1",
                "testuser1@broadinstitute.org",
                "Test User 1")
        service.findOrCreateUser(
                "testuser2",
                "testuser2@broadinstitute.org",
                "Test User 2")
    }

    void "UserService.findAllUserNames succeeds with all users"() {
        setup:
        setUpUsers()

        when:
        Collection<String> userNames = service.findAllUserNames()

        then:
        userNames.size() == 2
        userNames[0].equals(USER.userName)
    }

    void "UserService.findUser succeeds with known user"() {
        setup:
        setUpUsers()

        when:
        User user = service.findUser(USER.userName)

        then:
        user != null
        user.userName.equals(USER.userName)
    }

    void "UserService.findUser fails with unknown user"() {
        setup:
        setUpUsers()

        when:
        User user = service.findUser("fredFlintstone")

        then:
        user == null
    }

    void "UserService.findUsers succeeds with known user"() {
        setup:
        setUpUsers()

        when:
        Collection<User> users = service.findUsers(Collections.singletonList(USER.userName))

        then:
        users != null
        !users.isEmpty()
        users.size() == 1
        users[0].userName.equals(USER.userName)
    }

    void "UserService.findUsers fails with unknown user"() {
        setup:
        setUpUsers()

        when:
        Collection<User> users = service.findUsers(Collections.singletonList("fredFlintstone"))

        then:
        users != null
        users.isEmpty()
    }

    void "UserService.findUsersBySearchTerm succeeds with known search term"() {
        setup:
        setUpUsers()

        when:
        Collection<User> users = service.findUsersBySearchTerm("test")

        then:
        users != null
        !users.isEmpty()
        users.size() == 2
        users[0].userName.equals(USER.userName)
    }

    void "UserService.findUsersBySearchTerm fails with unknown search term"() {
        setup:
        setUpUsers()

        when:
        Collection<User> users = service.findUsersBySearchTerm("Fred")

        then:
        users != null
        users.isEmpty()
    }

}
