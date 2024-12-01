import React, { useEffect, useState } from 'react';
import ReactModal from 'react-modal';
import { startOfDay, endOfDay, startOfYesterday, endOfYesterday, startOfToday, endOfToday, isEqual, lightFormat } from 'date-fns';

import { TIME_MEASURE_UNIT, timeMeasureNames } from '@constants';
import { IFilterFormProps, TFilterForm } from './FilterForm.types';

import './FilterForm.less'
import { TimeMeasureSelect } from './TimeMeasureSelect/TimeMeasureSelect';
import { DatePeriod } from './DatePeriod/DatePeriod';
import { DayCertain } from './DayCertain/DayCertain';
import { Input } from '@components/Items/Input';
import { Button, ButtonType } from '@components/Button';

const initialFilterFormData: TFilterForm = {
    dateStart: startOfToday(),
    dateEnd: endOfToday(),
    period: {
        measureUnit: null,
        value: null,
    }
}

export const filterPhrase = (filter: TFilterForm): string => {
    if (!filter.dateStart && !filter.dateEnd && !filter.period.value && !filter.period.measureUnit) {
        return 'Фильтр не установлен'
    }
    
    if (filter.dateStart && filter.dateEnd) {
        const start = lightFormat(filter.dateStart, 'dd.MM.yyyy')
        const end = lightFormat(filter.dateEnd, 'dd.MM.yyyy')
        return `${start} - ${end}`
    }
    
    if (!filter.dateStart && !filter.dateEnd && filter.period.value && filter.period.measureUnit) {
        return `Последний ${filter.period.value} ${timeMeasureNames[filter.period.measureUnit]}`
    }
}

/* ПРИМЕР применения фильтра
export const ParentComponent = () => {
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [filterFormData, setFilterFormData] = useState<TFilterForm>(initialFilterFormData);
    const buttonRef = useRef<HTMLDivElement>(null);

    const handleCloseFilterForm = (result: TFilterForm) => {
        setFilterFormData(result)
        setIsFilterOpen(false)
    }

    return (
        <div className="control_channels_container">
            PARENT COMPONENT
            <div ref={buttonRef} style={{display: 'flex', justifyContent: 'center', width: 500}}>
                <Button text={filterPhrase(filterFormData)} onClick={() => setIsFilterOpen(true)} />
            </div>
            {isFilterOpen && 
                <FilterForm 
                    filterFormData={filterFormData}
                    nodeElement={buttonRef.current}  
                    getResultOnClose={handleCloseFilterForm} 
                />
            }
        </div>
    );
};

*/

/**
 * Компонент формы фильтрации дат в модальном окне.
 * 
 * @component
 * @param {TFilterForm} props.filterFormData - Начальные данные формы фильтрации.
 * @param {HTMLElement} props.nodeElement - DOM элемент, вызвавший модальное окно.
 * @param {boolean} props.isFilterOpen - Флаг, определяющий, открыто ли модальное окно.
 * @param {Function} props.getResultOnClose - Функция, вызываемая при закрытии модального окна с результатами.
 * 
 * @returns {JSX.Element} Возвращает JSX элемент с модальной формой фильтрации.
 */
export const FilterForm = ({ nodeElement, getResultOnClose, filterFormData = initialFilterFormData }: IFilterFormProps): JSX.Element => {
    const [formData, setFormData] = useState<TFilterForm>(filterFormData); // данные формы
    const [isYesterdayOn, setIsYesterdayOn] = useState<boolean>(); // активирована кнопка Вчера
    const [isTodayOn, setIsTodayOn] = useState<boolean>(); // активирована кнопка Сегодня
    const [isCustomPeriodOn, setIsCustomPeriodOn] = useState<boolean>(); // активирована кнопка Последний
    const [measureUnit, setMeasureUnit] = useState<TIME_MEASURE_UNIT>(filterFormData.period.measureUnit ?? TIME_MEASURE_UNIT.Second); // выбранная единица измерения
    const [customPeriodValue, setCustomPeriodValue] = useState(filterFormData.period.value ?? 0); // количество в единицах измерения

    useEffect(() => {
        if (!formData) return;

        setIsYesterdayOn(isEqual(formData.dateStart, startOfYesterday()) && isEqual(formData.dateEnd, endOfYesterday()));
        setIsTodayOn(isEqual(formData.dateStart, startOfToday()) && isEqual(formData.dateEnd, endOfToday()));
        setIsCustomPeriodOn(!formData.dateStart && !formData.dateEnd && !!formData.period.value);
    }, [formData])

    // для корректировки стилей ReactModal для позиционирования от элемента, который вызвал модальное окно
    const resetModalStyles = nodeElement ? {
        overlay: {
            inset: 0,
            backgroundColor: 'transparent',
        },
        content: {
            inset: 0,
            top: nodeElement.getBoundingClientRect().top,
            left: nodeElement.getBoundingClientRect().left,
            padding: 16,
            alignItems: 'start',
            justifyContent: 'start',
            background: 'white',
        }
    } : {};

    const handleCloseModal = () => {
        const periodData: TFilterForm = isCustomPeriodOn
        ? { dateStart: null, dateEnd: null, period: formData.period }
        : { dateStart: formData.dateStart, dateEnd: formData.dateEnd, period: { measureUnit: null, value: null } };

        getResultOnClose(periodData);
    }

    const handleResetFilter = () => {
        const resetData: TFilterForm = { dateStart: null, dateEnd: null, period: { measureUnit: null, value: null } }
        setFormData(resetData);
    }

    const handlePeriodSet = (dateStart: Date | null, dateEnd: Date | null) => {
        setFormData(prev => {
            return {
                ...prev,
                dateStart: dateStart ? startOfDay(dateStart): null,
                dateEnd: dateEnd ? endOfDay(dateEnd) : null,
            }
        })
    }

    const handleYesterdayChange = () => {
        setFormData(prev => ({
            ...prev,
            dateStart: startOfYesterday(),
            dateEnd: endOfYesterday(),
        }));
    }

    const handleTodayChange = () => {
        setFormData({
            dateStart: startOfToday(),
            dateEnd: endOfToday(),
            period: {
                ...filterFormData.period
            }
        });
    }

    const handleCustomPeriodChange = (state: boolean) => {
        if (!customPeriodValue) return;

        setIsCustomPeriodOn(state);
        setIsTodayOn(false);
        setIsYesterdayOn(false);
    }

    const handleCustomPeriodValueChanged = (value: number) => {
        setFormData(prev => {
            return {
                dateStart: null,
                dateEnd: null,
                period: {
                    measureUnit: prev.period.measureUnit ?? TIME_MEASURE_UNIT.Second,
                    value: value
                }
            }
        });
        setCustomPeriodValue(value);

        setIsCustomPeriodOn(!!value); // кнопка Последнее активируется, если не 0 и деактивируется, если 0
    }

    const handleTimeMeasureSelect = (selectedValue: TIME_MEASURE_UNIT) => {
        if (!customPeriodValue) return;
        setMeasureUnit(selectedValue);

        setFormData(prev => {
            return {
                ...prev,
                period: {
                    ...prev.period,
                    measureUnit: selectedValue
                }
            }
        })
    }

    if (!formData) return null;

    return (
        <>
            <ReactModal
                isOpen
                shouldCloseOnOverlayClick={true}
                shouldCloseOnEsc={true}
                onRequestClose={handleCloseModal}
                appElement={nodeElement}
                className="filterForm"
                style={resetModalStyles ?? {}}
            >
                <>
                    <DatePeriod dateStart={formData.dateStart} dateEnd={formData.dateEnd} onPeriodSet={handlePeriodSet} />
                    <div className="filterForm__divider" />
                    <div className="filterForm__certainDays">
                        <DayCertain text='Вчера' state={isYesterdayOn} onChange={handleYesterdayChange}/>
                        <DayCertain text='Сегодня' state={isTodayOn} onChange={handleTodayChange}/>
                    </div>
                    <div className="filterForm__divider" />
                    <div className="filterForm__customPeriod">
                        <DayCertain 
                            text='Последний' 
                            state={isCustomPeriodOn} 
                            onChange={handleCustomPeriodChange}
                        />

                        <Input 
                            value={customPeriodValue} 
                            specType='number' 
                            onChange={handleCustomPeriodValueChanged} 
                            className='filterForm__customPeriodValue'
                        /> 
                        <TimeMeasureSelect 
                            measureUnit={measureUnit} 
                            onSelect={handleTimeMeasureSelect} 
                        />
                    </div>
                    <div className="filterForm__divider" />
                    <div className="filterForm__footer">
                        <Button text='Очистить' type={ButtonType.Plain} onClick={handleResetFilter}/>
                        <Button text='Отменить' type={ButtonType.Plain} onClick={() => getResultOnClose(filterFormData)}/>
                        <Button text='Применить' type={ButtonType.Primary} onClick={handleCloseModal} />
                    </div>
                </>
            </ReactModal >
        </>
    )
}