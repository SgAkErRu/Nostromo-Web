import { FC, useContext } from "react";
import { List } from "../Base/List/List";
import { AdminContext } from "../../AppWrapper";
import { AdminPanelCategory, parametersInfoMap, useAdminActions } from "../../services/AdminService";
import { ListItemInput, ListItemSelect, ListItemSlider, ListItemSwitch } from "../Base/List/ListItems";

interface AdminPanelActionListProps
{
    // Выбранная категория
    selectedCategory: string;
}
export const AdminPanelActionList: FC<AdminPanelActionListProps> = ({ selectedCategory }) =>
{
    const adminService = useContext(AdminContext);
    const adminActions = useAdminActions(adminService);

    const loadParameter = (
        elements: JSX.Element[],
        parameter: string,
        currentCategory: string,
        category: AdminPanelCategory

    ): void =>
    {
        const parameterId = `${currentCategory}.${parameter}`;
        console.log(`${currentCategory}.${parameter}`);
        const paramValue = parametersInfoMap[parameterId];
        console.log(paramValue.type);
        if (paramValue.type === "Switch")
        {
            elements.push(
                <ListItemSwitch
                    key={parameterId}
                    label={parametersInfoMap[parameterId].name}
                    description={parametersInfoMap[parameterId].description}
                    value={category[parameter] as boolean}
                    onValueChange={(val) =>
                    {
                        console.log("switch");
                    }}
                />
            );
        }
        else if (paramValue.type === "Slider")
        {
            elements.push(
                <ListItemSlider
                    key={parameterId}
                    label={parametersInfoMap[parameterId].name + ": " + category[parameter].toString()}
                    description={parametersInfoMap[parameterId].description}
                    value={Number(category[parameter])}
                    onValueChange={(val) =>
                    {
                        console.log("slider");
                    }}
                />
            );
        }
        else if (paramValue.type === "Input")
        {
            elements.push(
                <ListItemInput
                    key={parameterId}
                    label={parametersInfoMap[parameterId].name}
                    description={parametersInfoMap[parameterId].description}
                    value={category[parameter] as string}
                    onValueChange={(val) =>
                    {
                        console.log("input");
                    }}
                />
            );
        }
        else if (paramValue.type === "Select")
        {
            const optionsList: string[] = ["First", "Second", "Third", "Fourth", "Fifth", "Sixth"];
            elements.push(
                <ListItemSelect
                    key={parameterId}
                    label={parametersInfoMap[parameterId].name}
                    description={parametersInfoMap[parameterId].description}
                    value={category[parameter] as string}
                    onValueChange={(val) =>
                    {
                        console.log("select");
                    }}
                    options={optionsList}
                />
            );
        }
        else
        {
            elements.push(
                <div key={parameterId}>
                    {parametersInfoMap[parameterId].name}
                </div>
            );
        }
    };
    const loadSelectedCategory = (): JSX.Element[] =>
    {
        const parametersList: JSX.Element[] = [
            <p className="settings-category-label" key={selectedCategory}>{selectedCategory}</p>
        ];

        const categoryMap = adminActions[selectedCategory];
        for (const parameter in categoryMap)
        {
            loadParameter(parametersList, parameter, selectedCategory, categoryMap);
        }

        return parametersList;
    };
    return (
        <List>{loadSelectedCategory()}</List>
    );
};
