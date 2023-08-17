import React, { MouseEventHandler, useEffect, useRef } from "react";
import "./SeverityNotification.css";
import { FocusTrap } from "../FocusTrap";
import { Button } from "@mui/material";
import { Notification, NotificationSeverity } from "../../../services/NotificationsService";
import { VscError, VscWarning, VscInfo } from "react-icons/vsc";

/* eslint-disable @typescript-eslint/no-unnecessary-condition */

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
        <div id="severity-notification" 
            className={ notification.severity === NotificationSeverity.ERROR? "error-notification-panel"
                    :   notification.severity === NotificationSeverity.INFO? "info-notification-panel"
                    :   notification.severity === NotificationSeverity.WARNING? "warning-notification-panel" : ""}>
            <FocusTrap>
                <Button
                    className={ notification.severity === NotificationSeverity.ERROR? "error-notification-button"
                            :   notification.severity === NotificationSeverity.INFO? "info-notification-button"
                            :   notification.severity === NotificationSeverity.WARNING? "warning-notification-button" : ""}
                    onClick={handleCancelNotification}
                >
                    Х
                </Button>
            </FocusTrap>
            {notification.severity === NotificationSeverity.ERROR? 
                <VscError className="error-notification-icon" />
            : notification.severity === NotificationSeverity.INFO? 
                <VscInfo className="info-notification-icon" />
            : notification.severity === NotificationSeverity.WARNING? 
                <VscWarning className="warning-notification-icon" /> 
            : <></>}
            <p className={ notification.severity === NotificationSeverity.ERROR? "error-notification-label"
                       :   notification.severity === NotificationSeverity.INFO? "info-notification-label"
                       :   notification.severity === NotificationSeverity.WARNING? "warning-notification-label" : ""}>{notification.label}</p>
            <p className={ notification.severity === NotificationSeverity.ERROR? "error-notification-description"
                       :   notification.severity === NotificationSeverity.INFO? "info-notification-description"
                       :   notification.severity === NotificationSeverity.WARNING? "warning-notification-description" : ""}>{notification.description}</p>
        </div>
    );
};
