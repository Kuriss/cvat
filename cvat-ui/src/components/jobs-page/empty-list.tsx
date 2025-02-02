// Copyright (C) 2020-2022 Intel Corporation
// Copyright (C) 2022-2024 CVAT.ai Corporation
//
// SPDX-License-Identifier: MIT

import React from 'react';
import { Link } from 'react-router-dom';
import Text from 'antd/lib/typography/Text';
import { Row, Col } from 'antd/lib/grid';
import { useTranslation } from 'react-i18next';
import Empty from 'antd/lib/empty';

interface Props {
    notFound: boolean;
}

function EmptyListComponent(props: Props): JSX.Element {
    const { notFound } = props;
    const { t: tError } = useTranslation('error');
    const { t: tType } = useTranslation(undefined, { keyPrefix: 'type' });

    return (
        <div className='cvat-empty-jobs-list'>
            <Empty description={notFound ?
                (<Text strong>{tError('No results matched your search')}</Text>) : (
                    <>
                        <Row justify='center' align='middle'>
                            <Col>
                                <Text strong>{tError('Not created yet', { type: tType('Jobs') })}</Text>
                            </Col>
                        </Row>
                        <Row justify='center' align='middle'>
                            <Col>
                                <Text type='secondary'>{tError('To get started with your annotation project')}</Text>
                            </Col>
                        </Row>
                        <Row justify='center' align='middle'>
                            <Col>
                                <Link to='/tasks/create'>{tError('create a new _type', { type: tType('Task') })}</Link>
                                <Text type='secondary'>{` ${tError('or try to')} `}</Text>
                                <Link to='/projects/create'>{tError('create a new type', { type: tType('Project') })}</Link>
                            </Col>
                        </Row>
                    </>
                )}
            />
        </div>
    );
}

export default React.memo(EmptyListComponent);
