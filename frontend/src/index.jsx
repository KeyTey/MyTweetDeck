import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Route } from 'react-router-dom';
import App from './components/App';

const router = (
    <BrowserRouter>
        <Route path='/' component={App} />
    </BrowserRouter>
);

ReactDOM.render(router, document.getElementById('container'));
