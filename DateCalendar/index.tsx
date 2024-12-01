import React, { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import { registerLocale, setDefaultLocale } from "react-datepicker";
import { ru } from 'date-fns/locale/ru';

import "react-datepicker/dist/react-datepicker.css"; // стандартные стили
import './DateCalendar.less'
import { CustomDatePickerHeader } from "./CustomDatePickerHeader/CustomDatePickerHeader";
import { TDateCalendarProps } from "./DateCalendat.types";

// описание API см. здесь https://reactdatepicker.com/ 

export const DateCalendar = ({
    selected = null,
    startDate = null,
    endDate = null,
    minDate = null,
    dateFormat = "dd.MM.yyyy",
    onChange,
    selectsStart = false,
    selectsEnd = false,
    isClearable = false,
    disabled = false,
    className = 'dateCalendar__input',
    calendarClassName = 'props calendarClassName',
    calendarIconClassName = "dateCalendar__icon",
    dayClassName = null,
}: TDateCalendarProps): JSX.Element => {
    const [selectedDate, setSelectedDate] = useState<Date>(selected);
    const [startDateForm, setStartDateForm] = useState<Date>(startDate);
    const [endDateForm, setEndDateForm] = useState<Date>(endDate);
    const [minDateForm, setMinDateForm] = useState<Date>(minDate);

    useEffect(() => {
        setSelectedDate(selected)
    }, [selected])

    useEffect(() => {
        setStartDateForm(startDate)
    }, [startDate])

    useEffect(() => {
        setEndDateForm(endDate)
    }, [endDate])

    useEffect(() => {
        setMinDateForm(minDate)
    }, [minDate])

    // переключаем календарь на русский
    registerLocale('ru', ru)
    setDefaultLocale('ru');

    const handleChange = (date: Date) => {
        if (typeof onChange === 'function') {
            onChange(date)
        }
        setSelectedDate(date)
    }

    return (
        <DatePicker
            renderCustomHeader={CustomDatePickerHeader}
            calendarClassName={calendarClassName}
            className={className}
            dayClassName={dayClassName}
            calendarIconClassName={calendarIconClassName}
            dateFormat={dateFormat}
            disabled={disabled}
            isClearable={isClearable}
            selected={selectedDate}
            selectsStart={selectsStart}
            selectsEnd={selectsEnd}
            startDate={startDateForm}
            endDate={endDateForm}
            minDate={minDateForm}
            toggleCalendarOnIconClick
            showIcon
            showMonthDropdown
            showYearDropdown
            icon={<i className="icon_font_calendar" />}
            onChange={handleChange}
            locale="ru"
            calendarStartDay={1}
            todayButton="Сегодня"
        />
    );
}