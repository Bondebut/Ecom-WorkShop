import axios from "axios";
import { create } from "zustand";
import { persist,createJSONStorage } from 'zustand/middleware';
import { loginUser } from "../api/auth";

const ecomStore = (set) => ({
    user: null, token: null, actionLogin: async (form) => {
        const res = await loginUser(form)
        //zustand
        set({
            user:res.data.payload,
            token:res.data.token
        })
        return res
    }
})

const usePersist = {
    name:'ecom-store',
    Storage: createJSONStorage(()=>localStorage)
}

const useEcomStore = create(persist(ecomStore,usePersist))

export default useEcomStore