import { FC } from "react";
import { List } from "../Base/List/List";
import { CreateRoom } from "./CreateRoom";
import { BlockByIP } from "./BlockByIP";

interface AdminPanelActionListProps
{
    // Выбранная категория
    selectedCategory: string;
}

const actionComponents = new Map<string, JSX.Element>
([
    [ "createRoom",   <CreateRoom /> ],
    [ "blockByIP",    <BlockByIP /> ]
]);

export const AdminPanelActionList: FC<AdminPanelActionListProps> = ({ selectedCategory }) =>
{
    const activeComponent = actionComponents.get(selectedCategory);
    return (
        <List key="adminPanelList">{activeComponent !== undefined ? activeComponent : <></>}</List>
    );
};
