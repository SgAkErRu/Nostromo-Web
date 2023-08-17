import React, { useContext, useEffect } from "react";
import { RegularNotification } from "../components/Base/Notification/RegularNotification";
import { ModalNotification } from "../components/Base/Notification/ModalNotification";
import { NotificationsContext } from "../AppWrapper";
import { NotificationSeverity, NotificationType, useNotifications } from "../services/NotificationsService";

export const NotificationLayer: React.FC = () =>
{
    const notificationService = useContext(NotificationsContext);
    const notificationList = useNotifications(notificationService);

    // #FIXME: Юз эффект срабатывает 2 раза
    useEffect(() => {
        notificationService.add({label: "Error", description: "Какое-то модальное оповещение severity ERROR", severity: NotificationSeverity.ERROR, type: NotificationType.CRITICAL, date: new Date()});
        notificationService.add({label: "Info", description: "Какое-то модальное оповещение severity INFO", severity: NotificationSeverity.INFO, type: NotificationType.CRITICAL, date: new Date()});
        notificationService.add({label: "Warning", description: "Какое-то модальное оповещение severity WARNING", severity: NotificationSeverity.WARNING, type: NotificationType.CRITICAL, date: new Date()});

        notificationService.add({label: "Warning", description: "Какое-то всплывающее оповещение severity WARNING", severity: NotificationSeverity.WARNING, type: NotificationType.POPUP, date: new Date()});
        notificationService.add({label: "Info", description: "Какое-то всплывающее оповещение severity INFO", severity: NotificationSeverity.INFO, type: NotificationType.POPUP, date: new Date()});
        notificationService.add({label: "Error", description: "Какое-то всплывающее оповещение severity ERROR", severity: NotificationSeverity.ERROR, type: NotificationType.POPUP, date: new Date()});
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const handleCancelNotification = (id: number): void =>
    {
        notificationService.remove(id);
    }
    return (
        <div id="notification-layer">
            {notificationList.map(n => {
                return (n.type === NotificationType.POPUP?
                        <RegularNotification notification={n} onCancel={handleCancelNotification}/>
                    :
                        <ModalNotification notification={n} onCancel={handleCancelNotification}/>
                );
            })}
        </div>
    );
};
