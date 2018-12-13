package org.broadinstitute.orsp

import grails.transaction.Transactional
import com.google.gson.Gson

@Transactional(readOnly = true)
class ProjectController {

    def pages() {
      render(view: "/newProject/index")
    }

    def index() {

    }

    def show() {
    }

    def create() {
    }

    def edit() {
    }

    def save() {
    }

    def update() {
    }

    def delete() {
    }
}
