import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { episodeApi } from '../../services/api';
import { Episode, CreateEpisodeRequest, UpdateEpisodeRequest } from '../../types/episode';

interface EpisodeState {
  items: Episode[];
  currentItem: Episode | null;
  loading: boolean;
  error: string | null;
}

const initialState: EpisodeState = {
  items: [],
  currentItem: null,
  loading: false,
  error: null,
};

export const fetchEpisodes = createAsyncThunk(
  'episode/fetchAll',
  async () => {
    const response = await episodeApi.getAll();
    return response.data;
  }
);

export const fetchEpisodeById = createAsyncThunk(
  'episode/fetchById',
  async (id: string) => {
    const response = await episodeApi.getById(id);
    return response.data;
  }
);

export const createEpisode = createAsyncThunk(
  'episode/create',
  async (data: CreateEpisodeRequest) => {
    const response = await episodeApi.create(data);
    return response.data;
  }
);

export const updateEpisode = createAsyncThunk(
  'episode/update',
  async ({ id, data }: { id: string; data: UpdateEpisodeRequest }) => {
    const response = await episodeApi.update(id, data);
    return response.data;
  }
);

export const deleteEpisode = createAsyncThunk(
  'episode/delete',
  async (id: string) => {
    await episodeApi.delete(id);
    return id;
  }
);

const episodeSlice = createSlice({
  name: 'episode',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchEpisodes.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEpisodes.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchEpisodes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch episodes';
      })
      .addCase(fetchEpisodeById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEpisodeById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentItem = action.payload;
      })
      .addCase(fetchEpisodeById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch episode';
      })
      .addCase(createEpisode.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createEpisode.fulfilled, (state, action) => {
        state.loading = false;
        state.items.push(action.payload);
      })
      .addCase(createEpisode.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to create episode';
      })
      .addCase(updateEpisode.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateEpisode.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.items.findIndex(item => item._id === action.payload._id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
        if (state.currentItem?._id === action.payload._id) {
          state.currentItem = action.payload;
        }
      })
      .addCase(updateEpisode.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to update episode';
      })
      .addCase(deleteEpisode.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteEpisode.fulfilled, (state, action) => {
        state.loading = false;
        state.items = state.items.filter(item => item._id !== action.payload);
        if (state.currentItem?._id === action.payload) {
          state.currentItem = null;
        }
      })
      .addCase(deleteEpisode.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to delete episode';
      });
  },
});

export const { clearError } = episodeSlice.actions;
export default episodeSlice.reducer; 
