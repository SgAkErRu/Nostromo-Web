import React, { useEffect, useRef } from "react";
import "./RegularNotification.css";
import { Notification } from "../../../services/NotificationsService";
import { SeverityNotification } from "./SeverityNotification";

/* eslint-disable @typescript-eslint/no-unnecessary-condition */

interface RegularNotificationProps
{
    notification: Notification;
    onCancel: (id: number) => void;
}
export const RegularNotification: React.FC<RegularNotificationProps> = ({ notification, onCancel }) =>
{
    const cancelRef = useRef<HTMLButtonElement>(null);

    useEffect(() =>
    {
        cancelRef.current?.focus();
    }, [cancelRef]);
    return (
        <div id="regular-notification" className="regular-notification-area">
            <SeverityNotification notification={notification} onCancel={onCancel}/>
        </div>
    );
};
