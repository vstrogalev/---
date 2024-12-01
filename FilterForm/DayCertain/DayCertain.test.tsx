import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { DayCertain } from './DayCertain';
import { ButtonType } from '@components/Button';

describe('DayCertain Component', () => {
    it('Рендер корректно с просами', () => {
        const { getByRole } = render(
            <DayCertain text="Test Button" state={true} onChange={jest.fn()} />
        );

        const buttonElement = getByRole('button', { name: /Test Button/i });
        expect(buttonElement).toBeInTheDocument();
        expect(buttonElement).toHaveClass(ButtonType.Primary);
    });

    it('вызывает onChange с корректными аргументами когда по нему кликнут', () => {
        const mockOnChange = jest.fn();

        const { getByRole } = render(
            <DayCertain text="Test Button" state={false} onChange={mockOnChange} />
        );

        const buttonElement = getByRole('button', { name: /Test Button/i });

        fireEvent.click(buttonElement);

        expect(mockOnChange).toHaveBeenCalledWith(true); // Since initial state is false
        expect(mockOnChange).toHaveBeenCalledTimes(1);
    });
});