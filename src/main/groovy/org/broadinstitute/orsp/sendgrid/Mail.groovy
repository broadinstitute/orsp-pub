package org.broadinstitute.orsp.sendgrid

/**
 * See https://sendgrid.com/docs/API_Reference/Web_API_v3/Mail/index.html#-Request-Body-Parameters
 *
 * When exported to JSON, will model the following:
     {
         "personalizations": [
             {
                 "to": [
                     {
                         "email": "grushton@broadinstitute.org",
                         "name": "John Doe"
                     }
                 ],
                 "cc": [
                     {
                         "email": "grushton.dev@gmail.com",
                         "name": "CC Smith"
                     }
                 ],
                 "subject": "Hello, World!"
             }
         ],
         "from": {
             "email": "grushton@broadinstitute.org",
             "name": "Sam Smith"
         },
         "reply_to": {
             "email": "grushton@broadinstitute.org",
             "name": "Sam Smith"
         },
         "subject": "Hello, World!",
         "content": [
             {
                 "type": "text/html",
                 "value": "<html><p>Hello, world!</p></html>"
             }
         ]
     }
 *
 */
class Mail {
    List<Personalization> personalizations
    EmailUser from
    EmailUser reply_to
    String subject
    List<Content> content
}
