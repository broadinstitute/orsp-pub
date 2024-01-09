package org.broadinstitute.orsp

import grails.gorm.transactions.Transactional
import org.hibernate.SQLQuery
import org.hibernate.SessionFactory

import java.text.SimpleDateFormat

@Transactional
class ReviewerService {

    def grailsApplication

    def getReviewers() {
        SessionFactory sessionFactory = grailsApplication.getMainContext().getBean('sessionFactory')
        final session = sessionFactory.currentSession
        final String query = ' SELECT * FROM reviewers'
        final SQLQuery sqlQuery = session.createSQLQuery(query)
        final result = sqlQuery.with {it ->
            list()
        }
        result
    }

    def addReviewer(Map<String, Object> reviewerData) {
        String startDate = reviewerData.startDate
        String endDate = reviewerData.endDate ? reviewerData.endDate : null
        String userJson = reviewerData.userJson as String
        Integer order = reviewerData.reviewOrder as Integer

        SessionFactory sessionFactory = grailsApplication.getMainContext().getBean('sessionFactory')
        final session = sessionFactory.currentSession
        final String query = "INSERT INTO reviewers (name, active, reviewOrder, userjson, start_date, end_date) " +
                "VALUES (:name, :active, :order, :userjson, :startDate, :endDate)"
        final SQLQuery sqlQuery = session.createSQLQuery(query)
        sqlQuery.setParameter("name", reviewerData.name)
        sqlQuery.setParameter("active", reviewerData.active)
        sqlQuery.setParameter("order", order)
        sqlQuery.setParameter("userjson", userJson)
        sqlQuery.setParameter("startDate", startDate)
        sqlQuery.setParameter("endDate", endDate)
        sqlQuery.executeUpdate()
    }

    def updateReviewer(Map<String, Object> reviewerData) {
        String startDate = reviewerData.startDate
        String endDate = reviewerData.endDate ? reviewerData.endDate : null
        Integer order = reviewerData.order as Integer

        SessionFactory sessionFactory = grailsApplication.getMainContext().getBean('sessionFactory')
        final session = sessionFactory.currentSession
        final String query = "UPDATE reviewers SET active=:active, reviewOrder=:order, start_date=:startDate, end_date=:endDate, updated_at=:updated WHERE name=:name"
        final SQLQuery sqlQuery = session.createSQLQuery(query)
        sqlQuery.setParameter("name", reviewerData.name)
        sqlQuery.setParameter("active", reviewerData.active)
        sqlQuery.setParameter("order", order)
        sqlQuery.setParameter("startDate", startDate)
        sqlQuery.setParameter("endDate", endDate)
        sqlQuery.setParameter("updated", new Date())
        sqlQuery.executeUpdate()
    }

    def deleteReviewer(String name) {
        SessionFactory sessionFactory = grailsApplication.getMainContext().getBean('sessionFactory')
        final session = sessionFactory.currentSession
        final String query = "DELETE FROM reviewers WHERE name='${name}'"
        final SQLQuery sqlQuery = session.createSQLQuery(query)
        sqlQuery.executeUpdate()
    }

    def countReviewerAssigned() {
        SessionFactory sessionFactory = grailsApplication.getMainContext().getBean('sessionFactory')
        final session = sessionFactory.currentSession
        final String query = 'SELECT COUNT(*) FROM issue_extra_property where name="reviewerAssigned";'
        final SQLQuery sqlQuery = session.createSQLQuery(query)
        final result = sqlQuery.uniqueResult()
        result
    }

    def countReviewerProjects(Map<String, Object> userjson) {
        SessionFactory sessionFactory = grailsApplication.getMainContext().getBean('sessionFactory')
        final session = sessionFactory.currentSession
        final String query = "SELECT count(*) FROM issue_extra_property where name='assignedAdmin' AND JSON_CONTAINS(value, '${userjson.json}')"
        final SQLQuery sqlQuery = session.createSQLQuery(query)
        final result = sqlQuery.uniqueResult()
        result
    }

    def getDistinctReviewers() {
        SessionFactory sessionFactory = grailsApplication.getMainContext().getBean('sessionFactory')
        final session = sessionFactory.currentSession
        final String query = "SELECT DISTINCT value FROM issue_extra_property where name='assignedAdmin'"
        final SQLQuery sqlQuery = session.createSQLQuery(query)
        final result = sqlQuery.with {it ->
            list()
        }
        result
    }
}
