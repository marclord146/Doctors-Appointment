import {createSlice} from '@reduxjs/toolkit';
// eslint-disable-next-line no-undef
export const alertsSlice = createSlice({

    name: "alerts",
    initialState: {
        loading: false,
    },
    reducers:{
        showLoading: (state) => {
            state.loading = true;
        },
        hideLoading: (state) => {
            state.loading = false;
        }
    }
});

export const {showLoading, hideLoading} = alertsSlice.actions;