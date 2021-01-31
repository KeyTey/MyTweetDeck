import axios from 'axios';

const initialState = {
    home: {
        name: 'ホーム',
        items: [
            { type: 'home', name: 'ホーム', endpoint: '/api/home/timeline', iconClass: 'fas fa-home' }
        ]
    },
    list: {
        name: 'リスト',
        items: []
    },
    trends: {
        name: 'トレンド',
        items: []
    }
};

// Action Type
const SET_DICTIONARY_ITEMS = 'SET_DICTIONARY_ITEMS';
const RESET_DICTIONARY = 'RESET_DICTIONARY';

// Reducer
export const reducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_DICTIONARY_ITEMS: {
            const { key, items } = action.payload;
            const data = { ...state[key] };
            return { ...state, [key]: { ...data, items } };
        }
        case RESET_DICTIONARY: {
            return initialState;
        }
        default: {
            return state;
        }
    }
};

// Action Creator
export const setDictionaryAction = (key, items) => {
    return { type: SET_DICTIONARY_ITEMS, payload: { key, items } };
};
export const resetDictionaryAction = () => {
    return { type: RESET_DICTIONARY };
};

// リスト一覧のロード
export const loadListDictionary = () => {
    return async (dispatch, getState) => {
        const userId = getState().user.id;
        if (userId === '') return;
        const itemsData = await axios.get(`/api/list/items/${userId}`)
            .then(response => response.data.items)
            .catch(error => console.error(error) || []);
        const items = itemsData.map((item) => (
            { type: 'list', name: item.name, endpoint: `/api/list/timeline/${item.id_str}`, iconClass: 'fas fa-bars' }
        ));
        dispatch(setDictionaryAction('list', items));
    };
};

// トレンドのロード
export const loadTrends = () => {
    return async (dispatch) => {
        const trends = await axios.get('/api/trends')
            .then(response => response.data.trends)
            .catch(error => console.error(error) || []);
        const items = trends.map((trend) => (
            { type: 'trends', name: trend.name, endpoint: '/api/search/tweets', iconClass: 'fas fa-fire' }
        ));
        dispatch(setDictionaryAction('trends', items));
    };
};
