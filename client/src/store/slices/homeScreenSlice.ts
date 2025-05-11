import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { homeScreenApi } from '../../services/api';
import { HomeScreen } from '../../types';

interface HomeScreenState {
  items: HomeScreen[];
  selectedItem: HomeScreen | null;
  loading: boolean;
  error: string | null;
  total: number;
  page: number;
  limit: number;
}

const initialState: HomeScreenState = {
  items: [],
  selectedItem: null,
  loading: false,
  error: null,
  total: 0,
  page: 1,
  limit: 10,
};

export const fetchHomeScreens = createAsyncThunk(
  'homeScreen/fetchAll',
  async ({ page, limit }: { page: number; limit: number }) => {
    const response = await homeScreenApi.getAll(page, limit);
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
  async (data: Partial<HomeScreen>) => {
    const response = await homeScreenApi.create(data);
    return response.data;
  }
);

export const updateHomeScreen = createAsyncThunk(
  'homeScreen/update',
  async ({ id, data }: { id: string; data: Partial<HomeScreen> }) => {
    const response = await homeScreenApi.update(id, data);
    return response.data;
  }
);

export const setActive = createAsyncThunk(
  'homeScreen/setActive',
  async (id: string) => {
    const response = await homeScreenApi.setActive(id);
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
  'homeScreen/addContent',
  async ({ id, contentItemId, section }: { id: string; contentItemId: string; section: string }) => {
    const response = await homeScreenApi.addContentToSection(id, contentItemId, section);
    return response.data;
  }
);

export const removeContentFromSection = createAsyncThunk(
  'homeScreen/removeContent',
  async ({ id, contentItemId, section }: { id: string; contentItemId: string; section: string }) => {
    const response = await homeScreenApi.removeContentFromSection(id, contentItemId, section);
    return response.data;
  }
);

const homeScreenSlice = createSlice({
  name: 'homeScreen',
  initialState,
  reducers: {
    setPage: (state, action) => {
      state.page = action.payload;
    },
    setLimit: (state, action) => {
      state.limit = action.payload;
    },
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
        state.items = action.payload.items;
        state.total = action.payload.total;
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
        state.selectedItem = action.payload;
      })
      .addCase(fetchHomeScreenById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch home screen';
      })
      .addCase(createHomeScreen.fulfilled, (state, action) => {
        state.items.unshift(action.payload);
      })
      .addCase(updateHomeScreen.fulfilled, (state, action) => {
        const index = state.items.findIndex(item => item._id === action.payload._id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
        if (state.selectedItem?._id === action.payload._id) {
          state.selectedItem = action.payload;
        }
      })
      .addCase(setActive.fulfilled, (state, action) => {
        state.items = state.items.map(item => ({
          ...item,
          isActive: item._id === action.payload._id
        }));
        if (state.selectedItem?._id === action.payload._id) {
          state.selectedItem = action.payload;
        }
      })
      .addCase(deleteHomeScreen.fulfilled, (state, action) => {
        state.items = state.items.filter(item => item._id !== action.payload);
        if (state.selectedItem?._id === action.payload) {
          state.selectedItem = null;
        }
      })
      .addCase(addContentToSection.fulfilled, (state, action) => {
        const index = state.items.findIndex(item => item._id === action.payload._id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
        if (state.selectedItem?._id === action.payload._id) {
          state.selectedItem = action.payload;
        }
      })
      .addCase(removeContentFromSection.fulfilled, (state, action) => {
        const index = state.items.findIndex(item => item._id === action.payload._id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
        if (state.selectedItem?._id === action.payload._id) {
          state.selectedItem = action.payload;
        }
      });
  },
});

export const { setPage, setLimit, clearError } = homeScreenSlice.actions;
export default homeScreenSlice.reducer; 
