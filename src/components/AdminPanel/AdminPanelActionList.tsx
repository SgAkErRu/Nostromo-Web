import { FC } from "react";
import { CreateRoom } from "./CreateRoom";
import { BlockByIP } from "./BlockByIP";
import { EditRoom } from "./EditRoom";

export const CREATE_ROOM_CATEGORY_ID = "createRoom";
export const CONTROL_ROOMS_CATEGORY_ID = "controlRooms";
export const BLOCK_BY_IP_CATEGORY_ID = "blockByIP";

const actionComponents = new Map<string, JSX.Element>
    ([
        [CREATE_ROOM_CATEGORY_ID, <CreateRoom />],
        [CONTROL_ROOMS_CATEGORY_ID, <EditRoom />],
        [BLOCK_BY_IP_CATEGORY_ID, <BlockByIP />]
    ]);

interface AdminPanelActionListProps
{
    selectedCategoryID: string;
}

export const AdminPanelActionList: FC<AdminPanelActionListProps> = ({ selectedCategoryID }) =>
{
    return actionComponents.get(selectedCategoryID) ?? <></>;
};
