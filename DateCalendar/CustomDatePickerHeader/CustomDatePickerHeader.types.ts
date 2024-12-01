export type TCustomHeaderProps = {
    date: Date;
    changeYear: (year: number) => void;
    changeMonth: (month: number) => void;
    prevMonthButtonDisabled?: boolean;
    nextMonthButtonDisabled?: boolean;
}