import React, { MouseEventHandler, useEffect, useRef } from "react";
import "./SeverityError.css";
import { FocusTrap } from "../FocusTrap";
import { Button } from "@mui/material";
import { Notification } from "../../../services/NotificationsService";
import { VscError } from "react-icons/vsc";


interface SeverityErrorProps
{
    notification: Notification;
    onCancel: (id: number) => void;
}

export const SeverityError: React.FC<SeverityErrorProps> = ({ notification, onCancel }) =>
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
        <div id="severity-error" className="error-notification-panel">
            <FocusTrap>
                <Button
                    className="error-notification-button"
                    onClick={handleCancelNotification}
                >
                    Х
                </Button>
            </FocusTrap>
            <VscError className="error-notification-icon" />
            <p className="error-notification-label">{notification.label}</p>
            <p className="error-notification-description">{notification.description}</p>
        </div>
    );
};
