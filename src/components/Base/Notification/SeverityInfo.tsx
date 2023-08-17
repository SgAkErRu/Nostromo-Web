import React, { MouseEventHandler, useEffect, useRef } from "react";
import "./SeverityInfo.css";
import { FocusTrap } from "../FocusTrap";
import { Button } from "@mui/material";
import { Notification } from "../../../services/NotificationsService";
import { VscInfo } from "react-icons/vsc";


interface SeverityInfoProps
{
    notification: Notification;
    onCancel: (id: number) => void;
}

export const SeverityInfo: React.FC<SeverityInfoProps> = ({ notification, onCancel }) =>
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
        <div id="severity-info" className="info-notification-panel">
            <FocusTrap>
                <Button
                    className="info-notification-button"
                    onClick={handleCancelNotification}
                >
                    Х
                </Button>
            </FocusTrap>
            <VscInfo className="info-notification-icon" />
            <p className="info-notification-label">{notification.label}</p>
            <p className="info-notification-description">{notification.description}</p>
        </div>
    );
};
