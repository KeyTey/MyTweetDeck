import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { BrowserRouter, Route } from 'react-router-dom';
import { Provider as AlertProvider } from 'react-alert'
import AlertTemplate from 'react-alert-template-basic'
import App from './components/App';
import createStore from './modules/store';

const store = createStore();

const options = {
    position: 'top right',
    offset: '5px',
    transition: 'scale',
    timeout: 3000
}

const provider = (
    <Provider store={store}>
        <BrowserRouter>
            <AlertProvider template={AlertTemplate} {...options}>
                <Route path='/' component={App} />
            </AlertProvider>
        </BrowserRouter>
    </Provider>
);

ReactDOM.render(provider, document.getElementById('container'));
