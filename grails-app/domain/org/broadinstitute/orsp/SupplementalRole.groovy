package org.broadinstitute.orsp

class SupplementalRole {

    public static final String COMPLIANCE_OFFICE = "Compliance Office"
    public static final String ORSP = "orsp"
    public static final String ADMIN = "admin"
    public static final String READ_ONLY_ADMIN = "ro_admin"

    public static final List<String> CCO_USERS = ["sdonnell", "saltzman"]
    public static final List<String> ORSP_ROLES = [COMPLIANCE_OFFICE, ORSP]
    public static final List<String> ADMIN_ROLES = [ADMIN]

    static constraints = {
        user nullable: false
        role nullable: false, validator: {val -> val in ADMIN_ROLES }
    }

    String role

    static belongsTo = [user: User]
    static mapping = { user key: 'user_id'}


    static boolean isOrsp(Collection<String> roles) {
        roles?.intersect(ORSP_ROLES)?.size() > 0
    }

    static boolean isComplianceOffice(Collection<String> roles) {
        roles?.contains(COMPLIANCE_OFFICE)
    }

    static boolean isAdmin(Collection<String> roles) {
        roles?.intersect(ADMIN_ROLES)?.size() > 0
    }

    static boolean isReadOnlyAdmin(Collection<String> roles) {
        roles?.contains(READ_ONLY_ADMIN)
    }
}

