package org.broadinstitute.orsp

import groovy.util.logging.Slf4j
import org.apache.commons.collections.CollectionUtils
import org.hibernate.SessionFactory

/**
 * This class generates all of the potential events that need to be reported on.
 */
@Slf4j
class StatusEventService {

    private final List<EventType> TYPES =
            EnumSet.range(EventType.INITIAL_STATE, EventType.REQUEST_CLARIFICATION).toList()

    private final List<EventType> TERMINAL_TYPES =
            EnumSet.of(
                    EventType.ABANDON,
                    EventType.CLOSED,
                    EventType.COMPLETED,
                    EventType.APPROVE_PROJECT,
                    EventType.REJECT_PROJECT,
                    EventType.ABANDON_PROJECT,
                    EventType.DISAPPROVE_PROJECT,
                    EventType.WITHDRAWN_PROJECT
            ).toList()

    SessionFactory sessionFactory

    List<StatusEventDTO> getStatusEventsForProject(final String projectKey) {
        if (projectKey) {
            final session = sessionFactory.currentSession
            final String query = 'select * from event e where e.project_key = :projectKey and e.event_type in :typeList'
            final sqlQuery = session.createSQLQuery(query)
            final results = sqlQuery.with {
                addEntity(Event)
                setString('projectKey', projectKey)
                setParameterList('typeList', TYPES*.name())
                list()
            }
            getStatusEventDTOs(results)
        } else {
            throw new IllegalArgumentException("Can't get status Events for empty Project Key.")
        }
    }

    List<StatusEventDTO> getStatusEventDTOs(List<Event> statusEvents) {
        if (CollectionUtils.isEmpty(statusEvents)) return Collections.emptyList()

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
                withIndex().
                collect { Event event, int i ->
                    Long durationTime
                    if (TERMINAL_TYPES.contains(event.eventType)) {
                        durationTime = event.created.time - first.created.time
                    } else if (i < statusEvents.size() - 1) {
                        Event previousEvent = statusEvents.get(i + 1)
                        durationTime = previousEvent.created.time - event.created.time
                    } else {
                        durationTime = new Date().time - event.created.time
                    }
                    new StatusEventDTO(event, durationTime)
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
            list()
        }

        Map<String, List<Event>> eventMap = eventList.groupBy {it.projectKey}
        List<StatusEventDTO> result = new ArrayList<>()
        issues.each { issue ->
            List<StatusEventDTO> eventDTOs = getStatusEventDTOs(eventMap[issue.projectKey])
            if (eventDTOs) {
                StatusEventDTO statusEventDTO = eventDTOs?.last()
                statusEventDTO?.setIssue(issue)
                result.add(statusEventDTO)
            } else {
                log.warn("There are no period events for issue ${issue.projectKey}")
                result.add(new StatusEventDTO(issue, null, null))
            }
        }
        result
    }

}
