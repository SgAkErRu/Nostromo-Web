import { FC, useContext } from "react";

import { NEGATIVE_TAB_IDX, ReactDispatch, ZERO_TAB_IDX } from "../../Utils";
import { List } from "../Base/List/List";
import { ListSectionLabel } from "../Base/List/ListItems";
import "../Settings/SettingsCategoryList.css";
import { AdminContext } from "../../AppWrapper";
import { AdminPanelActions, useAdminActions } from "../../services/AdminService";

interface AdminPanelCategoryListProps
{
    selectedCategory: string;
    setSelectedCategory: ReactDispatch<string>;
}

export const AdminPanelCategoryList: FC<AdminPanelCategoryListProps> = ({ selectedCategory, setSelectedCategory }) =>
{
    const adminService = useContext(AdminContext);
    const adminActions = useAdminActions(adminService);
    return (
        <List id="settings-category-list">
            <AdminPanelCategoryListSection sectionLabel="Панель Администратора"
                selectedCategory={selectedCategory}
                setSelectedCategory={setSelectedCategory}
                adminActions={adminActions}
            />
        </List>
    );
};

interface AdminPanelCategoryListSectionProps
{
    sectionLabel: string;
    selectedCategory: string;
    setSelectedCategory: ReactDispatch<string>;
    adminActions: AdminPanelActions;
}

const AdminPanelCategoryListSection: React.FC<AdminPanelCategoryListSectionProps> = ({
    sectionLabel,
    selectedCategory,
    setSelectedCategory,
    adminActions
}) =>
{
    const categoryList: JSX.Element[] = [];

    for (const category in adminActions)
    {
        categoryList.push(
            <AdminPanelCategoryListItem
                onFocus={() => { setSelectedCategory(category); }}
                selectedCategory={selectedCategory}
                category={category}
                key={category}
            />
        );
    }

    return <>
        <ListSectionLabel text={sectionLabel} />
        {categoryList}
    </>;
};

interface AdminPanelCategoryListItemProps extends React.HTMLAttributes<HTMLDivElement>
{
    selectedCategory: string;
    category: string;
}

const AdminPanelCategoryListItem: React.FC<AdminPanelCategoryListItemProps> = ({
    selectedCategory,
    category,
    ...props
}) =>
{
    return (
        <div
            className={
                "category-list-item non-selectable" +
                (selectedCategory === category ? " category-list-active" : "")
            }
            tabIndex={
                selectedCategory === category ? ZERO_TAB_IDX : NEGATIVE_TAB_IDX
            }
            role="listitem"
            {...props}
        >
            <div className="category-list-item-info">
                <span className="category-list-item-info-name">{category}</span>
            </div>
        </div>
    );
};
