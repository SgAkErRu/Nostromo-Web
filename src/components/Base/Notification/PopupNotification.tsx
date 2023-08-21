import React, { MouseEventHandler, useCallback, useEffect, useRef, useState } from "react";
import "./PopupNotification.css";
import { Notification, NotificationSeverity } from "../../../services/NotificationsService";
import { Button } from "@mui/material";
import { getTimestamp } from "../../../Utils";
import { ModalNotification } from "./ModalNotification";
import { VscError, VscInfo, VscWarning } from "react-icons/vsc";

interface PopupNotificationProps
{
    notification: Notification;
    onCancel: (id: number) => void;
    isAnimated? : boolean;
    autocloseTime? : number;
    collapseTime? : number;
    headerIcon? : JSX.Element;
    descriptionIcon? : JSX.Element;
}
export const PopupNotification: React.FC<PopupNotificationProps> = ({ notification, onCancel, isAnimated, autocloseTime, collapseTime, headerIcon, descriptionIcon }) =>
{
    const timerRef = useRef<NodeJS.Timeout | null>(null)
    const [isClosed, setIsClosed] = useState<boolean>(false);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    
    const handleCancelNotification = useCallback(() : void =>
    {
        if(collapseTime !== undefined && isAnimated === true)
        {
            setIsClosed(true);
            setTimeout(()=>{onCancel(notification.id);}, collapseTime);
        }
        else
        {
            onCancel(notification.id);
        }
    }, [isAnimated, notification.id, onCancel, collapseTime])

    useEffect(() => {
        if (autocloseTime !== undefined && !isModalOpen)
        {
            timerRef.current = setTimeout(handleCancelNotification, autocloseTime);
        }

        return () => 
        {
            if (timerRef.current)
            {
                clearTimeout(timerRef.current);
            }
        };
    }, [autocloseTime, handleCancelNotification, isModalOpen]);

    const transitionTime = collapseTime !== undefined ? `all ${collapseTime}ms` : undefined;
    const style = isClosed ? {opacity: 0, transition: transitionTime } : {transition: transitionTime};
    let panelClass = "";
    switch (notification.severity)
    {
        case NotificationSeverity.INFO:
            panelClass = "popup-area info-popup-background";
            break;
        case NotificationSeverity.WARNING:
            panelClass = "popup-area warning-popup-background";
            break;
        case NotificationSeverity.ERROR:
            panelClass = "popup-area error-popup-background";
            break;
    }

    const handleModalOpen : MouseEventHandler = () =>
    {
        if (timerRef.current)
        {
            clearTimeout(timerRef.current);
        }
        setIsModalOpen(true);
    }

    const handleModalClose = () : void =>
    {
        if (autocloseTime !== undefined)
        {
            timerRef.current = setTimeout(handleCancelNotification, autocloseTime);
        }
        setIsModalOpen(false);
    }
    let icon : JSX.Element = <></>;
    switch (notification.severity)
    {
        case NotificationSeverity.INFO:
            icon = <VscInfo className="modal-icon-size notification-icon-info" />;
            break;
        case NotificationSeverity.WARNING:
            icon = <VscWarning className="modal-icon-size notification-icon-warning" />;
            break;
        case NotificationSeverity.ERROR:
            icon = <VscError className="modal-icon-size notification-icon-error" />;
            break;
    }
    return (
        <>
            <div className={panelClass} style={style} >
                <div className="popup-header-area">
                    {headerIcon !== undefined ? <div className="popup-header-icon">{headerIcon}</div> : <></>}
                    <div className="popup-header" onClick={handleModalOpen}>{notification.label}</div>
                    <div className="popup-header-date">{getTimestamp(notification.date.milliseconds)}</div>
                    <Button
                        className="popup-close-button"
                        onClick={handleCancelNotification}
                    >
                        Х
                    </Button>
                </div>
                <div className="flex">
                    { descriptionIcon !== undefined ? <div className="popup-description-icon">{descriptionIcon}</div> : <></>}
                    <div className="popup-description">{notification.description}</div>
                </div>
            </div>
            {isModalOpen ? <ModalNotification notification={notification} headerIcon={icon} onCancel={handleModalClose} /> : <></>}
        </>
    );
};
