import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    user: null,
    loading: false,
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setUser: (state, action) => {
            state.user = action.payload;
            console.log("User set in Redux state:", action.payload);  // Debugging
        },
        setLoading: (state, action) => {
            state.loading = action.payload;
        },
    },
});

export const { setUser, setLoading } = authSlice.actions;
export default authSlice.reducer;
