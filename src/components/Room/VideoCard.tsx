import { FC, HTMLAttributes } from "react";
import "./VideoCard.css";

export interface Video
{
    id: string;
    name: string;
}

export type ElementSize = {
    width: number;
    height: number;
};

export type VideoList = Video[];

export const calculateVideoCardSize = (rows: number, col: number, layoutWidth: number, layoutHeight: number): ElementSize =>
{
    const marginValue = 6;

    // Между videoItem получается col-1 промежутков,
    // к этому количеству добавляем еще 4 отступа (двойной промежуток относительно промежутка между item)
    // для границ самого VideoLayout, в которых располагаются videoItem'ы
    // например двойной отступ для левой границы и двойной отступ для правой границы контейнера VideoLayout.
    // Таким образом получаем: 3.
    const offsetFactorForGaps = 3;

    const widthOffset = (col + offsetFactorForGaps) * marginValue;
    const heightOffset = (rows + offsetFactorForGaps) * marginValue;

    //console.debug("widthOffset / heightOffset", widthOffset, heightOffset);

    const aspectRatioForWidth = 16;
    const aspectRatioForHeight = 9;

    const elemWidthByCol = (layoutWidth - widthOffset) / col;
    const elemHeightByCol = elemWidthByCol * aspectRatioForHeight / aspectRatioForWidth;

    const elemHeightByRow = (layoutHeight - heightOffset) / rows;
    const elemWidthByRow = elemHeightByRow * aspectRatioForWidth / aspectRatioForHeight;

    const newWidth = Math.min(elemWidthByCol, elemWidthByRow);
    const newHeight = Math.min(elemHeightByCol, elemHeightByRow);

    return {
        width: newWidth,
        height: newHeight
    };
};

interface VideoCardProps extends HTMLAttributes<HTMLDivElement>
{
    name: string;
}

export const VideoCard: FC<VideoCardProps> = ({ name, ...props }) =>
{
    return (
        <div {...props} >
            <div className="video-container">
                <span className="v-align-middle">{name}</span>
            </div>
        </div>
    );
};
