import React, { forwardRef, useState } from "react";
import "./Input.css";
import { Button } from "@mui/material";
import { IoMdEye, IoMdEyeOff } from "react-icons/io";

interface InputBaseProps extends React.HTMLAttributes<HTMLInputElement>
{
    value: string;
    onChange: React.ChangeEventHandler<HTMLInputElement>;
    password?: boolean;
}
const InputBase = forwardRef<HTMLInputElement, InputBaseProps>((
    { value, onChange, password = false, ...props }, ref
) =>
{
    return (
        <input ref={ref}
            type={password ? "password" : "text"}
            className="input"
            value={value}
            onChange={onChange}
            {...props}
        />
    );
});

const InputWithPassword = forwardRef<HTMLInputElement, InputBaseProps>((
    { ...props }, ref
) =>
{
    const [hiddenPassword, setHiddenPassword] = useState(true);

    const handleClickButton: React.MouseEventHandler<HTMLButtonElement> = (ev) =>
    {
        ev.preventDefault();
        ev.stopPropagation();

        setHiddenPassword(prev => !prev);
    };

    return (
        <div className="input-with-password-container">
            <InputBase ref={ref}
                password={hiddenPassword}
                {...props}
            />
            <Button
                className="input-hide-password-button"
                onClick={handleClickButton}
                disableRipple
            >
                {hiddenPassword ? <IoMdEye /> : <IoMdEyeOff />}
            </Button>
        </div>
    );
});

export const Input = forwardRef<HTMLInputElement, InputBaseProps>((
    { password = false, ...props }, ref
) =>
{
    return (
        password
            ? <InputWithPassword ref={ref} {...props} />
            : <InputBase ref={ref} {...props} />
    );
});
