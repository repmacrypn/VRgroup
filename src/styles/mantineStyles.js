export const ms = {
    select: {
        input: {
            width: '100%',
            height: 40,
            marginBottom: 16,
            padding: '14px 16px',
            border: '1px solid #EBEBED',
            color: '#151515',
            font: 'normal 400 14px/20px Mulish, sans-serif',
            '&:hover': {
                borderColor: '#3626A7',
            },
            '&:focus': {
                borderColor: '#3626A7',
            },
            ['@media (max-width: 770px) and (min-width: 320px)']: {
                marginBottom: 10,
            },
        },
        wrapper: {
            maxWidth: 204,
            borderBottom: '1px solid #E7E8EF',
            ['@media (max-width: 770px) and (min-width: 320px)']: {
                borderBottom: 'none',
            },
        },
        dropdown: {
            border: 'none',
            borderRadius: 8,
            width: '100%',
            height: 188,
            padding: 4,
        },
        item: {
            width: '97%',
            height: 36,
            padding: 8,
            borderRadius: 8,
            font: 'normal 400 14px/20px Mulish, sans-serif',
            color: '#151515',
            '&[data-selected]': {
                backgroundColor: '#20156d',
                color: 'white',
                padding: '8px 12px',
                font: 'normal 500 14px/20px Mulish, sans-serif',
            },
            '&[data-hovered]': {
                backgroundColor: '#948ad3',
                padding: '8px 12px',
            },
        },
        rightSection: {
            pointerEvents: 'none',
        },
    },
    textInput: {
        defaultInput: {
            border: '1px solid #EBEBED',
            padding: '14px 16px',
            color: '#151515',
            font: 'normal 400 14px/20px Mulish, sans-serif',
            '&:hover': {
                borderColor: '#3626A7',
            },
            '&:focus': {
                borderColor: '#3626A7',
            },
        },
        filterInput: {
            maxWidth: 204,
            width: '100%',
            height: 40,
            marginBottom: 16,
            ['@media (max-width: 770px) and (min-width: 320px)']: {
                marginBottom: 10,
            },
        },
        emailInput: {
            maxWidth: 384,
            height: 48,
            marginBottom: 24,
            /* [`@media (max-width: 1130px) and (min-width: 320px)`]: {
                width: '100%',
            }, */
        },
        profileEmailPasswordInput: {
            maxWidth: 668,
            width: '100%',
            height: 40,
            border: 'none',
        },
        nameSurnameInput: {
            maxWidth: 220,
            height: 40,
            marginTop: 5,
        },
        profileEmailPasswordWrapper: {
            maxWidth: 668,
            width: '94.2%',
            margin: '0 auto',
            borderTop: '1px solid #E7E8EF',
        },
        wrapper: {
            maxWidth: 204,
            borderBottom: '1px solid #E7E8EF',
            ['@media (max-width: 770px) and (min-width: 320px)']: {
                borderBottom: 'none',
            },
        },
        icon: {
            marginBottom: 16,
            ['@media (max-width: 770px) and (min-width: 320px)']: {
                marginBottom: 0,
            },
        },
        label: {
            font: 'normal 600 14px/20px Mulish, sans-serif',
            paddingBottom: 8,
            pointerEvents: 'none',
        },
        rightSection: {
            pointerEvents: 'none',
        },
    },
    passwordInput: {
        input: {
            maxWidth: 384,
            height: 48,
            padding: '14px 16px',
            marginBottom: 24,
            border: 'none',
            /* [`@media (max-width: 1130px) and (min-width: 320px)`]: {
                width: '100%',
            }, */
        },
        innerInput: {
            color: '#151515',
            font: 'normal 400 14px/20px Mulish, sans-serif',
            width: '100%',
            height: '100%',
            borderRadius: 6,
            paddingRight: 30,
            border: '1px solid #EBEBED',
            '&:focus': {
                borderColor: '#3626A7',
            },
            '&:hover': {
                borderColor: '#3626A7',
            },
        },
        label: {
            font: 'normal 600 14px/20px Mulish, sans-serif',
            paddingBottom: 8,
            pointerEvents: 'none',
        },
        rightSection: {
            marginRight: 7,
        },
    },
    button: {
        defaultRoot: {
            font: 'normal 600 14px/24px Mulish, sans-serif',
            backgroundColor: '#3626A7',
            '&:hover': {
                backgroundColor: 'rgb(40 29 115)',
            },
        },
        shortInfoRoot: {
            maxWidth: 376,
            width: '100%',
            height: 46,
            padding: '12px 52px',
            margin: ' 15px auto',
            display: 'block',
        },
        filterRoot: {
            maxWidth: 204,
            width: '100%',
            height: 40,
            padding: '12px 32px',
            marginTop: 8,
            marginBottom: 16,
            ['@media (max-width: 770px) and (min-width: 320px)']: {
                width: '60%',
                maxWidth: '100%',
                margin: '0 auto 18px',
            },
        },
        profileRoot: {
            maxWidth: 204,
            width: '100%',
            height: 40,
            padding: '0 32px',
            margin: '0 auto 10px',
            display: 'block',
        },
        loginRoot: {
            maxWidth: 384,
            width: '100%',
            height: 48,
            padding: '12px 20px',
            marginTop: 60,
            marginBottom: 20,
            display: 'block',
        },
        subRoot: {
            maxWidth: 156,
            width: '100%',
            height: 48,
            padding: '12px 20px',
            display: 'block',
        },
        emptyRoot: {
            font: 'normal 600 14px/20px Mulish, sans-serif',
            color: '#3626A7',
            backgroundColor: '#F5F6F9',
            '&:hover': {
                backgroundColor: '#E7E8EF',
            },
            padding: '10px 24px',
            maxWidth: '164px',
            width: '100%',
            height: '42px',
            borderRadius: '6px',
            border: 'none',
            margin: '0 auto 20px',
        },
    },
}