import React, { useEffect, useState } from "react"

import { DateCalendar } from "@components/DateCalendar";
import { TDatePeriodProps } from "./DatePeriod.types";

import './DatePeriod.less'

export const DatePeriod = ({ dateStart, dateEnd, onPeriodSet }: TDatePeriodProps): JSX.Element => {
    const [startDate, setStartDate] = useState(dateStart);
    const [endDate, setEndDate] = useState(dateEnd);

    useEffect(() => {
        setStartDate(dateStart);
        setEndDate(dateEnd);
    }, [dateStart, dateEnd])

    const handleStartDateChange = (date: Date) => {
        setStartDate(date)
        if (typeof onPeriodSet === 'function') {
            onPeriodSet(date, endDate);
        }
    }

    const handleEndDateChange = (date: Date) => {
        setEndDate(date)
        if (typeof onPeriodSet === 'function') {
            onPeriodSet(startDate, date);
        }
    }

    return (
        <article className="datePeriod">
            <div className="datePeriod__title">Выбрать период</div>
            <div className="datePeriod__dates">
                <DateCalendar
                    selected={startDate}
                    onChange={handleStartDateChange}
                    startDate={startDate}
                    endDate={endDate}
                    isClearable={true}
                />
                <div className="datePeriod__dash">-</div>
                <DateCalendar
                    selected={endDate}
                    onChange={handleEndDateChange}
                    startDate={startDate}
                    endDate={endDate}
                    minDate={startDate}
                    isClearable={true}
                />
            </div>
        </article>
    )
}