import React, { MouseEventHandler, useEffect, useRef } from "react";
import "./NotificationCard.css";
import { Button } from "@mui/material";
import { Notification, NotificationSeverity } from "../../../services/NotificationsService";
import { VscError, VscWarning, VscInfo } from "react-icons/vsc";
import { dateToLocaleString } from "../../../Utils";

interface NotificationCardProps
{
    notification: Notification;
    onCancel: (id: number) => void;
}

export const NotificationCard: React.FC<NotificationCardProps> = ({ notification, onCancel }) =>
{
    const cancelRef = useRef<HTMLButtonElement>(null);

    useEffect(() =>
    {
        cancelRef.current?.focus();
    }, [cancelRef]);

    const handleCancelNotification: MouseEventHandler = () =>
    {
        onCancel(notification.id);
    }
    return (
        <div
            className={"notification-panel " + (notification.severity === NotificationSeverity.ERROR? "error-panel"
                    :   notification.severity === NotificationSeverity.INFO? "info-panel"
                    :   "warning-panel")}
        >
            <div className="notification-toolbar">
                <div className="notification-date">{dateToLocaleString(notification.date)}</div>
                <Button
                    className="notification-button"
                    onClick={handleCancelNotification}
                >
                    Х
                </Button>
            </div>
            {notification.severity === NotificationSeverity.ERROR? 
                <VscError className="error-notification-icon" />
            : notification.severity === NotificationSeverity.INFO? 
                <VscInfo className="info-notification-icon" />
            : <VscWarning className="warning-notification-icon" />}
            <p className="notification-label">{notification.label}</p>
            <p className="notification-description">{notification.description}</p>
        </div>
    );
};
