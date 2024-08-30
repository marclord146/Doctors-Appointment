import {createSlice} from '@reduxjs/toolkit';
// eslint-disable-next-line no-undef
export const userSlice = createSlice({

    name: "user",
    initialState: {
        user: null,
        
    },
    reducers:{
        setUser: (state, action) => {
            state.user = action.payload;
        },
        
        
    }
});

export const {setUser} = userSlice.actions;