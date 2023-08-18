
import { createContext } from "react";
import { SettingService } from "./services/SettingsService";
import App from "./App";
import { NotificationSeverity, NotificationType, NotificationsService } from "./services/NotificationsService";

export const SettingsContext = createContext<SettingService>(new SettingService());

const notificationService: NotificationsService = new NotificationsService();
notificationService.add({label: "Warning", description: "Какое-то всплывающее оповещение severity WARNING", severity: NotificationSeverity.WARNING, type: NotificationType.POPUP, date: {date: new Date().getTime()}});
notificationService.add({label: "Info", description: "Какое-то всплывающее оповещение severity INFO", severity: NotificationSeverity.INFO, type: NotificationType.POPUP, date: {date: new Date().getTime()}});
notificationService.add({label: "Error", description: "Какое-то всплывающее оповещение severity ERROR", severity: NotificationSeverity.ERROR, type: NotificationType.POPUP, date: {date: new Date().getTime()}});
notificationService.add({label: "Error", description: "Какое-то всплывающее оповещение severity ERROR", severity: NotificationSeverity.ERROR, type: NotificationType.POPUP, date: {date: new Date().getTime()}});
notificationService.add({label: "Error", description: "Какое-то всплывающее оповещение severity ERROR", severity: NotificationSeverity.ERROR, type: NotificationType.POPUP, date: {date: new Date().getTime()}});

export const NotificationsContext = createContext<NotificationsService>(notificationService);

export const AppWrapper: React.FC = () =>
{
    return (
        <App />
    );
};
