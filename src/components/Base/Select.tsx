
import "./Select.css";

import { FormControl, Select as MuiSelect, SelectProps as MuiSelectProps } from "@mui/material";
import { ReactNode, forwardRef } from "react";

interface SelectProps<T = unknown>
{
    id: string;
    children: ReactNode;
    value: MuiSelectProps<T>["value"];
    onChange: MuiSelectProps<T>["onChange"];
    open?: MuiSelectProps<T>["open"];
    onClose?: MuiSelectProps<T>["onClose"];
    onOpen?: MuiSelectProps<T>["onOpen"];
    transitionDuration?: number;
    variant?: MuiSelectProps<T>["variant"];
    autoFocus?: boolean;
    onKeyDown?: React.KeyboardEventHandler<HTMLInputElement>;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps<string>>(({
    id,
    value,
    onChange,
    open,
    onClose,
    onOpen,
    children,
    transitionDuration,
    variant = "outlined",
    autoFocus = false,
    onKeyDown
}, ref) =>
{
    return (
        <FormControl className="select-form-control" 
            onKeyDown={onKeyDown}
        > 
            <MuiSelect
                id={id}
                value={value}
                onChange={onChange}
                variant={variant}
                classes={{ select: "select-input" }}
                MenuProps={{ transitionDuration: transitionDuration }}
                autoFocus={autoFocus}
                open={open}
                onClose={onClose}
                onOpen={onOpen}
                ref={ref}
            >
                {children}
            </MuiSelect>
        </FormControl>
    );
});
