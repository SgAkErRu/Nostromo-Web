import { useContext, useState } from "react";
import { SetShowAdminPanelContext } from "../App";
import { FocusTrap } from "../components/Base/FocusTrap";
import { SidebarView, SidebarViewMainArea } from "../components/Base/SidebarView";
import { AdminPanelCategoryList } from "../components/AdminPanel/AdminPanelCategoryList";
import { AdminPanelActionList, BLOCK_BY_IP_CATEGORY_ID, CONTROL_ROOMS_CATEGORY_ID, CREATE_ROOM_CATEGORY_ID } from "../components/AdminPanel/AdminPanelActionList";

import "./AdminPanelLayer.css";
import { NumericConstants as NC } from "../utils/NumericConstants";

export interface AdminPanelCategory
{
    id: string;
    name: string;
}

export const AdminPanelLayer: React.FC = () =>
{
    const categories: AdminPanelCategory[] = [
        { id: CREATE_ROOM_CATEGORY_ID, name: "Создание комнаты" },
        { id: CONTROL_ROOMS_CATEGORY_ID, name: "Управление комнатами" },
        { id: BLOCK_BY_IP_CATEGORY_ID, name: "Блокировка по IP" }
    ];
    const setShowAdminPanel = useContext(SetShowAdminPanelContext);
    const [selectedCategory, setSelectedCategory] = useState<AdminPanelCategory>(
        categories.length ? categories[NC.ZERO_IDX] : { id: "", name: "" }
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
                selectedCategoryID={selectedCategory.id}
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
