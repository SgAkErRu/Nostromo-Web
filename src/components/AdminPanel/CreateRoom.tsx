import { FC, useRef, useState } from "react";
import { ListItemButton, ListItemInput, ListItemSelect, ListItemSwitch } from "../Base/List/ListItems";
import { List } from "../Base/List/List";

export const CreateRoom: FC = () =>
{
    // Название новой комнаты
    const [roomName, setRoomName] = useState<string>("");
    // Пароль новой комнаты
    const [roomPassword, setRoomPassword] = useState<string>("");
    // Видеокодек для комнаты
    const [roomCodec, setRoomCodec] = useState<string>("");
    // Сохранить историю чата ?
    const [saveHistory, setSaveHistory] = useState<boolean>(false);
    // Симетричный режим ?
    const [symmetricalMode, setSymmetricalMode] = useState<boolean>(false);
    const elements: JSX.Element[] = [];
    // Ссылка на кнопку для фокуса (чтобы можно было нажать клавиатурой)
    const createBtnRef = useRef<HTMLButtonElement>(null);

    const handleCreateRoom = () : void =>
    {
        console.log("Данные новой комнаты: ");
        console.log("Name: ", roomName);
        console.log("Password: ", roomPassword);
        console.log("Codec: ", roomCodec);
        console.log("Save History ? ", saveHistory);
        console.log("Symmetrical mode ? ", symmetricalMode);
    }
    const videocodecs: string[] = ["VP8", "VP9", "AV1", "Theora", "Daala"];
    elements.push(<p className="settings-category-label" key="labelCreateRoom">Создание комнаты</p>);
    elements.push(<List key="createRoomList"><ListItemInput
                    key="roomName"
                    label="Название комнаты"
                    description="Введите название новой комнаты"
                    value={roomName}
                    onValueChange={(val) =>
                    {
                        setRoomName(val);
                    }}
                />
                <ListItemInput
                    key="roomPassword"
                    label="Пароль комнаты"
                    description="Введите пароль от новой комнаты, если он необходим"
                    value={roomPassword}
                    onValueChange={(val) =>
                    {
                        setRoomPassword(val);
                    }}
                />
                <ListItemSelect
                    key="roomCodec"
                    label="Видеокодек для комнаты"
                    value={roomCodec}
                    onValueChange={(val) =>
                    {
                        setRoomCodec(val);
                    }}
                    options={videocodecs}
                />
                <ListItemSwitch
                    key="saveHistory"
                    label="Сохранить историю чата ?"
                    value={saveHistory}
                    onValueChange={(val) =>
                    {
                        setSaveHistory(val);
                    }}
                />
                <ListItemSwitch
                    key="symmetricalMode"
                    label="Симметричный режим ?"
                    value={symmetricalMode}
                    onValueChange={(val) =>
                    {
                        setSymmetricalMode(val);
                    }}
                />
                <ListItemButton
                    key="createBtn"
                    btnRef={createBtnRef}
                    showSeparator={false}
                    btnLabel="Создать комнату"
                    onBtnClick={handleCreateRoom}
                />
                </List>); 
    return (
        <>{elements}</>
    );
};
