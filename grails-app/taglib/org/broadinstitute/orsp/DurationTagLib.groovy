package org.broadinstitute.orsp

import org.joda.time.Period
import org.joda.time.PeriodType
import org.joda.time.format.PeriodFormat

class DurationTagLib {

    static namespace= 'duration'

    def from = { attributes ->
        def output = ""
        if (attributes.date && attributes.date instanceof Date) {
            Period period = new Period(((Date) attributes.date).getTime(), new Date().getTime(), PeriodType.yearMonthDay())
            output = PeriodFormat.getDefault().print(period)
        }
        out << output
    }

    def period = { attributes ->
        def output = ""
        if (attributes.period && attributes.period instanceof Period) {
            output = PeriodFormat.getDefault().print(attributes.period)
        }
        out << output
    }

}
