import React, { useEffect, useState } from "react";

import "../App.css";
import { RoomAuthPage } from "./RoomAuthPage";
import { RoomPage } from "./RoomPage";
import { useParams, useSearchParams } from "react-router-dom";

export const RoomWrapperPage: React.FC = () =>
{
    const { id } = useParams();
    const [searchParams] = useSearchParams();

    const [isInitRequestDone, setIsInitRequestDone] = useState(false);

    //TODO: убрать обратно на false
    const [auth, setAuth] = useState(false);

    // Делаем запрос к API, так как:
    // 1. возможно мы авторизованы в комнате
    // 2. если есть query с паролем - то вставляем его в запрос
    useEffect(() =>
    {
        if (id === undefined)
        {
            return;
        }

        // TODO: нужно получить название комнаты в результате этого запроса
        const fetchRequest = async (): Promise<void> =>
        {
            let fetchPath = `${process.env.REACT_APP_BACKEND_PATH ?? ""}/api/r/${id}`;

            const passQuery = searchParams.get("p");

            if (passQuery !== null)
            {
                fetchPath += `?p=${passQuery}`;
            }

            const res = await fetch(fetchPath);

            if (res.status === 200)
            {
                setAuth(true);
            }

            setIsInitRequestDone(true);
        };

        void fetchRequest();
    }, [id, searchParams]);

    const afterInitRequest = (
        auth ? <RoomPage /> : <RoomAuthPage setAuth={setAuth} />
    );

    return (
        isInitRequestDone ? afterInitRequest : <>{"wait"}</>
    );
};
