import { FC } from "react";
import { CreateRoom } from "./CreateRoom";
import { BlockByIP } from "./BlockByIP";
import { EditRoom } from "./EditRoom";

interface AdminPanelActionListProps
{
    // Выбранная категория
    selectedCategory: string;
}

const actionComponents = new Map<string, JSX.Element>
([
    [ "createRoom",   <CreateRoom /> ],
    [ "controlRooms", <EditRoom /> ],
    [ "blockByIP",    <BlockByIP /> ]
]);

export const AdminPanelActionList: FC<AdminPanelActionListProps> = ({ selectedCategory }) =>
{
    const activeComponent = actionComponents.get(selectedCategory);
    return (
        <>{activeComponent !== undefined ? activeComponent : <></>}</>
    );
};
