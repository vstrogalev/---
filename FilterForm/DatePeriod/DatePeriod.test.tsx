import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { DatePeriod } from './DatePeriod';
import { TDatePeriodProps } from './DatePeriod.types';

describe('DatePeriod Component', () => {
    const dateStart = new Date(2024, 9, 16); // 16 октября, 2024
    const dateEnd = new Date(2024, 9, 17); // 17 октября, 2024
    const onPeriodSet = jest.fn();

    const setup = (props: Partial<TDatePeriodProps> = {}) => {
        return render(
            <DatePeriod
                dateStart={props.dateStart || dateStart}
                dateEnd={props.dateEnd || dateEnd}
                onPeriodSet={props.onPeriodSet || onPeriodSet}
            />
        );
    };

    it('Рендер корректный с заданными датами', () => {
        const { getByText } = setup();

        expect(getByText('Выбрать период')).toBeInTheDocument();
        // Между датами также должен быть дефис
        expect(getByText('-')).toBeInTheDocument();
    });

    it('Вызов onPeriodSet и меняем дату', () => {
        const { getByDisplayValue } = setup();

        // находим поле с датой
        const startDateCalendar = getByDisplayValue('16.10.2024'); 
        fireEvent.click(startDateCalendar);

        const newStartDate = new Date(2024, 9, 15); // меняем на 15 октября 2024
        fireEvent.change(startDateCalendar, { target: { value: newStartDate } });

        expect(onPeriodSet).toHaveBeenCalledWith(newStartDate, dateEnd);
    });

    it('Вызов onPeriodSet и меняем endDate', () => {
        const { getByDisplayValue } = setup();

        const endDateCalendar = getByDisplayValue('17.10.2024'); // находим заданную конечную дату
        fireEvent.click(endDateCalendar);

        const newEndDate = new Date(2024, 9, 20); // меняем на 20 октября 2024
        fireEvent.change(endDateCalendar, { target: { value: newEndDate } });

        expect(onPeriodSet).toHaveBeenCalledWith(dateStart, newEndDate);
    });
});
