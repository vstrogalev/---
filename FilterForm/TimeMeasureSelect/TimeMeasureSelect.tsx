import React from 'react';
import { timeMeasureNames, TIME_MEASURE_UNIT } from "@constants";

import './TimeMeasureSelect.less';

type TTimeMeasureSelectProps = {
    measureUnit: TIME_MEASURE_UNIT;
    onSelect: (timeMeasureUnit: TIME_MEASURE_UNIT) => void
}

export const TimeMeasureSelect = ({measureUnit, onSelect}: TTimeMeasureSelectProps) => {
    const options = Object.entries(timeMeasureNames).map(([key, value]) => (
        <option value={key} key={key}>
            {value}
        </option>
    ));

    const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedValue = event.target.value as TIME_MEASURE_UNIT;
        onSelect(selectedValue)
    };

    return (
        <select 
            value={measureUnit} 
            onChange={handleSelectChange} 
            className='timeMeasureSelect' 
            data-testid="time-measure-select"
        >
            {options}
        </select>
    );
}
