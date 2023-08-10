import { FC, useRef, useState } from "react";
import { ListItemButton, ListItemInput, ListItemSelect, ListItemSwitch } from "../Base/List/ListItems";

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

    elements.push(<p className="settings-category-label" key="labelCreateRoom">Создание комнаты</p>);
    elements.push(<ListItemInput
                    key="roomName"
                    label="Название комнаты"
                    description="Введите название новой комнаты"
                    value={roomName}
                    onValueChange={(val) =>
                    {
                        setRoomName(val);
                    }}
                />);
    elements.push(<ListItemInput
                    key="roomPassword"
                    label="Пароль комнаты"
                    description="Введите пароль от новой комнаты, если он необходим"
                    value={roomPassword}
                    onValueChange={(val) =>
                    {
                        setRoomPassword(val);
                    }}
                />);
    const videocodecs: string[] = ["VP8", "VP9", "AV1", "Theora", "Daala"];
    elements.push(<ListItemSelect
                    key="roomCodec"
                    label="Видеокодек для комнаты"
                    value={roomCodec}
                    onValueChange={(val) =>
                    {
                        setRoomCodec(val);
                    }}
                    options={videocodecs}
                />
                );
    elements.push(<ListItemSwitch
                    key="saveHistory"
                    label="Сохранить историю чата ?"
                    value={saveHistory}
                    onValueChange={(val) =>
                    {
                        setSaveHistory(val);
                    }}
                />
                );
    elements.push(<ListItemSwitch
                    key="symmetricalMode"
                    label="Симметричный режим ?"
                    value={symmetricalMode}
                    onValueChange={(val) =>
                    {
                        setSymmetricalMode(val);
                    }}
                />
                );
    elements.push(<ListItemButton
                    key="createBtn"
                    label="Нажмите, чтобы создать комнату"
                    btnRef={createBtnRef}
                    btnLabel="Создать комнату"
                    onBtnClick={handleCreateRoom}
                />
                );
    return (
        <>{elements}</>
    );
};
