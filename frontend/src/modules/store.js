import { createStore as reduxCreateStore, combineReducers, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { reducer as userReducer } from './user';
import { reducer as timelinesReducer } from './timelines';
import { reducer as dictionaryReducer } from './dictionary';
import { reducer as settingReducer } from './setting';
import { reducer as modalReducer } from './modal';

const createStore = () => {
    const store = reduxCreateStore(
        combineReducers({
            user: userReducer,
            timelines: timelinesReducer,
            dictionary: dictionaryReducer,
            setting: settingReducer,
            modal: modalReducer
        }),
        applyMiddleware(thunk)
    );
    return store;
};

export default createStore;
