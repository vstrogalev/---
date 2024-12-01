import React from "react"
import { TDayCertainProps } from "./DayCertain.types"
import { Button, ButtonType } from "@components/Button";

export const DayCertain = ({ text, state, onChange }: TDayCertainProps): JSX.Element => {
    const handleClick = () => {
        if (typeof onChange === 'function') {
            onChange(!state)
        }
    }

    return (
        <Button customStyle={{height: 32}} text={text} onClick={handleClick} type={state ? ButtonType.Primary : ButtonType.Outline} />
    )
}