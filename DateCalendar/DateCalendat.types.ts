import { ReactNode } from "react";

export // описание API см. здесь https://reactdatepicker.com/ 
type TDateCalendarProps = {
    selected?: Date | null;
    startDate?: Date | null;
    endDate?: Date | null;
    minDate?: Date | null;
    dateFormat?: string;
    onChange: (date: Date) => void;
    selectsStart?: boolean;
    selectsEnd?: boolean;
    isClearable?: boolean;
    disabled?: boolean;
    className?: string; // класс для стилизации компонента, пока он не открыт (поле даты)
    calendarClassName?: string; // класс для стилизации содержимого календаря (ниже хидера)
    calendarIconClassName?: string;
    icon?: ReactNode;
    dayClassName?: ((date: Date) => string) | null; // функция для стилизации даты в зависимости от даты, пример (date) => getDate(date) < Math.random() * 31 ? "random" : undefined
}