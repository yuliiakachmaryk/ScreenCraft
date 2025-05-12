import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { contentItemApi } from '../../services/api';
import { ContentItem, CreateContentItemRequest, UpdateContentItemRequest } from '../../types/contentItem';

interface ContentItemState {
  items: ContentItem[];
  currentItem: ContentItem | null;
  loading: boolean;
  error: string | null;
  total: number;
  currentPage: number;
  itemsPerPage: number;
}

const initialState: ContentItemState = {
  items: [],
  currentItem: null,
  loading: false,
  error: null,
  total: 0,
  currentPage: 1,
  itemsPerPage: 10,
};

export const fetchContentItems = createAsyncThunk(
  'contentItem/fetchAll',
  async ({ page = 1, limit = 10 }: { page?: number; limit?: number }) => {
    const response = await contentItemApi.getAll(page, limit);
    return response.data;
  }
);

export const fetchContentItemById = createAsyncThunk(
  'contentItem/fetchById',
  async (id: string) => {
    const response = await contentItemApi.getById(id);
    return response.data;
  }
);

export const createContentItem = createAsyncThunk(
  'contentItem/create',
  async (data: CreateContentItemRequest) => {
    const response = await contentItemApi.create(data);
    return response.data;
  }
);

export const updateContentItem = createAsyncThunk(
  'contentItem/update',
  async ({ id, data }: { id: string; data: UpdateContentItemRequest }) => {
    const response = await contentItemApi.update(id, data);
    return response.data;
  }
);

export const deleteContentItem = createAsyncThunk(
  'contentItem/delete',
  async (id: string) => {
    await contentItemApi.delete(id);
    return id;
  }
);

export const addEpisodeToContentItem = createAsyncThunk(
  'contentItem/addEpisode',
  async ({ id, episodeId }: { id: string; episodeId: string }) => {
    const response = await contentItemApi.addEpisode(id, episodeId);
    return response.data;
  }
);

export const removeEpisodeFromContentItem = createAsyncThunk(
  'contentItem/removeEpisode',
  async ({ id, episodeId }: { id: string; episodeId: string }) => {
    const response = await contentItemApi.removeEpisode(id, episodeId);
    return response.data;
  }
);

const contentItemSlice = createSlice({
  name: 'contentItem',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setPage: (state, action) => {
      state.currentPage = action.payload;
    },
    setItemsPerPage: (state, action) => {
      state.itemsPerPage = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchContentItems.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchContentItems.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.contentItems;
        state.total = action.payload.total;
      })
      .addCase(fetchContentItems.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch content items';
      })
      .addCase(fetchContentItemById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchContentItemById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentItem = action.payload;
      })
      .addCase(fetchContentItemById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch content item';
      })
      .addCase(createContentItem.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createContentItem.fulfilled, (state, action) => {
        state.loading = false;
        state.items.push(action.payload);
      })
      .addCase(createContentItem.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to create content item';
      })
      .addCase(updateContentItem.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateContentItem.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.items.findIndex(item => item._id === action.payload._id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
        if (state.currentItem?._id === action.payload._id) {
          state.currentItem = action.payload;
        }
      })
      .addCase(updateContentItem.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to update content item';
      })
      .addCase(deleteContentItem.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteContentItem.fulfilled, (state, action) => {
        state.loading = false;
        state.items = state.items.filter(item => item._id !== action.payload);
        if (state.currentItem?._id === action.payload) {
          state.currentItem = null;
        }
      })
      .addCase(deleteContentItem.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to delete content item';
      })
      .addCase(addEpisodeToContentItem.fulfilled, (state, action) => {
        const index = state.items.findIndex(item => item._id === action.payload._id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })
      .addCase(removeEpisodeFromContentItem.fulfilled, (state, action) => {
        const index = state.items.findIndex(item => item._id === action.payload._id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      });
  },
});

export const { clearError, setPage, setItemsPerPage } = contentItemSlice.actions;
export default contentItemSlice.reducer; 
