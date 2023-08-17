import React, { MouseEventHandler, useEffect, useRef } from "react";
import "./SeverityWarning.css";
import { FocusTrap } from "../FocusTrap";
import { Button } from "@mui/material";
import { Notification } from "../../../services/NotificationsService";
import { VscWarning } from "react-icons/vsc";


interface SeverityWarningProps
{
    notification: Notification;
    onCancel: (id: number) => void;
}

export const SeverityWarning: React.FC<SeverityWarningProps> = ({ notification, onCancel }) =>
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
        <div id="severity-warning" className="warning-notification-panel">
            <FocusTrap>
                <Button
                    className="warning-notification-button"
                    onClick={handleCancelNotification}
                >
                    Х
                </Button>
            </FocusTrap>
            <VscWarning className="warning-notification-icon" />
            <p className="warning-notification-label">{notification.label}</p>
            <p className="warning-notification-description">{notification.description}</p>
        </div>
    );
};
