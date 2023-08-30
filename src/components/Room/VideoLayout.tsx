import React, { MouseEventHandler, useCallback, useEffect, useState } from 'react';

import "./VideoLayout.css";

import { Button, useMediaQuery } from "@mui/material";
import { LuLayoutGrid } from "react-icons/lu";
import { useResizeDetector } from 'react-resize-detector';
import { NumericConstants as NC } from "../../utils/NumericConstants";
import { Tooltip } from '../Tooltip';
import { ElementSize, Video, VideoList, calculateVideoCardSize } from './VideoCard';
import { MemoizedVideoLayoutContent } from "./VideoLayoutContent";
import { MemoizedVideoRibbonLayoutContent } from './VideoRibbonLayoutContent';

export const VideoLayout: React.FC = () =>
{
    const [videoItemSize, setVideoItemSize] = useState<ElementSize>({ width: 0, height: 0 });

    const [viewRibbonLayout, setViewRibbonLayout] = useState<boolean>(false);

    const [videoList, setVideoList] = useState<VideoList>([{ id: '0', name: '1' }]);

    const verticalOrientation = useMediaQuery('(orientation: portrait)');

    const {
        width: layoutWidth,
        height: layoutHeight,
        ref: layoutRef
    } = useResizeDetector<HTMLDivElement>({
        onResize: () =>
        {
            //console.debug("[VideoLayout] video-layout size: ", layoutWidth, layoutHeight);
            recalculateVideoItemSize();
        }
    });

    // Типо загрузили список с сервера.
    useEffect(() =>
    {
        console.debug("[VideoLayout] Loading data from API...");

        setVideoList((prev) =>
        {
            const arr: Video[] = [];
            for (let i = 0; i < arr.length; ++i)
            {
                arr.push({ id: `${prev.length + i}`, name: `${prev.length + i + NC.IDX_STEP}` });
            }
            return prev.concat(arr);
        });

        return () =>
        {
            setVideoList([{ id: '0', name: '1' }]);
        };

    }, []);

    const calcRowsAndColumns = useCallback(() =>
    {
        //console.debug("[VideoLayout] Calculating rows and columns.");

        let rows = 1;
        let col = 1;

        while (rows * col < videoList.length)
        {
            if ((rows === col && !verticalOrientation) ||
                (rows !== col && verticalOrientation))
            {
                ++col;
            }
            else
            {
                ++rows;
            }
        }
        return { rows, col };
    }, [videoList, verticalOrientation]);

    const recalculateVideoItemSize = useCallback(() =>
    {
        if ((layoutWidth != null) && (layoutHeight != null))
        {
            const { rows, col } = calcRowsAndColumns();

            const newSize = calculateVideoCardSize(rows, col, layoutWidth, layoutHeight);

            if (newSize.width !== videoItemSize.width || newSize.height !== videoItemSize.height)
            {
                setVideoItemSize(newSize);
            }
        }
    }, [layoutWidth, layoutHeight, calcRowsAndColumns, videoItemSize.height, videoItemSize.width]);

    useEffect(() =>
    {
        recalculateVideoItemSize();
    }, [videoList, recalculateVideoItemSize]);

    const handleChangeLayout: MouseEventHandler = () =>
    {
        setViewRibbonLayout(!viewRibbonLayout);
    };

    return (
        <div id="video-layout" ref={layoutRef}>
            <Tooltip title="Сменить раскладку" placement="top">
                <Button className="change-layout-button" onClick={handleChangeLayout}>
                    <LuLayoutGrid className="change-layout-icon" />
                </Button>
            </Tooltip>
            <button className="debug-btn" onClick={() => { setVideoList(prev => [...prev, { id: `${prev.length + NC.IDX_STEP}`, name: "new" }]); }}>+1</button>
            <button className="debug-btn-2" onClick={() =>
            {
                setVideoList((prev) =>
                {
                    const arr: Video[] = [];
                    const TEN = 10;
                    for (let i = 0; i < TEN; ++i)
                    {
                        arr.push({ id: `${prev.length + i}`, name: `${prev.length + i + NC.IDX_STEP}` });
                    }
                    return prev.concat(arr);
                });
            }}>
                +10
            </button>
            {viewRibbonLayout ?
                <MemoizedVideoRibbonLayoutContent videoList={videoList} />
                : <MemoizedVideoLayoutContent videoList={videoList} videoItemSize={videoItemSize} calcRowsAndColumns={calcRowsAndColumns} />
            }
        </div>
    );
};
