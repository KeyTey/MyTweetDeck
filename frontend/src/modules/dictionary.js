import axios from 'axios';

const initialState = {
    home: {
        name: 'Home',
        items: [
            { type: 'home', name: 'Home', endpoint: '/api/home/timeline', iconClass: 'fas fa-home' }
        ]
    },
    list: {
        name: 'List',
        items: [
            { type: 'list', name: 'YouTuber', endpoint: '/api/list/timeline/1223193686378303488', iconClass: 'fas fa-bars' },
            { type: 'list', name: '芸能人', endpoint: '/api/list/timeline/1223191519676395522', iconClass: 'fas fa-bars' },
            { type: 'list', name: 'ニュース', endpoint: '/api/list/timeline/1223190130191564800', iconClass: 'fas fa-bars' }
        ]
    },
    search: {
        name: 'Search',
        items: []
    },
    anime: {
        name: 'Anime',
        items: [
            { type: 'anime', name: 'Kawaii', endpoint: '/api/anime/kawaii/timeline', iconClass: 'fas fa-grin-hearts' },
            { type: 'anime', name: 'Hentai', endpoint: '/api/anime/hentai/timeline', iconClass: 'fas fa-venus-mars' }
        ]
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
        const whereId = 23424856
        const trends = await axios.get(`/api/trends/${whereId}`)
            .then(response => response.data.trends)
            .catch(error => console.error(error) || []);
        const items = trends.map((trend) => (
            { type: 'search', name: trend.name, endpoint: '/api/search/tweets', iconClass: 'fas fa-search' }
        ));
        dispatch(setDictionaryAction('search', items));
    };
};
