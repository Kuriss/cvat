// Copyright (C) 2020-2022 Intel Corporation
// Copyright (C) 2022 CVAT.ai Corporation
//
// SPDX-License-Identifier: MIT

import React, { useState } from 'react';
import Icon from '@ant-design/icons';
import Form, { RuleRender, RuleObject } from 'antd/lib/form';
import Button from 'antd/lib/button';
import Checkbox from 'antd/lib/checkbox';
import { Link } from 'react-router-dom';
import { BackArrowIcon } from 'icons';

import patterns from 'utils/validation-patterns';
import { useTranslation } from 'react-i18next';
import { UserAgreement } from 'reducers';
import { Row, Col } from 'antd/lib/grid';
import CVATSigningInput, { CVATInputType } from 'components/signing-common/cvat-signing-input';
import { useAuthQuery } from 'utils/hooks';

export interface UserConfirmation {
    name: string;
    value: boolean;
}

export interface RegisterData {
    username: string;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    confirmations: UserConfirmation[];
}

interface Props {
    fetching: boolean;
    userAgreements: UserAgreement[];
    predefinedEmail?: string;
    hideLoginLink?: boolean;
    onSubmit(registerData: RegisterData): void;
}

function validateUsername(_: RuleObject, value: string): Promise<void> {
    if (!patterns.validateUsernameLength.pattern.test(value)) {
        return Promise.reject(new Error(patterns.validateUsernameLength.message));
    }

    if (!patterns.validateUsernameCharacters.pattern.test(value)) {
        return Promise.reject(new Error(patterns.validateUsernameCharacters.message));
    }

    return Promise.resolve();
}

export const validatePassword: RuleRender = (): RuleObject => ({
    validator(_: RuleObject, value: string): Promise<void> {
        if (!patterns.validatePasswordLength.pattern.test(value)) {
            return Promise.reject(new Error(patterns.validatePasswordLength.message));
        }

        if (!patterns.passwordContainsNumericCharacters.pattern.test(value)) {
            return Promise.reject(new Error(patterns.passwordContainsNumericCharacters.message));
        }

        if (!patterns.passwordContainsUpperCaseCharacter.pattern.test(value)) {
            return Promise.reject(new Error(patterns.passwordContainsUpperCaseCharacter.message));
        }

        if (!patterns.passwordContainsLowerCaseCharacter.pattern.test(value)) {
            return Promise.reject(new Error(patterns.passwordContainsLowerCaseCharacter.message));
        }

        return Promise.resolve();
    },
});

export const validateConfirmation: ((firstFieldName: string) => RuleRender) = (
    firstFieldName: string,
): RuleRender => ({ getFieldValue }): RuleObject => ({
    validator(_: RuleObject, value: string): Promise<void> {
        if (value && value !== getFieldValue(firstFieldName)) {
            return Promise.reject(new Error('Two passwords that you enter is inconsistent!'));
        }

        return Promise.resolve();
    },
});

const validateAgreement: ((userAgreements: UserAgreement[]) => RuleRender) = (
    userAgreements: UserAgreement[],
): RuleRender => () => ({
    validator(rule: any, value: boolean): Promise<void> {
        const [, name] = rule.field.split(':');
        const [agreement] = userAgreements
            .filter((userAgreement: UserAgreement): boolean => userAgreement.name === name);
        if (agreement.required && !value) {
            return Promise.reject(new Error(`You must accept ${agreement.urlDisplayText} to continue!`));
        }

        return Promise.resolve();
    },
});

function RegisterFormComponent(props: Props): JSX.Element {
    const {
        fetching, onSubmit, userAgreements, hideLoginLink,
    } = props;

    const authQuery = useAuthQuery();
    const predefinedEmail = authQuery?.email;

    const [form] = Form.useForm();
    if (predefinedEmail) {
        form.setFieldsValue({ email: predefinedEmail });
    }
    const { t: tError } = useTranslation('error');
    const { t: tType } = useTranslation(undefined, { keyPrefix: 'type' });
    const { t: tAuth } = useTranslation('auth');
    const [usernameEdited, setUsernameEdited] = useState(false);
    return (
        <div className={`cvat-register-form-wrapper ${userAgreements.length ? 'cvat-register-form-wrapper-extended' : ''}`}>
            {
                !hideLoginLink && (
                    <Row justify='space-between' className='cvat-credentials-navigation'>
                        <Col>
                            <Link to={{
                                pathname: '/auth/login',
                                search: authQuery ? new URLSearchParams(authQuery).toString() : '',
                            }}
                            >
                                <Icon component={BackArrowIcon} />
                            </Link>
                        </Col>
                    </Row>
                )
            }
            <Form
                form={form}
                onFinish={(values: Record<string, string | boolean>) => {
                    const agreements = Object.keys(values)
                        .filter((key: string):boolean => key.startsWith('agreement:'));
                    const confirmations = agreements
                        .map((key: string): UserConfirmation => ({ name: key.split(':')[1], value: (values[key] as boolean) }));
                    const rest = Object.entries(values)
                        .filter((entry: (string | boolean)[]) => !agreements.includes(entry[0] as string));

                    onSubmit({
                        ...(Object.fromEntries(rest) as any as RegisterData),
                        ...(predefinedEmail ? { email: predefinedEmail } : {}),
                        confirmations,
                    });
                }}
                className='cvat-register-form'
            >
                <Row gutter={8}>
                    <Col span={12}>
                        <Form.Item
                            className='cvat-credentials-form-item'
                            name='firstName'
                            rules={[
                                {
                                    pattern: patterns.validateName.pattern,
                                    message: tError('The input is not valid!', { type: tType('First name') }),
                                },
                                {
                                    required: true,
                                    // message: 'Please specify a first name',
                                    // pattern: patterns.validateName.pattern,
                                    message: tError('Please specify a', { type: tType('First name') }),
                                },
                            ]}
                        >
                            <CVATSigningInput
                                id='firstName'
                                placeholder={tType('First name')}
                                autoComplete='given-name'
                                onReset={() => form.setFieldsValue({ firstName: '' })}
                            />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            className='cvat-credentials-form-item'
                            name='lastName'
                            rules={[
                                {
                                    pattern: patterns.validateName.pattern,
                                    message: tError('The input is not valid!', { type: tType('Last name') }),
                                },
                                {
                                    required: true,
                                    // message: 'Please specify a last name',
                                    // pattern: patterns.validateName.pattern,
                                    message: tError('Please specify a', { type: tType('Last name') }),

                                },
                            ]}
                        >
                            <CVATSigningInput
                                id={tType('Last name')}
                                placeholder='Last name'
                                autoComplete='family-name'
                                onReset={() => form.setFieldsValue({ lastName: '' })}
                            />
                        </Form.Item>
                    </Col>
                </Row>
                <Form.Item
                    className='cvat-credentials-form-item'
                    name='email'
                    rules={[
                        {
                            type: 'email',
                            message: tError('The input is not valid!', { type: tType('Email') }),
                        },
                        {
                            required: true,
                            message: tError('Please specify a', { type: tType('Email'), a: 'an' }),
                        },
                    ]}
                >
                    <CVATSigningInput
                        id='email'
                        autoComplete='email'
                        placeholder={tType('Email')}
                        disabled={!!predefinedEmail}
                        value={predefinedEmail}
                        onReset={() => form.setFieldsValue({ email: '', username: '' })}
                        onChange={(event) => {
                            const { value } = event.target;
                            if (!usernameEdited) {
                                const [username] = value.split('@');
                                form.setFieldsValue({ username });
                            }
                        }}
                    />
                </Form.Item>
                <Form.Item
                    className='cvat-credentials-form-item'
                    name='username'
                    rules={[
                        {
                            required: true,
                            message: tError('Please specify a', { type: tType('Username'), a: 'an' }),
                        },
                        {
                            validator: validateUsername,
                        },
                    ]}
                >
                    <CVATSigningInput
                        id='username'
                        placeholder={tType('Username')}
                        autoComplete='username'
                        onReset={() => form.setFieldsValue({ username: '' })}
                        onChange={() => setUsernameEdited(true)}
                    />
                </Form.Item>
                <Form.Item
                    className='cvat-credentials-form-item cvat-register-form-last-field'
                    name='password'
                    rules={[
                        {
                            required: true,
                            message: tError('Please specify a', { type: tType('Password'), a: 'your' }),
                        }, validatePassword,
                    ]}
                >
                    <CVATSigningInput
                        type={CVATInputType.PASSWORD}
                        id='password1'
                        placeholder={tType('Password')}
                        autoComplete='new-password'
                    />
                </Form.Item>
                {userAgreements.map((userAgreement: UserAgreement): JSX.Element => (
                    <Form.Item
                        className='cvat-agreements-form-item'
                        name={`agreement:${userAgreement.name}`}
                        key={userAgreement.name}
                        initialValue={false}
                        valuePropName='checked'
                        rules={[
                            {
                                required: true,
                                message: tError('You must accept to continue!'),
                            }, validateAgreement(userAgreements),
                        ]}
                    >
                        <Checkbox>
                            {userAgreement.textPrefix}
                            {!!userAgreement.url && (
                                <a rel='noopener noreferrer' target='_blank' href={userAgreement.url}>
                                    {` ${userAgreement.urlDisplayText}`}
                                </a>
                            )}
                        </Checkbox>
                    </Form.Item>
                ))}

                <Form.Item>
                    <Button
                        type='primary'
                        htmlType='submit'
                        className='cvat-credentials-action-button'
                        loading={fetching}
                        disabled={fetching}
                    >
                        {tAuth('Create account')}
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
}

export default React.memo(RegisterFormComponent);
