import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  token: null,
  job: null,
  searchValues: {
    keyword: '',
    type: 'all',
    industry: '',
    requirement: 'Fresher',
    order: 'desc',
    other: 'Traditional',
  },
  loading: false,
  alert: false,
  filter: false,
  alertType: 'info',
  alertMessage: 'This is job portal website',
  unRead: undefined,
  active: 'Home',
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    storeUserData: (state, action) => {
      state.token = action.payload.token;
      state.user = action.payload.user;
    },
    logOut: (state) => {
      state.token = null;
      state.user = null;
      state.job = null;
      state.items = null;
      state.unRead = null;
      state.filter = false;
      state.alertType = 'info';
      state.alertMessage = 'This is job portal website';
    },
    setLoading: (state) => {
      state.loading = true;
    },
    loadingComplete: (state) => {
      state.loading = false;
    },
    setAlert: (state, action) => {
      state.alert = true;
      state.alertType = action.payload.type;
      state.alertMessage = action.payload.message;
    },
    alertComplete: (state) => {
      state.alert = false;
      state.alertType = 'info';
      state.alertMessage = 'This is job portal website';
    },
    setJob: (state, action) => {
      state.job = action.payload;
    },
    removeJob: (state) => {
      state.job = null;
    },
    setUnRead: (state, action) => {
      state.unRead = action.payload;
    },
    setFilter: (state) => {
      state.filter = true;
    },
    removeFilter: (state) => {
      state.filter = false;
    },
    setSearch: (state, action) => {
      state.searchValues = action.payload;
    },
    removeSearch: (state) => {
      state.searchValues = {
        keyword: '',
        type: 'all',
        industry: '',
        requirement: 'Fresher',
        order: 'desc',
        other: 'Traditional',
      };
    },
    setActive: (state, action) => {
      state.active = action.payload;
    }
  }
})

export const { storeUserData, logOut, setLoading, loadingComplete, setAlert, alertComplete, setJob, removeJob, setUnRead, setFilter, removeFilter, setSearch, removeSearch ,setActive } = userSlice.actions;
export default userSlice.reducer;
