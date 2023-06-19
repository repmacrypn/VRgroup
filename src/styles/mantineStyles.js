export const ms = {
    select: {
        input: {
            width: '100%',
            height: 42,
            marginBottom: 20,
            padding: '8px 12px',
            borderColor: '#D5D6DC',
            color: '#232134',
            font: 'normal 400 14px/20px Inter, sans-serif',
            '&:hover': {
                borderColor: '#5E96FC',
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
            font: 'normal 400 14px/20px Inter, sans-serif',
            color: '#232134',
            '&[data-hovered]': {
                backgroundColor: "#DEECFF",
                padding: '8px 12px',
            },
            '&[data-selected]': {
                backgroundColor: "#5E96FC",
                color: "white",
                padding: '8px 12px',
                font: 'normal 500 14px/20px Inter, sans-serif',
            },
        },
        rightSection: { pointerEvents: 'none' },
    },
    textInput: {
        input: {
            border: '1px solid #EBEBED',
            maxWidth: 384,
            height: 48,
            padding: '14px 16px',
            marginBottom: 24,
            color: '#151515',
            font: 'normal 400 14px/20px Mulish, sans-serif',
            '&:hover': {
                borderColor: '#3626A7',
            },
            /* [`@media (max-width: 1130px) and (min-width: 320px)`]: {
                width: '100%',
            }, */
        },
        label: {
            font: 'normal 600 14px/20px Mulish, sans-serif',
            paddingBottom: 8,
            pointerEvents: 'none'
        }
    },
    passwordInput: {
        input: {
            border: '1px solid #EBEBED',
            maxWidth: 384,
            height: 48,
            padding: '14px 16px',
            marginBottom: 24,
            color: '#151515',
            font: 'normal 400 14px/20px Mulish, sans-serif',
            '&:hover': {
                borderColor: '#3626A7',
            },
            /* [`@media (max-width: 1130px) and (min-width: 320px)`]: {
                width: '100%',
            }, */
        },
        innerInput: {
            width: '100%',
            height: '100%'
        },
        label: {
            font: 'normal 600 14px/20px Mulish, sans-serif',
            paddingBottom: 8,
            pointerEvents: 'none'
        }
    },
    button: {
        root: {
            font: 'normal 600 14px/24px Mulish, sans-serif',
            maxWidth: 384,
            width: '100%',
            height: 48,
            padding: '12px 120px',
            marginTop: 80,
            backgroundColor: '#3626A7',
            '&:hover': {
                backgroundColor: 'rgb(40 29 115)',
            },
        }
    }
}