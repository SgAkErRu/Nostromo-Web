import React, { useEffect, useRef } from "react";
import "./RegularNotification.css";
import { Notification, NotificationSeverity } from "../../../services/NotificationsService";
import { SeverityWarning } from "./SeverityWarning";
import { SeverityInfo } from "./SeverityInfo";
import { SeverityError } from "./SeverityError";

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
