import React, { useState } from 'react'
import { Button, TextInput } from '@mantine/core'
import { Edit } from 'tabler-icons-react'
import s from './ProfilePage.module.css'
import { changeUserCreds, status } from '../../redux/authSlice'
import '../../styles/fonts.css'
import { ms } from '../../styles/mantineStyles'
import { useAppDispatch, useAppSelector } from '../../hooks/useAppHooks'
import { IUserData } from '../../models/responses/login.interface'
import { StatusType } from '../../models/common/status.type'

export const NameSurnameInfo = () => {
    const dispatch = useAppDispatch()
    const isLoading: StatusType = useAppSelector(status)
    const userData: IUserData | null = useAppSelector(state => state.auth.userData)

    const [name, setName] = useState<string | undefined>(userData?.firstName)
    const [surname, setSurname] = useState<string | undefined>(userData?.lastName)

    const changeUserDataOnClick = (): void => {
        dispatch(changeUserCreds({ firstName: name!, lastName: surname! }))
    }

    return (
        <>
            <div className={s.nameSurnameWrapper}>
                <CustomTextInput
                    placeholder='Change username...'
                    text='First Name'
                    value={name}
                    setValue={setName}
                    classN='nameWrapper'
                />
                <CustomTextInput
                    placeholder='Change surname...'
                    text='Last Name'
                    value={surname}
                    setValue={setSurname}
                    classN='surnameWrapper'
                />
            </div>
            <Button
                onClick={changeUserDataOnClick}
                disabled={isLoading === 'loading'}
                radius='md'
                styles={{
                    root: Object.assign({}, ms.button.defaultRoot, ms.button.profileRoot),
                }}
            >
                Change user creds
            </Button>
        </>
    )
}

interface ICustomTextInputProps {
    classN: string;
    text: string;
    placeholder: string;
    value: string | undefined;
    setValue: React.Dispatch<React.SetStateAction<string | undefined>>;
}

const CustomTextInput = React.memo(({ classN, text, value, setValue, placeholder }: ICustomTextInputProps) => {
    return (
        <div className={s[classN]}>
            <div className={'bold600'}>
                {text}
            </div>
            <TextInput
                value={value}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setValue(e.target.value)}
                placeholder={placeholder}
                radius="md"
                styles={{
                    input: Object.assign({}, ms.textInput.defaultInput, ms.textInput.nameSurnameInput),
                }}
            />
        </div>
    )
})

export const LoginDataInfo = () => {
    const [email, setEmail] = useState('test@nyblecraft.com')
    const [password, setPassword] = useState('12345678qQ')

    return (
        <div>
            <TextInput
                value={email}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                placeholder="Change email..."
                variant="unstyled"
                rightSectionWidth={125}
                rightSection={<RightSection text='Change email' />}
                styles={{
                    rightSection: ms.textInput.rightSection,
                    wrapper: ms.textInput.profileEmailPasswordWrapper,
                    input: Object.assign({}, ms.textInput.defaultInput, ms.textInput.emailInput, ms.textInput.profileEmailPasswordInput),
                }}
            />
            <TextInput
                value={password}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                placeholder="Change password..."
                variant="unstyled"
                rightSectionWidth={155}
                rightSection={<RightSection text='Change password' />}
                styles={{
                    rightSection: ms.textInput.rightSection,
                    wrapper: ms.textInput.profileEmailPasswordWrapper,
                    input: Object.assign({}, ms.textInput.defaultInput, ms.textInput.profileEmailPasswordInput),
                }}
            />
        </div>
    )
}

const RightSection = React.memo(({ text }: { text: string }) => {
    return (
        <div className={`${s.rightSection} bold600`}>
            <Edit viewBox="0 -2 24 24" height={18} width={26} />
            {text}
        </div>
    )
})