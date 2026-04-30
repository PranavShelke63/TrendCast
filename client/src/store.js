import { configureStore } from '@reduxjs/toolkit';
import authReducer from './features/authSlice';
import eventReducer from './features/eventSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    events: eventReducer
  }
});

export default store;
