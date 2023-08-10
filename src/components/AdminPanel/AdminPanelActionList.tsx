import { FC, ReactElement } from "react";
import { List } from "../Base/List/List";
import { CreateRoom } from "./CreateRoom";
import { BlockByIP } from "./BlockByIP";

interface AdminPanelActionListProps
{
    // Выбранная категория
    selectedCategory: string;
}
export const AdminPanelActionList: FC<AdminPanelActionListProps> = ({ selectedCategory }) =>
{
    const actionComponents: Map<string, JSX.Element> = new Map();
    actionComponents.set("createRoom", <CreateRoom key={selectedCategory} />);
    actionComponents.set("controlRooms", <div>Заглушка</div>);
    actionComponents.set("blockByIP", <BlockByIP key={selectedCategory} />);
    const elements: JSX.Element[] = [actionComponents.get(selectedCategory) as ReactElement];
    return (
        <List key="adminPanelList">{elements}</List>
    );
};
