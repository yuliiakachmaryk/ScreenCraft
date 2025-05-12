import { configureStore } from '@reduxjs/toolkit';
import homeScreenReducer from './slices/homeScreenSlice';
import contentItemReducer from './slices/contentItemSlice';
import episodeReducer from './slices/episodeSlice';

export const store = configureStore({
  reducer: {
    homeScreen: homeScreenReducer,
    contentItem: contentItemReducer,
    episode: episodeReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch; 