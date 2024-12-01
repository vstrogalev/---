import React from "react";

import { getMonth, getYear } from "date-fns";
import { TCustomHeaderProps } from "./CustomDatePickerHeader.types";

import './CustomDatePickerHeader.less';

export const CustomDatePickerHeader = ({
    date,
    changeYear,
    changeMonth,
}: TCustomHeaderProps) => {
    const years: number[] = Array.from({length: getYear(new Date()) + 1 - 2020}, (value, index) => {
        return index + 2020;
    });

    const months: string[] = [
        "Январь",
        "Февраль",
        "Март",
        "Апрель",
        "Май",
        "Июнь",
        "Июль",
        "Август",
        "Сентябрь",
        "Октябрь",
        "Ноябрь",
        "Декабрь",
    ];
    return (
        <div
            className="customDatapickerHeader"
            data-testid="custom-datapicker-header"
        >
            <div className="customDatapickerHeader__data customDatapickerHeader__data_month">
                <div className="customDatapickerHeader__subtitle">Месяц</div>
                <select
                    className="customDatapickerHeader__select"
                    value={months[getMonth(date)]}
                    onChange={({ target: { value } }) =>
                        changeMonth(months.indexOf(value))
                }
                >
                    {months.map((option) => (
                        <option className="customDatapickerHeader__option" key={option} value={option}>
                            {option}
                        </option>
                    ))}
                </select>
            </div>

            <div className="customDatapickerHeader__data customDatapickerHeader__data_year">
                <div className="customDatapickerHeader__subtitle">Год</div>
                <select
                    className="customDatapickerHeader__select"
                    value={getYear(date)}
                    onChange={({ target: { value } }) => changeYear(Number(value))}
                >
                    {years.map((option) => (
                        <option className="customDatapickerHeader__option" key={option} value={option}>
                            {option}
                        </option>
                    ))}
                </select>
            </div>
        </div>
    )
}