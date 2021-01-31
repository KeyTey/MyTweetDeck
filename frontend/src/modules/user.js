import axios from 'axios';
import { resetDictionaryAction } from './dictionary';

// ステータス
export const status = {
    AUTHORIZED: 'AUTHORIZED',
    GUEST: 'GUEST',
    PENDING: 'PENDING'
};

const initialState = {
    id: '',
    name: '',
    screenName: '',
    profileImageUrl: '',
    status: status.PENDING,
    logout: 0
};

// Action Type
const SET_USER = 'SET_USER';

// Reducer
export const reducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_USER: {
            return { ...state, ...action.payload };
        }
        default: {
            return state;
        }
    }
};

// Action Creator
export const setUserAction = (user) => {
    return { type: SET_USER, payload: user };
};

// APIデータからユーザー取得
export const getUserFromAPIData = (user) => {
    if (user === null) return null;
    return {
        id: user.id_str,
        name: user.name,
        screenName: user.screen_name,
        profileImageUrl: user.profile_image_url
    };
};

// 認証チェック
export const checkAuth = (callback) => {
    return async (dispatch) => {
        // 認証済みユーザーの取得
        let userData = await axios.get('/api/account/user')
            .then(response => response.data.user)
            .catch(error => console.error(error) || null);
        // 認証済みユーザーが存在しない場合
        if (userData === null) {
            userData = await axios.get('/api/user/783214')
                .then(response => response.data.user)
                .catch(error => console.error(error) || null);
            dispatch(setUserAction({ status: status.GUEST }));
        }
        // 認証済みユーザーが存在する場合
        else {
            dispatch(setUserAction({ status: status.AUTHORIZED }));
        }
        const user = getUserFromAPIData(userData) || {};
        dispatch(setUserAction(user));
        callback();
    };
};

// ログイン
export const login = async () => {
    // 認証用URL取得
    const endpoint = await axios.get('/api/account/authorization')
        .then(response => response.data.endpoint)
        .catch(error => console.error(error) || '');
    // リダイレクト
    if (endpoint === '') location.reload();
    else location.href = endpoint;
};

// ログアウト
export const logout = () => {
    return async (dispatch, getState) => {
        await axios.post('/api/account/logout').catch(error => console.error(error));
        const user = { ...initialState, logout: getState().user.logout + 1 };
        dispatch(resetDictionaryAction());
        dispatch(setUserAction(user));
    };
};
