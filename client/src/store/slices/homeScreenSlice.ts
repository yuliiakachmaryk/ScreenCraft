import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '../../services/api';

interface Section {
  name: string;
  order: number;
  items: any[];
}

export interface HomeScreen {
  _id: string;
  sections: Section[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

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
    const response = await api.get(`/home-screens?page=${page}&limit=${limit}`);
    return response.data;
  }
);

export const fetchHomeScreenById = createAsyncThunk(
  'homeScreen/fetchById',
  async (id: string) => {
    const response = await api.get(`/home-screens/${id}`);
    return response.data;
  }
);

export const createHomeScreen = createAsyncThunk(
  'homeScreen/create',
  async (data: Partial<HomeScreen>) => {
    const response = await api.post('/home-screens', data);
    return response.data;
  }
);

export const updateHomeScreen = createAsyncThunk(
  'homeScreen/update',
  async ({ id, data }: { id: string; data: Partial<HomeScreen> }) => {
    const response = await api.patch(`/home-screens/${id}`, data);
    return response.data;
  }
);

export const deleteHomeScreen = createAsyncThunk(
  'homeScreen/delete',
  async (id: string) => {
    await api.delete(`/home-screens/${id}`);
    return id;
  }
);

export const setActive = createAsyncThunk(
  'homeScreen/setActive',
  async (id: string) => {
    const response = await api.put(`/home-screens/${id}/activate`);
    return response.data;
  }
);

export const addSection = createAsyncThunk(
  'homeScreen/addSection',
  async ({ id, section }: { id: string; section: Section }) => {
    const response = await api.post(`/home-screens/${id}/sections`, section);
    return response.data;
  }
);

export const updateSection = createAsyncThunk(
  'homeScreen/updateSection',
  async ({ id, sectionName, sectionData }: { id: string; sectionName: string; sectionData: Partial<Section> }) => {
    const response = await api.patch(`/home-screens/${id}/sections/${sectionName}`, sectionData);
    return response.data;
  }
);

export const removeSection = createAsyncThunk(
  'homeScreen/removeSection',
  async ({ id, sectionName }: { id: string; sectionName: string }) => {
    const response = await api.delete(`/home-screens/${id}/sections/${sectionName}`);
    return response.data;
  }
);

export const addContentToSection = createAsyncThunk(
  'homeScreen/addContentToSection',
  async ({ id, section, contentItemId }: { id: string; section: string; contentItemId: string }) => {
    const response = await api.post(`/home-screens/${id}/sections/${section}/content`, { contentItemId });
    return response.data;
  }
);

export const removeContentFromSection = createAsyncThunk(
  'homeScreen/removeContentFromSection',
  async ({ id, section, contentItemId }: { id: string; section: string; contentItemId: string }) => {
    const response = await api.delete(`/home-screens/${id}/sections/${section}/content/${contentItemId}`);
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
        state.items.push(action.payload);
      })
      .addCase(updateHomeScreen.fulfilled, (state, action) => {
        const index = state.items.findIndex((item) => item._id === action.payload._id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
        if (state.selectedItem?._id === action.payload._id) {
          state.selectedItem = action.payload;
        }
      })
      .addCase(deleteHomeScreen.fulfilled, (state, action) => {
        state.items = state.items.filter((item) => item._id !== action.payload);
        if (state.selectedItem?._id === action.payload) {
          state.selectedItem = null;
        }
      })
      .addCase(setActive.fulfilled, (state, action) => {
        state.items = state.items.map((item) => ({
          ...item,
          isActive: item._id === action.payload._id,
        }));
        if (state.selectedItem?._id === action.payload._id) {
          state.selectedItem = action.payload;
        }
      })
      .addCase(addSection.fulfilled, (state, action) => {
        if (state.selectedItem?._id === action.payload._id) {
          state.selectedItem = action.payload;
        }
      })
      .addCase(updateSection.fulfilled, (state, action) => {
        if (state.selectedItem?._id === action.payload._id) {
          state.selectedItem = action.payload;
        }
      })
      .addCase(removeSection.fulfilled, (state, action) => {
        if (state.selectedItem?._id === action.payload._id) {
          state.selectedItem = action.payload;
        }
      })
      .addCase(addContentToSection.fulfilled, (state, action) => {
        if (state.selectedItem?._id === action.payload._id) {
          state.selectedItem = action.payload;
        }
      })
      .addCase(removeContentFromSection.fulfilled, (state, action) => {
        if (state.selectedItem?._id === action.payload._id) {
          state.selectedItem = action.payload;
        }
      });
  },
});

export const { setPage, setLimit } = homeScreenSlice.actions;
export default homeScreenSlice.reducer; 
