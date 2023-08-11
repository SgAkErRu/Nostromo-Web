
import React, { FormEvent, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Header } from "../components/Header";

import "../App.css";
import "./RoomAuthPage.css";

import { encode, decode } from "js-base64";

interface Params
{
    setAuth: (isAuth: boolean) => void;
}

export const RoomAuthPage: React.FC<Params> = ({ setAuth }) =>
{
    const { id } = useParams();
    const [status, setStatus] = useState(true);
    const [pass, setPass] = useState("");

    const roomName = "Тестовая";

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
            else
            {
                setStatus(false);
            }
        };

        void fetchRequest();
    };

    useEffect(() =>
    {
        document.title = "Nostromo - Авторизация в комнате";
    }, []);

    return (
        <>
            <Header title="Авторизация в комнате" />
            <div id="main">
                <form id="auth" autoComplete="on" onSubmit={handleSubmit}>
                    {!status ? <span className="m-a" id="status">Неправильный пароль!</span> : <></>}
                    <span className="m-a">Вход в комнату</span>
                    <span className="m-a" id="room-name" title={roomName}>{roomName}</span>
                    <input
                        id="pass"
                        type="password"
                        name="password"
                        placeholder="Введите пароль"
                        value={pass}
                        onChange={
                            (ev) => { setPass(ev.target.value); }
                        }
                    />
                    <input id="btn-join" type="submit" value="Войти" />
                </form>
            </div>
        </>
    );
};
