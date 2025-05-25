import axios from "axios";
import { create } from "zustand";
import { persist, createJSONStorage } from 'zustand/middleware';
import { listCategory, removeCategory as apiRemoveCategory } from "../api/Category";

const dataStore = (set, get) => ({
    categories: [],
    previousCategories: null, // To store previous state for reverting
    
    getCategories: async (token) => {
        try {
            const res = await listCategory(token);
            set({ categories: res.data });
        } catch (err) {
            const errMsg = err.response?.data?.message;
            console.error(errMsg);
        }
    },
    
    addCategory: (category) => set((state) => ({
        categories: [...state.categories, category]
    })),
    
    // Optimistic removal with API call and fallback
    removeCategory: async (token, id) => {
        // Store current state before optimistic update
        const previousState = [...get().categories];
        
        // Optimistic update
        set((state) => ({
            previousCategories: previousState,
            categories: state.categories.filter(cat => cat._id !== id)
        }));
        
        try {
            // Actual API call
            const response = await apiRemoveCategory(token, id);
            return response; // Return API response for toast notifications
        } catch (err) {
            // Revert to previous state if API fails
            set({ categories: previousState, previousCategories: null });
            throw err; // Re-throw to handle in component
        }
    }
});

const usePersist = {
    name: 'data-store',
    storage: createJSONStorage(() => localStorage)
}

const useDataStore = create(persist(dataStore, usePersist));
export default useDataStore