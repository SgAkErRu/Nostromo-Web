import { FC } from "react";

import { NEGATIVE_TAB_IDX, ReactDispatch, ZERO_TAB_IDX } from "../../Utils";
import { List } from "../Base/List/List";
import { ListSectionLabel } from "../Base/List/ListItems";
import "./AdminPanelCategoryList.css";

interface AdminPanelCategoryListProps
{
    selectedCategory: string;
    setSelectedCategory: ReactDispatch<string>;
    categories: Map<string, string>;
}

export const AdminPanelCategoryList: FC<AdminPanelCategoryListProps> = ({ selectedCategory, setSelectedCategory, categories }) =>
{
    return (
        <List id="admin-panel-category-list">
            <AdminPanelCategoryListSection sectionLabel="Панель Администратора"
                selectedCategory={selectedCategory}
                setSelectedCategory={setSelectedCategory}
                categories={categories}
            />
        </List>
    );
};

interface AdminPanelCategoryListSectionProps
{
    sectionLabel: string;
    selectedCategory: string;
    setSelectedCategory: ReactDispatch<string>;
    categories: Map<string, string>;
}

const AdminPanelCategoryListSection: React.FC<AdminPanelCategoryListSectionProps> = ({
    sectionLabel,
    selectedCategory,
    setSelectedCategory,
    categories
}) =>
{
    const categoryList: JSX.Element[] = [];

    for (const [key, ] of categories)
    {
        categoryList.push(
            <AdminPanelCategoryListItem
                onFocus={() => { setSelectedCategory(key); }}
                selectedCategory={selectedCategory}
                categoryKey={key}
                categories={categories}
                key={key}
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
    categoryKey: string;
    categories: Map<string, string>;
}

const AdminPanelCategoryListItem: React.FC<AdminPanelCategoryListItemProps> = ({
    selectedCategory,
    categoryKey,
    categories,
    ...props
}) =>
{
    return (
        <div
            className={
                "admin-panel-list-item non-selectable" +
                (selectedCategory === categoryKey ? " admin-panel-list-active" : "")
            }
            tabIndex={
                selectedCategory === categoryKey ? ZERO_TAB_IDX : NEGATIVE_TAB_IDX
            }
            role="listitem"
            {...props}
        >
            <div className="admin-panel-list-item-info">
                <span className="admin-panel-list-item-info-name">{categories.get(categoryKey)}</span>
            </div>
        </div>
    );
};
