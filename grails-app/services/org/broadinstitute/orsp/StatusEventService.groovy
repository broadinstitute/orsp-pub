package org.broadinstitute.orsp

import groovy.util.logging.Slf4j
import org.hibernate.SessionFactory
import org.joda.time.Period
import org.joda.time.PeriodType

/**
 * This class generates all of the potential events that need to be reported on.
 */
@Slf4j
class StatusEventService {

    private final List<EventType> TYPES =
            EnumSet.range(EventType.INITIAL_STATE, EventType.ABANDON).toList()

    private final List<EventType> TERMINAL_TYPES =
            EnumSet.of(EventType.ABANDON, EventType.CLOSED, EventType.COMPLETED).toList()

    SessionFactory sessionFactory

    Collection<Event> getStatusEventsForProject(final String projectKey) {
        final session = sessionFactory.currentSession
        final String query =
                ' select * ' +
                        ' from event e ' +
                        ' where e.project_key = :projectKey ' +
                        ' and e.event_type in :typeList '
        final sqlQuery = session.createSQLQuery(query)
        final results = sqlQuery.with {
            addEntity(Event)
            setString('projectKey', projectKey)
            setParameterList('typeList', TYPES*.name())
            list()
        }
        results as Collection<Event>
    }

    List<StatusEventDTO> getStatusEventDTOs(List<Event> statusEvents) {
        if (statusEvents && statusEvents.isEmpty()) return Collections.emptyList()

        // The first event to calculate time from is either "Reviewing Form" if it exists,
        // or the very first event if it does not.
        // For IRBs, we don't need to be picky about the initial status because they are not
        // specifically required for QA reporting, only NE/NHSR projects.
        Event rf = statusEvents.find { it.eventType?.equals(EventType.REVIEWING_FORM) }
        Event first = rf ?: statusEvents?.head()
        // Create DTOs from sorted events
        // Duration is calculated as this event's creation date compared to the next event's creation date.
        // If there isn't a next event, then we use today's date to calculate the duration which indicates
        // how long the project has been left in that final state.
        //
        // Terminal Event Case:
        // If the event is a terminal event (i.e. completed, abandoned, etc.) then the duration is
        // calculated from the first event to the terminal state event.
        List<StatusEventDTO> eventDTOs = statusEvents?.
                withIndex()?.
                collect { Event event, int i ->
                    Period duration
                    if (TERMINAL_TYPES.contains(event.eventType)) {
                        duration = new Period(first.created.time, event.created.time, PeriodType.yearMonthDay())
                    } else if (i < statusEvents.size() - 1) {
                        Event previousEvent = statusEvents.get(i + 1)
                        duration = new Period(event.created.time, previousEvent.created.time, PeriodType.yearMonthDay())
                    } else {
                        duration = new Period(event.created.time, new Date().time, PeriodType.yearMonthDay())
                    }
                    new StatusEventDTO(new Issue(), event, duration)
                }
        eventDTOs
    }

    List <StatusEventDTO> getStatusEventsForProjectList(List<Issue> issues) {
        final session = sessionFactory.currentSession
        final String query = ' select * from event e where e.project_key in :projectKeys ' +
                             ' and e.event_type in :typeList '
        final sqlQuery = session.createSQLQuery(query)

        List<Event> eventList = sqlQuery.with {
            addEntity(Event)
            setParameterList('projectKeys', issues*.projectKey.toList())
            setParameterList('typeList', TYPES*.name())
            list().sort { a, b -> a.created <=> b.created }
        }

        Map<String, Event> eventMap = eventList.groupBy {it.projectKey} as Map<String, Event>
        List<StatusEventDTO> result = new ArrayList<>()
        issues.collect { issue ->
            List<StatusEventDTO> eventDTOs = getStatusEventDTOs(eventMap[issue.projectKey])
            if (eventDTOs) {
                StatusEventDTO statusEventDTO = eventDTOs?.last()
                statusEventDTO?.setIssue(issue)
                result.add(statusEventDTO)
            } else {
                result.add(new StatusEventDTO(issue, null, null))
            }
        }
        result
    }

    class StatusEventDTO {
        Issue issue
        Event event
        Period duration
        Integer stage

        StatusEventDTO(Issue issue, Event event, Period duration) {
            this.issue = issue
            this.event = event
            this.duration = duration
            this.stage = event ? getEventStage(event) : 0
        }

        private Integer getEventStage(Event event) {
            switch (event.eventType) {
                case EventType.INITIAL_STATE:
                    1 // All project types
                    break
                case EventType.GETTING_SIGNATURES:
                    2 // IRB
                    break
                case EventType.REVIEWING_FORM:
                    2 // Non-IRB
                    break
                case EventType.IRB_CONSIDERING:
                    3 // IRB
                    break
                case EventType.GETTING_CCO_APPROVAL:
                    3 // Non-IRB
                    break
                case EventType.APPROVED:
                    4 // IRB
                    break
                case EventType.COMPLETED:
                    4 // Non-IRB
                    break
                case EventType.CLOSED:
                    5 // IRB
                    break
                case EventType.ABANDON:
                    6
                    break
                default:
                    0
                    break
            }
        }

    }

}
