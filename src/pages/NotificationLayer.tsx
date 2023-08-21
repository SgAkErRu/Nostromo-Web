import React, { useCallback, useContext, useEffect, useState } from "react";
import { PopupNotification } from "../components/Base/Notification/PopupNotification";
import { ModalNotification } from "../components/Base/Notification/ModalNotification";
import { NotificationsContext } from "../AppWrapper";
import { Notification, NotificationSeverity, NotificationType, useNotifications } from "../services/NotificationsService";
import { NOT_FOUND_IDX } from "../Utils";
import "./NotificationLayer.css"
import { MdError, MdInfo, MdWarning } from "react-icons/md";
import { VscError, VscInfo, VscWarning } from "react-icons/vsc";

const PANEL_HEIGHT_COEFFICIENT = 0.8;
const POPUP_HEIGHT = 120;
const MIN_POPUP_COUNT = 1;

const INFO_NOTIFICATION_CLOSE_TIMEOUT = 5000;
const COLLAPSE_TIME = 200;

export const NotificationLayer: React.FC = () =>
{
    const notificationService = useContext(NotificationsContext);
    const notificationList = useNotifications(notificationService);

    const [maxPopupCnt, setMaxPopupCnt] = useState<number>(Math.floor(PANEL_HEIGHT_COEFFICIENT * window.innerHeight / POPUP_HEIGHT));

    const handleResize = useCallback(() : void =>
    {
        setMaxPopupCnt(Math.floor(PANEL_HEIGHT_COEFFICIENT * window.innerHeight / POPUP_HEIGHT));
    }, []);

    useEffect(() => {
        window.addEventListener("resize", handleResize);
        
        return () =>
        {
            window.removeEventListener("resize", handleResize);
        }
    }, [handleResize]);
    
    const handleCancelNotification = (id: number): void =>
    {
        notificationService.remove(id);
    }

    const createCriticalNotification = (notification : Notification) : JSX.Element =>
    {
        let icon : JSX.Element = <></>;
        switch (notification.severity)
        {
            case NotificationSeverity.INFO:
                icon = <VscInfo className="info-notification-icon" />;
                break;
            case NotificationSeverity.WARNING:
                icon = <VscWarning className="warning-notification-icon" />;
                break;
            case NotificationSeverity.ERROR:
                icon = <VscError className="error-notification-icon" />;
                break;
        }
        return <ModalNotification notification={notification} headerIcon={icon} onCancel={handleCancelNotification} />;
    }

    const firstCriticalIdx = notificationList.findIndex(n => n.type === NotificationType.CRITICAL);
    const criticalNotificationComponent = firstCriticalIdx !== NOT_FOUND_IDX ? createCriticalNotification(notificationList[firstCriticalIdx]) : <></>;

    const popupNotifications : JSX.Element[] = [];
    const addPopup = (notification : Notification) : void =>
    {
        if (notification.type === NotificationType.POPUP)
        {
            let icon : JSX.Element = <></>;
            switch (notification.severity)
            {
                case NotificationSeverity.INFO:
                    icon = <MdInfo className="popup-icon info-notification-icon" />;
                    break;
                case NotificationSeverity.WARNING:
                    icon = <MdWarning className="popup-icon warning-notification-icon" />;
                    break;
                case NotificationSeverity.ERROR:
                    icon = <MdError className="popup-icon error-notification-icon" />;
                    break;
            }

            popupNotifications.push(
                <PopupNotification
                    key={notification.id}
                    notification={notification}
                    isAnimated={true}
                    onCancel={handleCancelNotification}
                    autocloseTime={notification.severity === NotificationSeverity.INFO ? INFO_NOTIFICATION_CLOSE_TIMEOUT : undefined}
                    collapseTime={COLLAPSE_TIME}
                    descriptionIcon={icon}
                />
            )
        }
    }

    const popupCnt = Math.min(Math.max(MIN_POPUP_COUNT, maxPopupCnt), notificationList.length);
    notificationList.slice(notificationList.length - popupCnt, notificationList.length).forEach(addPopup);

    return (
        <div id="notification-layer">
            {criticalNotificationComponent}
            <div className="notification-popup-container">
                {popupNotifications}
            </div>
        </div>
    );
};
