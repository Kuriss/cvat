// (Copyright (C) 2022 CVAT.ai Corporation
//
// SPDX-License-Identifier: MIT

import './styles.scss';
import React from 'react';
import { StorageLocation } from 'reducers';
import { StorageData } from 'cvat-core-wrapper';
import StorageWithSwitchField from './storage-with-switch-field';
import { useTranslation } from 'react-i18next';
export interface Props {
    instanceId: number | null;
    locationValue: StorageLocation;
    switchDescription?: string;
    switchHelpMessage?: string;
    storageDescription?: string;
    useDefaultStorage?: boolean | null;
    onChangeLocationValue?: (value: StorageLocation) => void;
    onChangeStorage?: (values: StorageData) => void;
    onChangeUseDefaultStorage?: (value: boolean) => void;
}

export default function TargetStorageField(props: Props): JSX.Element {
    const {
        instanceId,
        locationValue,
        switchDescription,
        switchHelpMessage,
        storageDescription,
        useDefaultStorage,
        onChangeLocationValue,
        onChangeUseDefaultStorage,
        onChangeStorage,
    } = props;
    const { t: tProject } = useTranslation('project');
    return (
        <StorageWithSwitchField
            instanceId={instanceId}
            locationValue={locationValue}
            storageLabel={tProject('create.TargetStorage.label')}
            storageName='targetStorage'
            switchName='useProjectTargetStorage'
            useDefaultStorage={useDefaultStorage}
            switchDescription={switchDescription}
            switchHelpMessage={switchHelpMessage}
            storageDescription={storageDescription}
            onChangeUseDefaultStorage={onChangeUseDefaultStorage}
            onChangeStorage={onChangeStorage}
            onChangeLocationValue={onChangeLocationValue}
        />
    );
}
