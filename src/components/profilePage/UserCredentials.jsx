import { Button, TextInput } from '@mantine/core'
import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { Edit } from 'tabler-icons-react'
import { useDispatch, useSelector } from 'react-redux'
import { changeUserCreds, status } from '../../redux/authSlice'
import s from './ProfilePage.module.css'
import '../../styles/fonts.css'
import { ms } from '../../styles/mantineStyles'

export const NameSurnameInfo = () => {
    const dispatch = useDispatch()
    const isLoading = useSelector(status)
    const userData = useSelector(state => state.auth.userData)

    const [name, setName] = useState(userData?.firstName)
    const [surname, setSurname] = useState(userData?.lastName)

    const changeUserDataOnClick = () => {
        dispatch(changeUserCreds({ name, surname }))
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

const CustomTextInput = React.memo(({ classN, text, value, setValue, placeholder }) => {
    return (
        <div className={s[classN]}>
            <div className={'bold600'}>
                {text}
            </div>
            <TextInput
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder={placeholder}
                radius="md"
                styles={{
                    input: Object.assign({}, ms.textInput.defaultInput, ms.textInput.nameSurnameInput),
                }}
            />
        </div>
    )
})

CustomTextInput.displayName = 'CustomSur(Name)TextInput'

CustomTextInput.propTypes = {
    classN: PropTypes.string,
    text: PropTypes.string,
    value: PropTypes.string,
    placeholder: PropTypes.string,
    setValue: PropTypes.func,
}

export const LoginDataInfo = () => {
    const [email, setEmail] = useState('test@nyblecraft.com')
    const [password, setPassword] = useState('12345678qQ')

    return (
        <div>
            <TextInput
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Change email..."
                variant="unstyled"
                rightSectionWidth={125}
                rightSection={<RightSection text='Change email' />}
                styles={{
                    rightSection: ms.textInput.rightSection,
                    wrapper: ms.textInput.profileEmailPasswordWrapper,
                    input: Object.assign({}, ms.textInput.defaultInput, ms.textInput.profileEmailInput, ms.textInput.profileEmailPasswordInput),
                }}
            />
            <TextInput
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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

const RightSection = React.memo(({ text }) => {
    return (
        <div className={`${s.rightSection} bold600`}>
            <Edit viewBox="0 -2 24 24" height={18} width={26} />
            {text}
        </div>
    )
})

RightSection.displayName = 'RightSection'

RightSection.propTypes = {
    text: PropTypes.string,
}