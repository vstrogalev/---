import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { format, startOfYesterday, endOfYesterday, startOfToday, endOfToday } from 'date-fns';

import { TIME_MEASURE_UNIT } from '@constants';
import { ButtonType } from '@components/Button';

import { FilterForm } from './'
import { IFilterFormProps } from './FilterForm.types';

describe('FilterForm Component', () => {
    const mockGetResultOnClose = jest.fn();
    const mockNodeElement = document.createElement('button');

    const initialProps = {
        nodeElement: mockNodeElement,
        getResultOnClose: mockGetResultOnClose,
        filterFormData: {
            dateStart: new Date(2024, 9, 15),
            dateEnd: new Date(2024, 9, 16),
            period: {
                measureUnit: TIME_MEASURE_UNIT.Second,
                value: 111,
            },
        },
    };

    const setup = (props: Partial<IFilterFormProps> = {}) => {
        return render(
            <FilterForm {...initialProps} {...props} />
        );
    };

    it('Рендер корректный с заданными датами', () => {
        const { getByText, getByDisplayValue } = setup();

        expect(getByDisplayValue('15.10.2024')).toBeInTheDocument();
        expect(getByDisplayValue('16.10.2024')).toBeInTheDocument();
        expect(getByText('Вчера')).toBeInTheDocument();
        expect(getByText('Сегодня')).toBeInTheDocument();
        expect(getByText('Последний')).toBeInTheDocument();
        expect(getByDisplayValue('Секунда')).toBeInTheDocument();
        expect(getByText('Очистить')).toBeInTheDocument();
        expect(getByText('Отменить')).toBeInTheDocument();
        expect(getByText('Применить')).toBeInTheDocument();
    });

    it('Кликаем на кнопку Вчера. Кнопка становится активной. Остальные нет. getResultOnClose возвращает требуемые атрибуты', () => {
        const { getByRole, getByDisplayValue } = setup();

        const startDateCalendar = getByDisplayValue('15.10.2024');
        const endDateCalendar = getByDisplayValue('16.10.2024');
        const yesterDayElement = getByRole('button', { name: /Вчера/i });
        const todayElement = getByRole('button', { name: /Сегодня/i });
        const lastElement = getByRole('button', { name: /Последний/i });
        const acceptElement = getByRole('button', { name: /Применить/i });

        // первоначально кнопки не активные
        expect(yesterDayElement).toHaveClass(ButtonType.Outline);
        expect(todayElement).toHaveClass(ButtonType.Outline);
        expect(lastElement).toHaveClass(ButtonType.Outline);

        // кликаем на Вчера - становится активной, остальные не активные
        fireEvent.click(yesterDayElement)
        expect(yesterDayElement).toHaveClass(ButtonType.Primary);
        expect(todayElement).toHaveClass(ButtonType.Outline);
        expect(lastElement).toHaveClass(ButtonType.Outline);

        // даты меняются на вчера
        const newStartDay = format(startOfYesterday(), 'dd.MM.yyyy');
        expect(startDateCalendar).toHaveDisplayValue(newStartDay);

        const newEndDay = format(endOfYesterday(), 'dd.MM.yyyy');
        expect(endDateCalendar).toHaveDisplayValue(newEndDay);

        // кликаем на кнопку Применить
        fireEvent.click(acceptElement);
        expect(mockGetResultOnClose).toHaveBeenCalledWith({
            dateStart: startOfYesterday(), // Начало сегодняшнего дня
            dateEnd: endOfYesterday(), // Конец сегодняшнего дня
            period: { measureUnit: null, value: null },
        });
    });

    it('Кликаем на кнопку Сегодня. Кнопка становится активной. Остальные нет. getResultOnClose возвращает требуемые атрибуты', () => {
        const { getByRole, getByDisplayValue } = setup();

        const startDateCalendar = getByDisplayValue('15.10.2024');
        const endDateCalendar = getByDisplayValue('16.10.2024');
        const yesterDayElement = getByRole('button', { name: /Вчера/i });
        const todayElement = getByRole('button', { name: /Сегодня/i });
        const lastElement = getByRole('button', { name: /Последний/i });
        const acceptElement = getByRole('button', { name: /Применить/i });

        // первоначально кнопки не активные
        expect(yesterDayElement).toHaveClass(ButtonType.Outline);
        expect(todayElement).toHaveClass(ButtonType.Outline);
        expect(lastElement).toHaveClass(ButtonType.Outline);

        // кликаем на Сегодня становится активной, остальные не активные
        fireEvent.click(todayElement)
        expect(yesterDayElement).toHaveClass(ButtonType.Outline);
        expect(todayElement).toHaveClass(ButtonType.Primary);
        expect(lastElement).toHaveClass(ButtonType.Outline);

        // даты меняются на сегодня
        const newStartDay = format(startOfToday(), 'dd.MM.yyyy');
        expect(startDateCalendar).toHaveDisplayValue(newStartDay);

        const newEndDay = format(endOfToday(), 'dd.MM.yyyy');
        expect(endDateCalendar).toHaveDisplayValue(newEndDay);

        // кликаем на кнопку Применить
        fireEvent.click(acceptElement);
        expect(mockGetResultOnClose).toHaveBeenCalledWith({
            dateStart: startOfToday(), // Начало сегодняшнего дня
            dateEnd: endOfToday(), // Конец сегодняшнего дня
            period: { measureUnit: null, value: null },
        });
    });

    it('Ввод числа. Кнопка Последний становится активной. Остальные нет. getResultOnClose возвращает требуемые атрибуты', () => {
        const { getByRole, getByDisplayValue } = setup();

        const yesterDayElement = getByRole('button', { name: /Вчера/i });
        const todayElement = getByRole('button', { name: /Сегодня/i });
        const lastElement = getByRole('button', { name: /Последний/i });
        const acceptElement = getByRole('button', { name: /Применить/i });
        const inputElement = getByDisplayValue(initialProps.filterFormData.period.value);

        // первоначально кнопки не активные
        expect(yesterDayElement).toHaveClass(ButtonType.Outline);
        expect(todayElement).toHaveClass(ButtonType.Outline);
        expect(lastElement).toHaveClass(ButtonType.Outline);

        // вводим в поле количества число
        fireEvent.change(inputElement, { target: { value: '12' } });

        // кнопка Последний становится активной
        expect(yesterDayElement).toHaveClass(ButtonType.Outline);
        expect(todayElement).toHaveClass(ButtonType.Outline);
        expect(lastElement).toHaveClass(ButtonType.Primary);

        // кликаем на кнопку Применить
        fireEvent.click(acceptElement);
        expect(mockGetResultOnClose).toHaveBeenCalledWith({
            ...initialProps.filterFormData,
            dateStart: null,
            dateEnd: null,
            period: {
                ...initialProps.filterFormData.period,
                value: 12
            }
        });
    });

    it('Отменить. Кликаем на кнопку Сегодня. Даты меняются на сегодня. Кликаем на Отменить. getResultOnClose возвращает первоначальные атрибуты', () => {
        const { getByRole, getByDisplayValue } = setup();

        const startDateCalendar = getByDisplayValue('15.10.2024');
        const endDateCalendar = getByDisplayValue('16.10.2024');
        const todayElement = getByRole('button', { name: /Сегодня/i });
        const cancelElement = getByRole('button', { name: /Отменить/i });

        // кликаем на Сегодня
        fireEvent.click(todayElement)

        // даты меняются на сегодня
        const newStartDay = format(startOfToday(), 'dd.MM.yyyy');
        expect(startDateCalendar).toHaveDisplayValue(newStartDay);

        const newEndDay = format(endOfToday(), 'dd.MM.yyyy');
        expect(endDateCalendar).toHaveDisplayValue(newEndDay);

        // кликаем на кнопку Отменить
        fireEvent.click(cancelElement);
        expect(mockGetResultOnClose).toHaveBeenCalledWith(initialProps.filterFormData);
    });

    it('Очистить. Форма очищается. getResultOnClose возвращает атрибуты null', () => {
        const { getByRole, getByDisplayValue } = setup();

        const startDateCalendar = getByDisplayValue('15.10.2024');
        const endDateCalendar = getByDisplayValue('16.10.2024');
        const yesterDayElement = getByRole('button', { name: /Вчера/i });
        const todayElement = getByRole('button', { name: /Сегодня/i });
        const lastElement = getByRole('button', { name: /Последний/i });
        const resetElement = getByRole('button', { name: /Очистить/i });
        const acceptElement = getByRole('button', { name: /Применить/i });

        // кликаем на Сегодня
        fireEvent.click(todayElement)

        // даты меняются на сегодня
        const newStartDay = format(startOfToday(), 'dd.MM.yyyy');
        expect(startDateCalendar).toHaveDisplayValue(newStartDay);

        const newEndDay = format(endOfToday(), 'dd.MM.yyyy');
        expect(endDateCalendar).toHaveDisplayValue(newEndDay);

        // кликаем на кнопку Очистить
        fireEvent.click(resetElement);

        // кнопки становятся не активными
        expect(yesterDayElement).toHaveClass(ButtonType.Outline);
        expect(todayElement).toHaveClass(ButtonType.Outline);
        expect(lastElement).toHaveClass(ButtonType.Outline);

        // даты очищаются
        expect(startDateCalendar).toHaveDisplayValue("");
        expect(endDateCalendar).toHaveDisplayValue("");
        
        // кликаем на кнопку Применить
        fireEvent.click(acceptElement);
        expect(mockGetResultOnClose).toHaveBeenCalledWith({
            dateStart: null,
            dateEnd: null,
            period: {
                measureUnit: null,
                value: null,
            },
        });
    });
});