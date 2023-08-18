import React, { MouseEventHandler, useEffect, useRef } from "react";
import "./SeverityNotification.css";
import { Button } from "@mui/material";
import { Notification, NotificationSeverity } from "../../../services/NotificationsService";
import { VscError, VscWarning, VscInfo } from "react-icons/vsc";
import { dateToLocaleString } from "../../../Utils";

interface SeverityNotificationProps
{
    notification: Notification;
    onCancel: (id: number) => void;
}

export const SeverityNotification: React.FC<SeverityNotificationProps> = ({ notification, onCancel }) =>
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
            className={ notification.severity === NotificationSeverity.ERROR? "error-notification-panel"
                    :   notification.severity === NotificationSeverity.INFO? "info-notification-panel"
                    :   "warning-notification-panel"}
        >
            <div className="notification-toolbar">
                <div className="notification-date">{dateToLocaleString(notification.date)}</div>
                <Button
                className={ notification.severity === NotificationSeverity.ERROR? "error-notification-button"
                        :   notification.severity === NotificationSeverity.INFO? "info-notification-button"
                        :   "warning-notification-button"}
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
            <p className={ notification.severity === NotificationSeverity.ERROR? "error-notification-label"
                       :   notification.severity === NotificationSeverity.INFO? "info-notification-label"
                       : "warning-notification-label"}>{notification.label}</p>
            <p className={ notification.severity === NotificationSeverity.ERROR? "error-notification-description"
                       :   notification.severity === NotificationSeverity.INFO? "info-notification-description"
                       :   "warning-notification-description"}>{notification.description}</p>
        </div>
    );
};
