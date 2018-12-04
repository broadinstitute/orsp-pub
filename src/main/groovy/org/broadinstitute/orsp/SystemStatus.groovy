package org.broadinstitute.orsp

import java.sql.Timestamp

class SystemStatus {
    boolean ok
    List<String> messages
    Map<String, SubsystemStatus> systems
}

class SubsystemStatus {
    boolean ok
    List<String> messages
}

class SendgridSubsystem {
    boolean ok
    String status
    String name
}

class ConsentSubsystem {
    boolean healthy
    String message
    Throwable error
    Map<String, Object> details
    Timestamp timestamp
}
