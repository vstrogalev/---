import { TDatePeriodParams } from "../FilterForm.types";

export type TDatePeriodProps = TDatePeriodParams & {
    onPeriodSet: (dateStart: Date | null, dateEnd: Date | null) => void;
}