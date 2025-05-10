import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { homeScreenApi } from '../../services/api';
import { HomeScreen, CreateHomeScreenRequest, UpdateHomeScreenRequest } from '../../types/homeScreen';

interface HomeScreenState {
  items: HomeScreen[];
  currentItem: HomeScreen | null;
  loading: boolean;
  error: string | null;
}

const initialState: HomeScreenState = {
  items: [],
  currentItem: null,
  loading: false,
  error: null,
};

export const fetchHomeScreens = createAsyncThunk(
  'homeScreen/fetchAll',
  async () => {
    const response = await homeScreenApi.getAll();
    return response.data;
  }
);

export const fetchHomeScreenById = createAsyncThunk(
  'homeScreen/fetchById',
  async (id: string) => {
    const response = await homeScreenApi.getById(id);
    return response.data;
  }
);

export const createHomeScreen = createAsyncThunk(
  'homeScreen/create',
  async (data: CreateHomeScreenRequest) => {
    const response = await homeScreenApi.create(data);
    return response.data;
  }
);

export const updateHomeScreen = createAsyncThunk(
  'homeScreen/update',
  async ({ id, data }: { id: string; data: UpdateHomeScreenRequest }) => {
    const response = await homeScreenApi.update(id, data);
    return response.data;
  }
);

export const deleteHomeScreen = createAsyncThunk(
  'homeScreen/delete',
  async (id: string) => {
    await homeScreenApi.delete(id);
    return id;
  }
);

export const addContentToSection = createAsyncThunk(
  'homeScreen/addContentToSection',
  async ({ id, section, contentId }: { id: string; section: string; contentId: string }) => {
    const response = await homeScreenApi.addContentToSection(id, contentId, section);
    return response.data;
  }
);

export const removeContentFromSection = createAsyncThunk(
  'homeScreen/removeContentFromSection',
  async ({ id, section, contentId }: { id: string; section: string; contentId: string }) => {
    const response = await homeScreenApi.removeContentFromSection(id, contentId, section);
    return response.data;
  }
);

const homeScreenSlice = createSlice({
  name: 'homeScreen',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchHomeScreens.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchHomeScreens.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchHomeScreens.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch home screens';
      })
      .addCase(fetchHomeScreenById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchHomeScreenById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentItem = action.payload;
      })
      .addCase(fetchHomeScreenById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch home screen';
      })
      .addCase(createHomeScreen.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createHomeScreen.fulfilled, (state, action) => {
        state.loading = false;
        state.items.push(action.payload);
      })
      .addCase(createHomeScreen.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to create home screen';
      })
      .addCase(updateHomeScreen.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateHomeScreen.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.items.findIndex(item => item._id === action.payload._id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
        if (state.currentItem?._id === action.payload._id) {
          state.currentItem = action.payload;
        }
      })
      .addCase(updateHomeScreen.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to update home screen';
      })
      .addCase(deleteHomeScreen.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteHomeScreen.fulfilled, (state, action) => {
        state.loading = false;
        state.items = state.items.filter(item => item._id !== action.payload);
        if (state.currentItem?._id === action.payload) {
          state.currentItem = null;
        }
      })
      .addCase(deleteHomeScreen.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to delete home screen';
      })
      .addCase(addContentToSection.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addContentToSection.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.items.findIndex(item => item._id === action.payload._id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
        if (state.currentItem?._id === action.payload._id) {
          state.currentItem = action.payload;
        }
      })
      .addCase(addContentToSection.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to add content to section';
      })
      .addCase(removeContentFromSection.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeContentFromSection.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.items.findIndex(item => item._id === action.payload._id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
        if (state.currentItem?._id === action.payload._id) {
          state.currentItem = action.payload;
        }
      })
      .addCase(removeContentFromSection.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to remove content from section';
      });
  },
});

export const { clearError } = homeScreenSlice.actions;
export default homeScreenSlice.reducer; 
