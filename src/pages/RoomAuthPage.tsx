
import React, { FormEvent, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Header } from "../components/Header";

import "../App.css";
import "./RoomAuthPage.css";

import { encode } from "js-base64";
import { isEmptyString } from "../Utils";

interface RoomAuthPageProps
{
    ready: boolean;
    roomName: string;
    setAuth: (isAuth: boolean) => void;
}

export const RoomAuthPage: React.FC<RoomAuthPageProps> = ({ ready, roomName, setAuth }) =>
{
    const { id } = useParams();
    const [status, setStatus] = useState<string>("");
    const [pass, setPass] = useState("");

    const handleSubmit = (ev: FormEvent<HTMLFormElement>): void =>
    {
        ev.preventDefault();

        if (id === undefined)
        {
            return;
        }

        const passBase64 = encode(pass);

        const fetchRequest = async (): Promise<void> =>
        {
            const res = await fetch(`${process.env.REACT_APP_BACKEND_PATH ?? ""}/api/r/${id}`, {
                headers: {
                    // eslint-disable-next-line @typescript-eslint/naming-convention
                    "Authorization": passBase64
                }
            });

            if (res.status === 200)
            {
                setAuth(true);
            }
            else if (res.status === 401 || res.status === 403)
            {
                setStatus("Неправильный пароль!");
            }
            else
            {
                setStatus("Непредвиденная ошибка!");
            }
        };

        void fetchRequest();
    };

    const authForm = (
        <form id="auth" onSubmit={handleSubmit}>
            {isEmptyString(status) ? <></> : <span className="m-a" id="status">{status}</span>}
            <span className="m-a">Вход в комнату</span>
            <span className="m-a" id="room-name" title={roomName}>{roomName}</span>
            <input id="pass"
                type="password"
                placeholder="Введите пароль"
                value={pass}
                onChange={
                    (ev) => { setPass(ev.target.value); }
                }
            />
            <input id="btn-join" type="submit" value="Войти" />
        </form>
    );

    useEffect(() =>
    {
        document.title = "Nostromo - Авторизация в комнате";
    }, []);

    return (
        <>
            <Header title="Авторизация в комнате" />
            <div id="main">
                {ready ? authForm : <p className="flex-centered">Ожидание ответа от сервера...</p>}
            </div>
        </>
    );
};
