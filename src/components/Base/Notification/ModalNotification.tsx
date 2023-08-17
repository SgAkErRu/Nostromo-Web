import React, { useEffect, useRef } from "react";
import { Notification, NotificationSeverity } from "../../../services/NotificationsService";
import { SeverityWarning } from "./SeverityWarning";
import { SeverityInfo } from "./SeverityInfo";
import { SeverityError } from "./SeverityError";

/* eslint-disable @typescript-eslint/no-unnecessary-condition */

interface ModalNotificationProps
{
    notification: Notification;
    onCancel: (id: number) => void;
}

export const ModalNotification: React.FC<ModalNotificationProps> = ({ notification, onCancel }) =>
{
    const cancelRef = useRef<HTMLButtonElement>(null);

    useEffect(() =>
    {
        cancelRef.current?.focus();
    }, [cancelRef]);

    return (
        <div id="modal-notification" className="backdrop">
            {notification.severity === NotificationSeverity.WARNING?
                <SeverityWarning notification={notification} onCancel={onCancel}/>
            : notification.severity === NotificationSeverity.INFO?
                <SeverityInfo notification={notification} onCancel={onCancel} />
            : notification.severity === NotificationSeverity.ERROR?
                <SeverityError notification={notification} onCancel={onCancel} />
            : <></>    
            }
        </div>
    );
};
