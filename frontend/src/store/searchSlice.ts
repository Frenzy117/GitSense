import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { SearchResult } from '../types';

const MAX_HISTORY = 20;

export interface SearchState {
  results: SearchResult[];
  queryHistory: string[];
  isLoading: boolean;
  lastQuery: string;
}

const initialState: SearchState = {
  results: [],
  queryHistory: [],
  isLoading: false,
  lastQuery: '',
};

const searchSlice = createSlice({
  name: 'search',
  initialState,
  reducers: {
    setSearchResults: (state, action: PayloadAction<SearchResult[]>) => {
      state.results = action.payload;
      state.isLoading = false;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setLastQuery: (state, action: PayloadAction<string>) => {
      state.lastQuery = action.payload;
    },
    addToQueryHistory: (state, action: PayloadAction<string>) => {
      const query = action.payload.trim();
      if (!query) return;
      state.queryHistory = [
        query,
        ...state.queryHistory.filter((q) => q !== query),
      ].slice(0, MAX_HISTORY);
    },
    removeFromQueryHistory: (state, action: PayloadAction<string>) => {
      state.queryHistory = state.queryHistory.filter((q) => q !== action.payload);
    },
    clearQueryHistory: (state) => {
      state.queryHistory = [];
    },
  },
});

export const {
  setSearchResults,
  setLoading,
  setLastQuery,
  addToQueryHistory,
  removeFromQueryHistory,
  clearQueryHistory,
} = searchSlice.actions;
export default searchSlice.reducer;
