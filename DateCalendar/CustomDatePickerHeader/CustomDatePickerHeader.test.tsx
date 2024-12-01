import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { CustomDatePickerHeader } from './CustomDatePickerHeader';

// Мокаем текущий год для теста
jest.mock('date-fns', () => ({
    ...jest.requireActual('date-fns'),
    getYear: jest.fn(() => 2024),
}));

describe('CustomDatePickerHeader Component', () => {
    const date = new Date(2024, 9); // Октябрь 2024
    const changeMonth = jest.fn();
    const changeYear = jest.fn();

    it('Рендер корректный с пропсами', () => {
        const { getByText, getByDisplayValue } = render(
            <CustomDatePickerHeader date={date} changeMonth={changeMonth} changeYear={changeYear} />
        );

        expect(getByText('Месяц')).toBeInTheDocument();
        expect(getByText('Год')).toBeInTheDocument();

        // Проверяем, что выбраны правильные значения по умолчанию
        expect(getByDisplayValue('Октябрь')).toBeInTheDocument();
        expect(getByDisplayValue('2024')).toBeInTheDocument();
    });

    it('Вызов changeMonth с корректными аргументами, когда месяц изменился', () => {
        const { getByDisplayValue } = render(
            <CustomDatePickerHeader date={date} changeMonth={changeMonth} changeYear={changeYear} />
        );

        const monthSelect = getByDisplayValue('Октябрь');
        fireEvent.change(monthSelect, { target: { value: 'Ноябрь' } });

        expect(changeMonth).toHaveBeenCalledWith(10); // Ноябрь соответствует индексу 10
        expect(changeMonth).toHaveBeenCalledTimes(1);
    });

    it('Вызов changeYear с корректными аргументами когда год изменился', () => {
        const { getByDisplayValue } = render(
            <CustomDatePickerHeader date={date} changeMonth={changeMonth} changeYear={changeYear} />
        );

        const yearSelect = getByDisplayValue('2024');
        fireEvent.change(yearSelect, { target: { value: '2023' } });

        expect(changeYear).toHaveBeenCalledWith(2023);
        expect(changeYear).toHaveBeenCalledTimes(1);
    });
});
