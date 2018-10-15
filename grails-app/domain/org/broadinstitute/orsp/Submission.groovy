package org.broadinstitute.orsp

import org.apache.commons.lang.StringUtils
import org.jsoup.Jsoup
import org.jsoup.examples.HtmlToPlainText

/**
 *
 * Created: 11/10/14
 *
 * @author <a href="mailto:grushton@broadinstitute.org">grushton</a>
 */
class Submission {

    Long id
    String projectKey
    String type
    Integer number
    String author
    String comments
    Date createDate
    Collection<StorageDocument> documents

    static constraints = {
        projectKey nullable: false
        author nullable: false
        createDate nullable: false
        comments nullable: true
        number nullable: false
    }

    static hasMany = [documents: StorageDocument]

    static mapping = {
        documents joinTable: [name  : 'submission_document',
                              column: 'storage_document_id',
                              key   : 'submission_document_id']
    }

    def getAbbreviatedComment() {
        getPlainCommentText(50)
    }

    private def getPlainCommentText(Integer maxLength) {
        if (comments && !comments.isEmpty() && !comments.isAllWhitespace()) {
            def commentText = new HtmlToPlainText().getPlainText(Jsoup.parse(comments))
            commentText.length() <= maxLength ?
                    commentText :
                    StringUtils.abbreviate(new HtmlToPlainText().getPlainText(Jsoup.parse(comments)), maxLength)
        } else {
            ""
        }
    }

}
