import { useContext, useState } from "react";
import { SetShowAdminPanelContext } from "../App";
import { FocusTrap } from "../components/Base/FocusTrap";
import { SidebarView, SidebarViewMainArea } from "../components/Base/SidebarView";
import { AdminPanelCategoryList } from "../components/AdminPanel/AdminPanelCategoryList";
import { AdminPanelActionList } from "../components/AdminPanel/AdminPanelActionList";

import "./AdminPanelLayer.css"
import { ZERO_IDX } from "../Utils";

export interface AdminPanelCategory
{
    id : string;
    name : string;
} 

export const AdminPanelLayer: React.FC = () =>
{
    const categories: AdminPanelCategory[] = [
        {id: "createRoom", name: "Создание комнаты"},
        {id: "controlRooms", name: "Управление комнатами"},
        {id: "blockByIP", name: "Блокировка по IP"}
    ]
    const setShowAdminPanel = useContext(SetShowAdminPanelContext);
    const [selectedCategory, setSelectedCategory] = useState<AdminPanelCategory>(
        categories.length ? categories[ZERO_IDX] : {id: "", name: ""}
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
        <SidebarViewMainArea className={selectedCategory.id === "controlRooms" ? "sidebar-main-without-global-scroll" : ""}>
            <AdminPanelActionList
                selectedCategory={selectedCategory.id}
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
