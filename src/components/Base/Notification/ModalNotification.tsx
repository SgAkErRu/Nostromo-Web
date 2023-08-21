import React, { MouseEventHandler, useEffect, useRef } from "react";
import { Notification, NotificationSeverity } from "../../../services/NotificationsService";
import { FocusTrap } from "../FocusTrap";
import "./ModalNotification.css"
import { Button, Tooltip } from "@mui/material";
import { getTimestamp } from "../../../Utils";

interface ModalNotificationProps
{
    notification: Notification;
    onCancel: (id: number) => void;
    headerIcon? : JSX.Element;
}

export const ModalNotification: React.FC<ModalNotificationProps> = ({ notification, onCancel, headerIcon }) =>
{
    const copyRef = useRef<HTMLButtonElement>(null);

    useEffect(() =>
    {
        copyRef.current?.focus();
    }, [copyRef]);

    const handleCancelNotification: MouseEventHandler = () =>
    {
        onCancel(notification.id);
    }

    let panelClass = "";
    switch (notification.severity)
    {
        case NotificationSeverity.INFO:
            panelClass = "modal-notification-area info-modal-notification-background";
            break;
        case NotificationSeverity.WARNING:
            panelClass = "modal-notification-area warning-modal-notification-background";
            break;
        case NotificationSeverity.ERROR:
            panelClass = "modal-notification-area error-modal-notification-background";
            break;
    }

    const handleCopyClick : MouseEventHandler = async () =>
    {
        await navigator.clipboard.writeText(notification.description);
    }

    return (
        <div className="backdrop">
            <FocusTrap>
                <div className={panelClass}> 
                    <div className="modal-notification-header-area">
                        {headerIcon !== undefined ? <div className="modal-notification-header-icon">{headerIcon}</div> : <></>}
                        <Tooltip title={notification.label} placement="top">
                            <div className="modal-notification-header">
                                {notification.label}
                            </div>
                        </Tooltip>
                        <div className="modal-notification-header-date">{getTimestamp(notification.date.milliseconds)}</div>
                        <Button
                            className="modal-notification-close-button"
                            onClick={handleCancelNotification}
                        >
                            Х
                        </Button>
                    </div>
                    <div className="modal-notification-description-area">
                        <div className="modal-notification-description">{notification.description}</div>
                    </div>
                    <div className="modal-notification-toolbar">
                        <Button
                            className="modal-notification-toolbar-button"
                            onClick={handleCopyClick}
                            ref={copyRef}
                        >
                            Копировать
                        </Button>
                        <Button
                            className="modal-notification-toolbar-button"
                            onClick={handleCancelNotification}
                        >
                            Ок
                        </Button>
                    </div>
                </div>
            </FocusTrap>
        </div>
    );
};
