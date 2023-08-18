import React, { useContext, useEffect, useRef } from "react";
import { PopupNotification } from "../components/Base/Notification/PopupNotification";
import { ModalNotification } from "../components/Base/Notification/ModalNotification";
import { NotificationsContext } from "../AppWrapper";
import { NotificationSeverity, NotificationType, useNotifications } from "../services/NotificationsService";
import { NOT_FOUND_IDX } from "../Utils";
import "./NotificationLayer.css"

const INFO_NOTIFICATION_CLOSE_TIMEOUT = 5000;
const COLLAPSE_TIME = 200;

export const NotificationLayer: React.FC = () =>
{
    const endAnchorRef = useRef<HTMLDivElement>(null);
    const notificationService = useContext(NotificationsContext);
    const notificationList = useNotifications(notificationService);

    useEffect(() => {
        if (endAnchorRef.current)
        {
            endAnchorRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [notificationList]);

    const handleCancelNotification = (id: number): void =>
    {
        notificationService.remove(id);
    }

    const firstCriticalIdx = notificationList.findIndex(n => n.type === NotificationType.CRITICAL);
    const criticalNotificationComponent = firstCriticalIdx !== NOT_FOUND_IDX ? <ModalNotification notification={notificationList[firstCriticalIdx]} onCancel={handleCancelNotification} /> : <></>;

    return (
        <div id="notification-layer">
            {criticalNotificationComponent}
            <div className="notification-popup-container">
                {notificationList.filter(p => p.type === NotificationType.POPUP).map(n => {
                    return (
                        <PopupNotification
                            key={n.id}
                            notification={n}
                            isAnimated={true}
                            onCancel={handleCancelNotification}
                            autocloseTime={n.severity === NotificationSeverity.INFO ? INFO_NOTIFICATION_CLOSE_TIMEOUT : undefined}
                            collapseTime={COLLAPSE_TIME}
                        />
                    );
                })}
                <div ref={endAnchorRef} />
            </div>
        </div>
    );
};
