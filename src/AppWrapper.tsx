
import { createContext } from "react";
import { SettingService } from "./services/SettingsService";
import App from "./App";
import { AdminService } from "./services/AdminService";

export const SettingsContext = createContext<SettingService>(new SettingService());
export const AdminContext = createContext<AdminService>(new AdminService());

export const AppWrapper: React.FC = () =>
{
    return (
        <App />
    );
};
