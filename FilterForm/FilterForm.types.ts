import { TIME_MEASURE_UNIT } from "@constants";

export type TDatePeriodParams = {
    dateStart: Date | null;
    dateEnd: Date | null;
};

export type TFilterForm = TDatePeriodParams & {
    period: {
        measureUnit: TIME_MEASURE_UNIT | null,
        value: number | null
    }
}

export interface IFilterFormProps {
    nodeElement: HTMLElement | null; // элемент, к которому выполняется привязка модального окна. В вызывающем компоненте Надо получить ref элемента, от которого открываем окно (например, кнопка), и передать current. 
    getResultOnClose: (result: TFilterForm) => void // передача результата выбора фильтра наверх
    filterFormData?: TFilterForm; // объект данных формы фильтра и начальные значения
}

/* пример
<div ref={buttonRef}>
    <Button text="CLICK ME" onClick={() => setIsFilterOpen(true)} />
</div>
<FilterForm nodeElement={buttonRef.current} isFilterOpen={isFilterOpen} getResultOnClose={(result) => alert(result)} />
*/