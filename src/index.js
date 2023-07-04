/* eslint-disable no-undef */
import React from 'react'
import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'
import { MantineProvider } from '@mantine/core'
import './index.css'
import App from './App'
import reportWebVitals from './reportWebVitals'
import store from './redux/store'

const root = ReactDOM.createRoot(
    document.getElementById('root'),
)
root.render(
    <MantineProvider withGlobalStyles withNormalizeCSS>
        <BrowserRouter basename={process.env.PUBLIC_URL}>
            <Provider store={store}>
                <App />
            </Provider>
        </BrowserRouter>
    </MantineProvider>,
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
