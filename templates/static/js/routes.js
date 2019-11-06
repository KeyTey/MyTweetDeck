import React from 'react';
import { HashRouter, Route, hashHistory } from 'react-router-dom';
import App from './components/App';

export default (
    <HashRouter history={hashHistory}>
        <div>
            <Route path='/' component={App} />
        </div>
    </HashRouter>
);
