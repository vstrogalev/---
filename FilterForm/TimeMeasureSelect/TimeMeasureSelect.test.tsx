import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { TimeMeasureSelect } from './TimeMeasureSelect';
import { TIME_MEASURE_UNIT, timeMeasureNames } from '@constants';

describe('TimeMeasureSelect Component', () => {
    it('Рендер корректно с просами', () => {
        const mockOnSelect = jest.fn();
        const { getByTestId } = render(
            <TimeMeasureSelect measureUnit={TIME_MEASURE_UNIT.Minute} onSelect={mockOnSelect} />
        );

        const selectElement = getByTestId('time-measure-select') as HTMLSelectElement;
        expect(selectElement).toBeInTheDocument();
        expect(selectElement.value).toBe(TIME_MEASURE_UNIT.Minute);

        // Check for all options
        Object.entries(timeMeasureNames).forEach(([key, name]) => {
            const optionElement = selectElement.querySelector(`option[value="${key}"]`);
            expect(optionElement).toBeInTheDocument();
            expect(optionElement?.textContent).toBe(name);
        });
    });

    it('вызывает onSelect с корректными аргументами когда по нему кликнут', () => {
        const mockOnSelect = jest.fn();
        const { getByTestId } = render(
            <TimeMeasureSelect measureUnit={TIME_MEASURE_UNIT.Second} onSelect={mockOnSelect} />
        );

        const selectElement = getByTestId('time-measure-select') as HTMLSelectElement;

        // Симулируем изменения в селекте
        fireEvent.change(selectElement, { target: { value: TIME_MEASURE_UNIT.Hour } });

        expect(mockOnSelect).toHaveBeenCalledWith(TIME_MEASURE_UNIT.Hour);
        expect(mockOnSelect).toHaveBeenCalledTimes(1);
    });
});