import { FC, useRef, useState } from "react";
import { ListItemButton, ListItemInput } from "../Base/List/ListItems";

interface BlockByIPProps
{
    name?: string;
}
export const BlockByIP: FC<BlockByIPProps> = ({ name }) =>
{
    const blockRef = useRef<HTMLButtonElement>(null);
    const unlockRef = useRef<HTMLButtonElement>(null);
    // IP
    const [ip, setIP] = useState<string>("");
    const elements: JSX.Element[] = [];

    const handleBlock = () : void =>
    {
        console.log("Заблокировать пользователя с IP: ", ip);
    }
    const handleUnlock = () : void =>
    {
        console.log("Разблокировать пользователя с IP: ", ip);
    } 

    elements.push(<p className="settings-category-label" key="labelBlockByIP">Блокировка по IP</p>);
    elements.push(<ListItemInput
                    key="ip"
                    label="IP - адрес"
                    description="Введите IP адрес пользователя"
                    value={ip}
                    onValueChange={(val) =>
                    {
                        setIP(val);
                    }}
                />);
    elements.push(<ListItemButton
                    key="block"
                    label="Нажмите, чтобы заблокировать выбранного пользователя"
                    btnRef={blockRef}
                    btnLabel="Заблокировать"
                    onBtnClick={handleBlock}
                />);
    elements.push(<ListItemButton
                    key="unlock"
                    label="Нажмите, чтобы разблокировать выбранного пользователя"
                    btnRef={unlockRef}
                    btnLabel="Разблокировать"
                    onBtnClick={handleUnlock}
                />);
    return (
        <>{elements}</>
    );
};
