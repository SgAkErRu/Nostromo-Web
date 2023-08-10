import { useContext, useState } from "react";
import { SetShowAdminPanelContext } from "../App";
import { FocusTrap } from "../components/Base/FocusTrap";
import { SidebarView } from "../components/Base/SidebarView";
import { AdminPanelCategoryList } from "../components/AdminPanel/AdminPanelCategoryList";
import { AdminPanelActionList } from "../components/AdminPanel/AdminPanelActionList";
import { AdminContext } from "../AppWrapper";
import { useAdminActions } from "../services/AdminService";
import { ZERO_IDX } from "../Utils";

export const AdminPanelLayer: React.FC = () =>
{
    const adminService = useContext(AdminContext);
    const adminActions = useAdminActions(adminService);
    const categories = Object.keys(adminActions);
    const setShowAdminPanel = useContext(SetShowAdminPanelContext);
    const [selectedCategory, setSelectedCategory] = useState<string>(
        categories.length ? categories[ZERO_IDX]: ""
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
        />
    );
    const actionList = (
        <AdminPanelActionList
            selectedCategory={selectedCategory}
        />
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
