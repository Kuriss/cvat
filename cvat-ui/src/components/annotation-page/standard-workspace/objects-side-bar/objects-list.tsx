// Copyright (C) 2020-2022 Intel Corporation
// Copyright (C) 2022-2024 CVAT.ai Corporation
//
// SPDX-License-Identifier: MIT

// import React from 'react';

import Text from 'antd/lib/typography/Text';

import { StatesOrdering, Workspace } from 'reducers';
import ObjectItemContainer from 'containers/annotation-page/standard-workspace/objects-side-bar/object-item';
import { ObjectState } from 'cvat-core-wrapper';
import React, { useEffect } from 'react';
import ObjectListHeader from './objects-list-header';

interface Props {
    workspace: Workspace;
    readonly: boolean;
    statesHidden: boolean;
    statesLocked: boolean;
    statesCollapsedAll: boolean;
    statesOrdering: StatesOrdering;
    sortedStatesID: number[];
    objectStates: any[];
    switchLockAllShortcut: string;
    switchHiddenAllShortcut: string;
    showGroundTruth: boolean;
    changeStatesOrdering(value: StatesOrdering): void;
    lockAllStates(): void;
    unlockAllStates(): void;
    collapseAllStates(): void;
    expandAllStates(): void;
    hideAllStates(): void;
    showAllStates(): void;
    changeShowGroundTruth(): void;
}
// 修改
// type FrameCount = [number, number]; // Tuple type for [clientId, frameCount]
//* ******
// 二次修改
type FrameCount = [number, number]; // Tuple type for [clientId, frameCount]

function ObjectListComponent(props: Props): JSX.Element {
    const {
        readonly,
        workspace,
        statesHidden,
        statesLocked,
        statesCollapsedAll,
        statesOrdering,
        sortedStatesID,
        objectStates,
        switchLockAllShortcut,
        switchHiddenAllShortcut,
        showGroundTruth,
        changeStatesOrdering,
        lockAllStates,
        unlockAllStates,
        collapseAllStates,
        expandAllStates,
        hideAllStates,
        showAllStates,
        changeShowGroundTruth,
    } = props;

    let latestZOrder: number | null = null;
    // 修改
    // let frameCounts: FrameCount[] = [];
    // let frames: number[] = [];
    // useEffect(() => {
    //     const localStorageKey = 'frameCounts';
    //     const framesKey = 'frames'; //* ******

    //     // let frameCounts: FrameCount[] = [];
    //     const storedData = localStorage.getItem(localStorageKey);
    //     if (storedData) {
    //         frameCounts = JSON.parse(storedData) as FrameCount[];
    //     }

    //     // let frames: number[] = []; //*******
    //     const storedFrames = localStorage.getItem(framesKey); //* ******
    //     if (storedFrames) { //* ******
    //         frames = JSON.parse(storedFrames); //* ******
    //     } //* ******
    //     const object = objectStates.find((state: ObjectState) => state.clientID !== undefined);
    //     if (object) {
    //         const { frame } = object; //* ******
    //         if (!frames.includes(frame)) { //* ******
    //             frames.push(frame); //* ******
    //             sortedStatesID.forEach((id) => {
    //                 const object2 = objectStates.find((state: ObjectState) => state.clientID === id);
    //                 if (object2) {
    //                     const index = frameCounts.findIndex((item: FrameCount) => item[0] === id);
    //                     if (index === -1) {
    //                         frameCounts.push([id, 1]);
    //                     } else {
    //                         frameCounts[index][1] += 1;
    //                     }
    //                 }
    //             });
    //         }
    //     }
    //     localStorage.setItem(localStorageKey, JSON.stringify(frameCounts));
    //     localStorage.setItem(framesKey, JSON.stringify(frames)); //* ******
    // }, [sortedStatesID, objectStates]);
//* ******
// 二次修改

// const localStorageKey = '25_3_tracks_info2_frameCounts';

useEffect(() => {
    // const storedData = localStorage.getItem(localStorageKey);
    const currentUrl = window.location.href;
    console.log('Current URL:', currentUrl);
    const urlMatch = currentUrl.match(/\/tasks\/(\d+)\/jobs\/(\d+)/);
    if (urlMatch) {
        const taskID = urlMatch[1];
        const jobID = urlMatch[2];

        // 定义存储 key
        const localStorageKey = `${taskID}/${jobID}_frameCounts`;

        // 定义读取文件的函数
        const fetchFile = async (filename: string) => {
            try {
                const response = await fetch(`/${filename}`);
                if (!response.ok) {
                    throw new Error('File not found');
                }
                const text = await response.text();
                const lines = text.split('\n');
                const parsedData: FrameCount[] = lines.map((line) => {
                    const match = line.match(/(\d+)\.\s+Track ID:\s+\d+,\s+Shape Count:\s+(\d+)/);
                    if (match) {
                        const clientId = parseInt(match[1], 10); // 使用第一个数字作为 clientId
                        const shapeCount = parseInt(match[2], 10); // Shape Count 作为 frameCount
                        return [clientId, shapeCount]; // 返回 [clientId, shapeCount]
                    }
                    return null;
                }).filter(Boolean) as FrameCount[];

                localStorage.setItem(localStorageKey, JSON.stringify(parsedData));
                return parsedData;
            } catch (error) {
                console.error('Error fetching the file:', error);
                return null;
            }
        };

        // 首先尝试读取 T_<taskID>.txt 文件
        fetchFile(`T_${taskID}.txt`).then((data) => {
            if (!data) {
                // 如果 T_<taskID>.txt 文件不存在，则读取 J_<jobID>.txt 文件
                fetchFile(`J_${jobID}.txt`);
            }
        });

    } else {
        console.error('URL does not contain taskID or jobID');
    }
});
    return (
        <>
            <ObjectListHeader
                readonly={readonly}
                workspace={workspace}
                statesHidden={statesHidden}
                statesLocked={statesLocked}
                statesCollapsed={statesCollapsedAll}
                statesOrdering={statesOrdering}
                switchLockAllShortcut={switchLockAllShortcut}
                switchHiddenAllShortcut={switchHiddenAllShortcut}
                showGroundTruth={showGroundTruth}
                count={objectStates.length}
                changeStatesOrdering={changeStatesOrdering}
                lockAllStates={lockAllStates}
                unlockAllStates={unlockAllStates}
                collapseAllStates={collapseAllStates}
                expandAllStates={expandAllStates}
                hideAllStates={hideAllStates}
                showAllStates={showAllStates}
                changeShowGroundTruth={changeShowGroundTruth}
            />
            <div className='cvat-objects-sidebar-states-list'>
                {sortedStatesID.map(
                    (id: number): JSX.Element => {
                        const object = objectStates.find((state: ObjectState) => state.clientID === id);
                        // // 修改
                        // 从 URL 中提取 taskID 和 jobID
                        const currentUrl = window.location.href;
                        const urlMatch = currentUrl.match(/\/tasks\/(\d+)\/jobs\/(\d+)/);
                        let frameCounts2: FrameCount[] = [];
                        let newFrameCounts: FrameCount[] = [];
                        let oldDataExists = false;
                        if (urlMatch) {
                            const taskID = urlMatch[1];
                            const jobID = urlMatch[2];
                            const localStorageKey = `${taskID}/${jobID}_frameCounts`;
                            const newLocalStorageKey = `new_${taskID}/${jobID}_frameCounts`;

                            // 从 localStorage 中读取数据
                            const storedData = localStorage.getItem(localStorageKey);
                            if (storedData) {
                                frameCounts2 = JSON.parse(storedData) as FrameCount[];
                                oldDataExists = true; // 只有当旧的 localStorage 存在时才会设置为 true
                            }

                            // 只有当旧的 localStorage 存在时才允许创建新的 new_ localStorage
                            if (oldDataExists) {
                                const storedNewData = localStorage.getItem(newLocalStorageKey);
                                if (storedNewData) {
                                    newFrameCounts = JSON.parse(storedNewData) as FrameCount[];
                                }
                            }

                            // 获取 frames 的 localStorage 键
                            const framesLocalStorageKey = `${id}_${taskID}/${jobID}_frames`;
                            let frames: number[] = [];
                            const storedFrames = localStorage.getItem(framesLocalStorageKey);
                            if (storedFrames) {
                                frames = JSON.parse(storedFrames);
                            }

                            // 查找 frameCount
                            const frameCountIndex = frameCounts2.findIndex(([itemId]) => itemId === id);
                            if (frameCountIndex !== -1 && object) {
                                const [, frameCount] = frameCounts2[frameCountIndex];
                                object.frameCount = frameCount;
                            } else if (object && oldDataExists) {
                                // 如果找不到 clientID，处理 new frameCounts 和 frames
                            const newFrameCountIndex = newFrameCounts.findIndex(([itemId]) => itemId === id);
                                if (newFrameCountIndex !== -1) {
                                    const [, frameCount] = newFrameCounts[newFrameCountIndex];
                                    object.frameCount = frameCount;
                                    console.log(`New frame count ${id}: ${frameCount}`);
                                }
                                const { frame } = object;
                                // 检查当前帧是否在 frames 中
                                if (!frames.includes(frame)) {
                                    frames.push(frame); // 将当前帧存入 frames

                                    // 更新 newFrameCounts 中的 frameCount
                                    const newFrameCountIndex2 = newFrameCounts.findIndex(([itemId]) => itemId === id);
                                    if (newFrameCountIndex2 === -1) {
                                        newFrameCounts.push([id, 1]); // 新增未匹配的 clientID
                                    } else {
                                        newFrameCounts[newFrameCountIndex2][1] += 1; // 增加 frameCount
                                    }

                                    // 更新 localStorage
                                    localStorage.setItem(framesLocalStorageKey, JSON.stringify(frames));
                                    localStorage.setItem(newLocalStorageKey, JSON.stringify(newFrameCounts));

                                    console.log(`New frame added for ${id} in frames: ${framesLocalStorageKey}`);
                                }
                            }
                        }
                        const zOrder = object?.zOrder || latestZOrder;

                        const renderZLayer = latestZOrder !== zOrder && statesOrdering === StatesOrdering.Z_ORDER;
                        if (renderZLayer) {
                            latestZOrder = zOrder;
                        }
                        console.log(object);
                        return (
                            <React.Fragment key={id}>
                                {renderZLayer && (
                                    <div className='cvat-objects-sidebar-z-layer-mark'>
                                        <Text strong>
                                            {`Layer ${zOrder}`}
                                        </Text>
                                    </div>
                                )}
                                <ObjectItemContainer
                                    readonly={readonly}
                                    objectStates={objectStates}
                                    clientID={id}
                                />
                            </React.Fragment>
                        );
                    },
                )}
            </div>
        </>
    );
}

export default React.memo(ObjectListComponent);
