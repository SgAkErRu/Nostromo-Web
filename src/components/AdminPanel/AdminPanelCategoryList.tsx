import { FC, FocusEventHandler } from "react";

import { NEGATIVE_TAB_IDX, ReactDispatch, ZERO_TAB_IDX } from "../../Utils";
import { List } from "../Base/List/List";
import { ListSectionLabel } from "../Base/List/ListItems";
import "./AdminPanelCategoryList.css";
import { AdminPanelCategory } from "../../pages/AdminPanelLayer";

interface AdminPanelCategoryListItemProps extends React.HTMLAttributes<HTMLDivElement>
{
    isActive: boolean;
    category: AdminPanelCategory;
    setSelectedCategory: ReactDispatch<AdminPanelCategory>;
}

const AdminPanelCategoryListItem: React.FC<AdminPanelCategoryListItemProps> = ({
    isActive,
    category,
    setSelectedCategory,
    ...props
}) =>
{
    const handleFocus: FocusEventHandler<HTMLDivElement> = (ev) =>
    {
        setSelectedCategory(category);
        if (props.onFocus)
        {
            props.onFocus(ev);
        }
    };

    return (
        <div
            className={
                "admin-panel-list-item non-selectable" +
                (isActive ? " admin-panel-list-active" : "")
            }
            tabIndex={
                isActive ? ZERO_TAB_IDX : NEGATIVE_TAB_IDX
            }
            role="listitem"
            onFocus={handleFocus}
            {...props}
        >
            <div className="admin-panel-list-item-info">
                <span className="admin-panel-list-item-info-name">{category.name}</span>
            </div>
        </div>
    );
};

interface AdminPanelCategoryListProps
{
    selectedCategory: AdminPanelCategory;
    setSelectedCategory: ReactDispatch<AdminPanelCategory>;
    categories: AdminPanelCategory[];
}

export const AdminPanelCategoryList: FC<AdminPanelCategoryListProps> = ({ selectedCategory, setSelectedCategory, categories }) =>
{
    const createCategoryItem = (category: AdminPanelCategory): JSX.Element =>
    {
        return (
            <AdminPanelCategoryListItem
                key={category.id}
                isActive={category.id === selectedCategory.id}
                category={category}
                setSelectedCategory={setSelectedCategory}
            />
        );
    };

    return (
        <>
            <List id="admin-panel-category-list">
                <ListSectionLabel text={"Панель Администратора"} />
                {categories.map(createCategoryItem)}
            </List>
        </>
    );
};
