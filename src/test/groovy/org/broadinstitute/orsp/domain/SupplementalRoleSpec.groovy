package org.broadinstitute.orsp.domain

import grails.testing.gorm.DomainUnitTest
import org.broadinstitute.orsp.BaseSpec
import org.broadinstitute.orsp.SupplementalRole
import org.broadinstitute.orsp.User

import static org.junit.Assert.assertFalse
import static org.junit.Assert.assertTrue

class SupplementalRoleSpec extends BaseSpec implements DomainUnitTest<SupplementalRole> {

    void testOrspRole() {
        when:
        List<String> roles = [SupplementalRole.ORSP]
        List<String> facebook = ["facebook"]

        then:
        assertTrue(SupplementalRole.isOrsp(roles))
        assertFalse(SupplementalRole.isOrsp(facebook))
    }

    void testComplianceRole() {
        when:
        List<String> roles = [SupplementalRole.COMPLIANCE_OFFICE]
        List<String> facebook = ["facebook"]

        then:
        assertTrue(SupplementalRole.isComplianceOffice(roles))
        assertFalse(SupplementalRole.isComplianceOffice(facebook))
    }

    void testAdminRole() {
        when:
        List<String> roles = [SupplementalRole.ADMIN]
        List<String> facebook = ["facebook"]

        then:
        assertTrue(SupplementalRole.isAdmin(roles))
        assertFalse(SupplementalRole.isOrsp(roles))
        assertFalse(SupplementalRole.isComplianceOffice(roles))
        assertFalse(SupplementalRole.isAdmin(facebook))
    }

    void testValid() {
        given:
        SupplementalRole role = new SupplementalRole(
                user: new User(
                        userName: "userName",
                        emailAddress: "email",
                        displayName: "Name",
                        createdDate: new Date(),
                        updatedDate: new Date()
                ),
                role: "admin"
        )

        when:
        def valid = role.validate()

        then:
        assertTrue(valid)
    }

    void testInvalid() {
        given:
        SupplementalRole role = new SupplementalRole()

        when:
        def valid = role.validate()

        then:
        assertFalse(valid)
    }

    void testInvalidRole() {
        given:
        SupplementalRole role = new SupplementalRole(
                user: new User(
                        userName: "userName",
                        emailAddress: "email",
                        displayName: "Name",
                        createdDate: new Date(),
                        updatedDate: new Date()
                ),
                role: "facebook friend"
        )

        when:
        def valid = role.validate()

        then:
        assertFalse(valid)
    }

}
