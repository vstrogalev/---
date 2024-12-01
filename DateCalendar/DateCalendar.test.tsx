import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { DateCalendar } from './';

describe('DateCalendar Component', () => {
    const mockOnChange = jest.fn();
    const selectedDate = new Date(2024, 9, 16); // 16/10/2024

    const setup = (props = {}) => {
        return render(
            <DateCalendar
                selected={selectedDate}
                onChange={mockOnChange}
                {...props}
            />
        );
    };

    it('Рендер корректный с заданными пропсами', () => {
        const { getByDisplayValue } = setup();

        const input = getByDisplayValue('16.10.2024');
        expect(input).toBeInTheDocument();
    });

    it('Вызов onChange с заданной датой', async () => {
        const { getByDisplayValue } = setup();

        const input = getByDisplayValue('16.10.2024');
        fireEvent.click(input);

        // Симулируем выбор даты из календаря
        const newDate = new Date(2024, 9, 17); // 17/10/2024

        // здесь [aria-label рисует DataPicker и можем поймать кнопочку по данному селектору
        const dateToSelect = await waitFor(() => document.querySelector(`[aria-label="Choose четверг, 17 октября 2024 г."]`));
        if (dateToSelect) {
            fireEvent.click(dateToSelect);
        }

        expect(mockOnChange).toHaveBeenCalledWith(newDate);
    });

    it('Компонент очищается с флагом isClearable по клику', () => {
        const { getByLabelText, getByDisplayValue } = setup({ isClearable: true });

        const input = getByDisplayValue('16.10.2024');
        expect(input).toBeInTheDocument();

        const clearButton = getByLabelText('Close');
        fireEvent.click(clearButton);

        expect(mockOnChange).toHaveBeenCalledWith(null);
        expect(input).toHaveDisplayValue("");
    });
});
