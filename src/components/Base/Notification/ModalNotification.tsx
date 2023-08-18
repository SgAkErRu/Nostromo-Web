import React, { useEffect, useRef } from "react";
import { Notification } from "../../../services/NotificationsService";
import { SeverityNotification } from "./SeverityNotification";
import { FocusTrap } from "../FocusTrap";

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
            <FocusTrap>
                <SeverityNotification notification={notification} onCancel={onCancel}/>
            </FocusTrap>
        </div>
    );
};
