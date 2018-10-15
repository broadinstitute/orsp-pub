package org.broadinstitute.orsp

trait Status {

    SubsystemStatus getStatus() {
        new SubsystemStatus(ok: false, messages: ["Unimplemented"])
    }

}