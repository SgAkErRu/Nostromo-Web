import { Button } from "@mui/material";
import React, { MouseEventHandler, useCallback, useEffect, useRef, useState } from "react";
import { MdClose } from "react-icons/md";
import { getTimestamp } from "../../../utils/Utils";
import { DO_NOT_STOP_AUTOCLOSE_TIMER, StopAutocloseTimerSemaphore } from "../../../pages/NotificationLayer";
import { Notification, NotificationSeverity } from "../../../services/NotificationsService";
import { ModalNotification } from "./ModalNotification";
import "./PopupNotification.css";

const DISABLE_TIMER = 0;

interface PopupNotificationProps
{
    notification: Notification;
    onCancel: (id: number) => void;
    stopAutocloseTimerSemaphore: StopAutocloseTimerSemaphore;
    autocloseTime?: number;
    collapseTime?: number;
    headerIcon?: JSX.Element;
    descriptionIcon?: JSX.Element;
}
export const PopupNotification: React.FC<PopupNotificationProps> = ({
    notification,
    onCancel,
    stopAutocloseTimerSemaphore,
    autocloseTime = DISABLE_TIMER,
    collapseTime = DISABLE_TIMER,
    headerIcon,
    descriptionIcon
}) =>
{
    const timerRef = useRef<number | null>(null);
    const [isClosed, setIsClosed] = useState<boolean>(false);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

    const handleCancelNotification = useCallback((): void =>
    {
        if (collapseTime !== DISABLE_TIMER)
        {
            setIsClosed(true);
            setTimeout(() =>
            {
                onCancel(notification.id);
            }, collapseTime);
        }
        else
        {
            onCancel(notification.id);
        }
    }, [notification.id, onCancel, collapseTime]);

    useEffect(() =>
    {
        if (autocloseTime !== DISABLE_TIMER
            && stopAutocloseTimerSemaphore.counter === DO_NOT_STOP_AUTOCLOSE_TIMER)
        {
            timerRef.current = window.setTimeout(handleCancelNotification, autocloseTime);
        }
        else if (timerRef.current !== null
            && stopAutocloseTimerSemaphore.counter !== DO_NOT_STOP_AUTOCLOSE_TIMER)
        {
            window.clearTimeout(timerRef.current);
        }

        return () =>
        {
            if (timerRef.current !== null)
            {
                clearTimeout(timerRef.current);
            }
        };
    }, [autocloseTime, handleCancelNotification, stopAutocloseTimerSemaphore]);

    const transitionTime = collapseTime !== DISABLE_TIMER ? `opacity ${collapseTime}ms` : undefined;
    const style = isClosed ? { opacity: 0, transition: transitionTime } : { transition: transitionTime };

    const getPanelStyleBySeverity = (severity: NotificationSeverity): string =>
    {
        switch (severity)
        {
            case NotificationSeverity.INFO:
                return "notification-popup-card info-notification-background";
            case NotificationSeverity.WARNING:
                return "notification-popup-card warning-notification-background";
            case NotificationSeverity.ERROR:
                return "notification-popup-card error-notification-background";
        }
    };

    const handleModalOpen: MouseEventHandler = () =>
    {
        setIsModalOpen(true);
    };

    const handleModalClose = (): void =>
    {
        setIsModalOpen(false);
    };

    return (
        <>
            <div className={getPanelStyleBySeverity(notification.severity)} style={style}>
                <div className="popup-header-area">
                    {headerIcon !== undefined ? <div className="popup-header-icon">{headerIcon}</div> : <></>}
                    <div className="popup-header" onClick={handleModalOpen}>{notification.label}</div>
                    <div className="popup-header-date">{getTimestamp(notification.datetime)}</div>
                    <Button
                        className="notification-close-button"
                        onClick={handleCancelNotification}
                    >
                        <MdClose />
                    </Button>
                </div>
                <div className="flex">
                    {descriptionIcon !== undefined ? <div className="popup-description-icon">{descriptionIcon}</div> : <></>}
                    <div className="popup-description">{notification.description}</div>
                </div>
            </div>
            {isModalOpen ? <ModalNotification
                notification={notification}
                icon={descriptionIcon}
                onCancel={handleModalClose}
                stopAutocloseTimerSemaphore={stopAutocloseTimerSemaphore}
            /> : <></>}
        </>
    );
};
