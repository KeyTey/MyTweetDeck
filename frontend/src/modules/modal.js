const initialState = {
    imageUrl: '',
    retweetId: ''
};

// Action Type
const SET_MODAL_DATA = 'SET_MODAL_DATA';

// Reducer
export const reducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_MODAL_DATA: {
            return { ...state, ...action.payload };
        }
        default: {
            return state;
        }
    }
};

// Action Creator
export const setModalDataAction = (data) => {
    return { type: SET_MODAL_DATA, payload: data };
};
