import { ChangeEventHandler, FC, useRef, useState } from "react";
import "./BlockByIP.css";
import { Button } from "@mui/material";
import { Input } from "../Base/Input";

export const BlockByIP: FC = () =>
{
    const inputRef = useRef<HTMLInputElement>(null);
    // IP
    const [ip, setIP] = useState<string>("");

    const handleBlock = () : void =>
    {
        console.log("Заблокировать пользователя с IP: ", ip);
    }
    const handleUnlock = () : void =>
    {
        console.log("Разблокировать пользователя с IP: ", ip);
    }
    const handleFocus = () : void =>
    {
        inputRef.current?.focus();
    }

    const handleInputChange : ChangeEventHandler<HTMLInputElement> = (ev) =>
    {
        setIP(ev.target.value);
    }

    const desc = "Введите IP - адрес пользователя, чтобы заблокировать или разблокировать его";
    return (
        <>
            <div className="lock-area" key="lock-area">
                <div className="lock-input-area" onClick={handleFocus}>
                    <p className="lock-input-label text-wrap">IP - адрес</p>
                    <Input className="lock-input" ref={inputRef} value={ip} onChange={handleInputChange}/>
                    <p className="list-item-description">{desc}</p>
                </div>
                <div className="lock-button-area">
                    <Button className="lock-button warning" onClick={handleBlock}>Заблокировать</Button>
                    <Button className="lock-button" onClick={handleUnlock}>Разблокировать</Button>
                </div>
            </div>
        </>
    );
};
