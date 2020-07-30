import axios from 'axios';
import { cloneDeep } from 'lodash';

const initialState = {
    resetScrollByDoubleClickOuter: {
        description: '外側をクリックしてスクロールをリセットする',
        enabled: false
    },
    toggleSettingByMouseOverOut: {
        description: 'マウスオーバーでタイムラインの設定を開く',
        enabled: false
    }
};

// Action Type
const SET_SETTING = 'SET_SETTING';
const RESET_SETTING = 'RESET_SETTING';

// Reducer
export const reducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_SETTING: {
            const setting = action.payload;
            return { ...state, ...setting };
        }
        case RESET_SETTING: {
            return initialState;
        }
        default: {
            return state;
        }
    }
};

// Action Creator
export const setSettingAction = (setting) => {
    return { type: SET_SETTING, payload: setting };
};
export const resetSettingAction = () => {
    return { type: RESET_SETTING };
};

// 不要な設定の削除
export const removeUselessSetting = (fetchedSetting) => {
    const keys = Object.keys(fetchedSetting).filter(key => key in initialState);
    const setting = Object.fromEntries(keys.map(key => [key, fetchedSetting[key]]));
    return setting;
};

// 設定の初期化
export const initSetting = () => {
    return async (dispatch, getState) => {
        dispatch(resetSettingAction());
        const settingData = await axios.get('/api/account/setting')
            .then(response => response.data.setting)
            .catch(error => console.error(error) || {});
        const setting = mergeFormData(settingData, getState().setting);
        dispatch(setSettingAction(setting));
    };
};

// 設定の更新
export const setSetting = (setting) => {
    return async (dispatch, getState) => {
        dispatch(setSettingAction(setting));
        const formData = new FormData();
        const settingData = convertToFormData(getState().setting);
        formData.append('setting', JSON.stringify(settingData));
        await axios.post('/api/account/setting', formData)
            .catch(error => console.error(error));
    };
};

// 設定の切り替え
export const toggleSetting = (key) => {
    return async (dispatch, getState) => {
        const setting = getState().setting[key];
        const enabled = !setting.enabled;
        const newSetting = { ...setting, enabled };
        dispatch(setSetting({ [key]: newSetting }));
    };
};

// 設定をフォームデータへ変換する
export const convertToFormData = (setting) => {
    const keys = Object.keys(setting);
    const settingEntries = keys.map(key => [key, setting[key].enabled]);
    const settingData = Object.fromEntries(settingEntries);
    return settingData;
};

// 設定にフォームデータをマージする
export const mergeFormData = (formData, setting) => {
    const newSetting = cloneDeep(setting);
    const keys = Object.keys(formData).filter(key => key in setting);
    keys.forEach(key => newSetting[key].enabled = formData[key]);
    return newSetting;
};
