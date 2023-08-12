import { useContext, useState } from "react";
import { SetShowAdminPanelContext } from "../App";
import { FocusTrap } from "../components/Base/FocusTrap";
import { SidebarView, SidebarViewMainArea } from "../components/Base/SidebarView";
import { AdminPanelCategoryList } from "../components/AdminPanel/AdminPanelCategoryList";
import { AdminPanelActionList } from "../components/AdminPanel/AdminPanelActionList";

import "./AdminPanelLayer.css"

export const AdminPanelLayer: React.FC = () =>
{
    const categories: Map<string, string> = new Map();
    categories.set("createRoom", "Создание комнаты").set("controlRooms", "Управление комнатами").set("blockByIP", "Блокировка по IP");
    const setShowAdminPanel = useContext(SetShowAdminPanelContext);
    const [selectedCategory, setSelectedCategory] = useState<string>(
        categories.size ? categories.keys().next().value as string: ""
    );

    const handleCloseSettings = (): void =>
    {
        if (setShowAdminPanel !== null)
        {
            setShowAdminPanel(false);
        }
    };

    const categoryList = (
        <AdminPanelCategoryList
            setSelectedCategory={setSelectedCategory}
            selectedCategory={selectedCategory}
            categories={categories}
        />
    );
    const actionList = (
        <SidebarViewMainArea className={selectedCategory === "controlRooms" ? "sidebar-main-without-global-scroll" : ""}>
            <AdminPanelActionList
                selectedCategory={selectedCategory}
            />
        </SidebarViewMainArea>
    );

    return (
        <div id="layer-settings"
            className="layer"
            tabIndex={-1}
        >
            <FocusTrap>
                <SidebarView
                    sidebar={categoryList}
                    main={actionList}
                    onClickBtnClose={handleCloseSettings}
                />
            </FocusTrap>
        </div>
    );
};
