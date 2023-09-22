import { FC, MouseEventHandler, memo, useCallback, useEffect, useState } from "react";
import { ElementSize, Video, VideoCard, VideoList, calculateVideoCardSize } from "./VideoCard";
import "./VideoLayoutContent.css"
import { useResizeDetector } from "react-resize-detector";
import { NumericConstants as NC } from "../../utils/NumericConstants";
import { MdNavigateBefore, MdNavigateNext } from "react-icons/md";

const MIN_CARD_WIDTH         = 320;  // Минимальная ширина компонента с видео
const MIN_CARD_HEIGHT        = 180;  // Минимальная высота компонента с видео
const MIN_CARD_CNT           = 1;    // Минимальное количество компонентов с видео
const ZERO_CNT               = 0;    // Константа нулевого количества строк или столбцов
const ZERO_VALUE_PX          = 0;    // Константа нулевого размера
const START_PAGE             = 0;    // Начальная страница
const NEXT_PAGE_DISPLACEMENT = 2;    // Слагаемое для перевода индекса страницы в номер следующей страницы

interface VideoLayoutContentProps
{
    videoList: VideoList;
}

interface VideoLayoutMatrixState
{
    itemCnt       : number;
    videoItemSize : ElementSize;
    page          : number;
}

function calculateVideoCardsCount(layoutWidth: number, layoutHeight: number) : number
{
    return Math.floor(layoutWidth / MIN_CARD_WIDTH) * Math.floor(layoutHeight / MIN_CARD_HEIGHT);
}

function calculatePageCount(listLen: number, maxItemCnt: number) : number
{
    const maxPageCnt = Math.ceil(listLen / maxItemCnt);
    return Math.max(maxPageCnt - NC.IDX_STEP, NC.ZERO_IDX);
}

function calculateMatrixSize(itemCnt: number, isHorizontal: boolean) : {rows: number, col : number}
{
    let rows = 1;
    let col = 1;

    while (rows * col < itemCnt)
    {
        if ((rows === col && !isHorizontal) ||
            (rows !== col && isHorizontal))
        {
            ++col;
        }
        else
        {
            ++rows;
        }
    }
    return { rows, col };
}

function calculateVideoItemSize(layoutWidth: number, layoutHeight: number, itemCnt: number, isHorizontal: boolean) : ElementSize
{
    const { rows, col } = calculateMatrixSize(itemCnt, isHorizontal);

    return calculateVideoCardSize(rows, col, layoutWidth, layoutHeight);
}

const VideoLayoutMatrix: FC<VideoLayoutContentProps> = ({ videoList }) =>
{
    const [matrixState, setMatrixState] = useState<VideoLayoutMatrixState>({
        itemCnt: MIN_CARD_CNT,
        videoItemSize: { width: MIN_CARD_WIDTH, height: MIN_CARD_HEIGHT },
        page: START_PAGE
    });
    const [isHorizontal, setIsHorizontal] = useState<boolean>(window.innerWidth < window.innerHeight);

    const {
        width: layoutWidth,
        height: layoutHeight,
        ref: layoutRef
    } = useResizeDetector<HTMLDivElement>({
        onResize: () =>
        {
            updateMatrixState();
            setIsHorizontal(window.innerWidth < window.innerHeight);
        }
    });

    //console.log(matrixState.itemCnt);

    const getPageItemCnt = useCallback((page: number) => {
        return Math.min(videoList.length - (page * matrixState.itemCnt), matrixState.itemCnt);
    }, [matrixState.itemCnt, videoList.length]);

    const updateMatrixState = useCallback(() => {
        if (layoutWidth !== undefined && layoutHeight !== undefined)
        {
            const newItemCnt = Math.max(calculateVideoCardsCount(layoutWidth, layoutHeight), MIN_CARD_CNT);
            const newPageCnt = calculatePageCount(videoList.length, newItemCnt);
            const newPage = matrixState.page < newPageCnt ? matrixState.page : Math.max(newPageCnt, NC.ZERO_IDX);
            const newItemSize = calculateVideoItemSize(layoutWidth, layoutHeight, getPageItemCnt(newPage), isHorizontal);

            if (
                newItemCnt !== matrixState.itemCnt
                || newPageCnt <= matrixState.page
                || newItemSize.width !== matrixState.videoItemSize.width
                || newItemSize.height !== matrixState.videoItemSize.height)
            {
                setMatrixState({itemCnt: newItemCnt, page: newPage, videoItemSize: newItemSize});
            }
        }
    }, [getPageItemCnt, isHorizontal, layoutHeight, layoutWidth, matrixState.itemCnt, matrixState.page, matrixState.videoItemSize.height, matrixState.videoItemSize.width, videoList.length]);

    useEffect(() =>
    {
        updateMatrixState();
    }, [videoList, updateMatrixState]);

    if (matrixState.videoItemSize.width <= ZERO_VALUE_PX || matrixState.videoItemSize.height <= ZERO_VALUE_PX)
    {
        return null;
    }

    const { col } = calculateMatrixSize(Math.min(videoList.length - (matrixState.page * matrixState.itemCnt), matrixState.itemCnt), isHorizontal);
    
    //console.debug("[VideoLayout] Render videos", videoItemSize.width, videoItemSize.height);

    const matrix = [];
    const startIdx = matrixState.page * matrixState.itemCnt;
    for (let i = startIdx; i < startIdx + matrixState.itemCnt; i = i + col)
    {
        matrix.push(videoList.slice(i, i + col));
    }

    const rowToMap = (val: Video, index: number): JSX.Element =>
    {
        return (
            <VideoCard
                className="video-layout-item"
                key={index}
                style={{
                    width: matrixState.videoItemSize.width,
                    height: matrixState.videoItemSize.height
                }}
            >
                {val.name}
            </VideoCard>
        );
    };

    const matrixToMap = (row: Video[], index: number): JSX.Element =>
    {
        return (
            <div className="video-layout-row" key={index}>
                {row.map(rowToMap)}
            </div>
        );
    };

    const handlePrevPageClick: MouseEventHandler = () =>
    {
        if (matrixState.page > NC.ZERO_IDX && layoutWidth !== undefined && layoutHeight !== undefined)
        {
            const newPage = matrixState.page - NC.IDX_STEP;
            const newItemSize = calculateVideoItemSize(
                layoutWidth, layoutHeight,
                getPageItemCnt(newPage),
                isHorizontal
            );
            setMatrixState((prev) => { return {
                ...prev,
                page: newPage,
                videoItemSize: newItemSize
            }});
        }
    };

    const handleNextPageClick: MouseEventHandler = () =>
    {
        if (matrixState.page + NC.IDX_STEP < pagesCnt && layoutWidth !== undefined && layoutHeight !== undefined)
        {
            const newPage = matrixState.page + NC.IDX_STEP;
            const newItemSize = calculateVideoItemSize(
                layoutWidth, layoutHeight,
                getPageItemCnt(newPage),
                isHorizontal
            );
            setMatrixState((prev) => { return {
                ...prev,
                page: newPage,
                videoItemSize: newItemSize
            }});
        }
    };

    const pagesCnt = Math.ceil(videoList.length / matrixState.itemCnt);

    const prevPageBtn = matrixState.page > ZERO_CNT ?
        <div className="video-layout-nav-area-size video-layout-nav-area" onClick={handlePrevPageClick}>
            <MdNavigateBefore className="video-layout-nav-next-button" />
            {matrixState.page}/{pagesCnt}
        </div> : <div className="video-layout-nav-area-size"></div>
    const nextPageBtn = matrixState.page + NC.IDX_STEP < pagesCnt ? 
        <div className="video-layout-nav-area-size video-layout-nav-area" onClick={handleNextPageClick}>
            <MdNavigateNext className="video-layout-nav-next-button" />
            {matrixState.page + NEXT_PAGE_DISPLACEMENT}/{pagesCnt}
        </div> : <div className="video-layout-nav-area-size"></div>

    return (
        <div className="video-layout-wrapper">
            {prevPageBtn}
            <div className="video-layout-content" ref={layoutRef}>
                {matrix.map(matrixToMap)}
            </div>
            {nextPageBtn}
        </div>
    );
};

const VideoLayoutContent : FC<VideoLayoutContentProps> = ({ videoList }) =>
{
    return (
        <VideoLayoutMatrix videoList={videoList} />
    );
}

export const MemoizedVideoLayoutContent = memo(VideoLayoutContent);
