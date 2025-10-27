import { create } from "zustand";
import { axiosInstance } from "../lib/axios.js";
import { toast } from "react-hot-toast";
import { io } from "socket.io-client"

const BASE_URL = import.meta.env.MODE === "development" ? "http://localhost:3000" : "/"

export const useAuthStore = create((set, get) => ({
    authUser: null,
    isCheckingAuth: true,
    isSigningUp: false,
    isLoggingIn: false,
    onlineUsers: [],

    checkAuth: async () => {
        try {
            const res = await axiosInstance.get("/auth/check");
            set({ authUser: res.data })
            get().connectSocket()
        } catch (error) {
            console.log("Error in authCheck:", error);
            set({ authUser: null });
        } finally {
            set({ isCheckingAuth: false });
        }
    },

    signup: async (data) => {
        try {
            set({ isSigningUp: true });
            const res = await axiosInstance.post("/auth/signup", data)
            set({ authUser: res.data });
            toast.success("Account created successfully!");
            get().connectSocket()
        } catch (error) {
            toast.error(error.response.data.message);
        } finally {
            set({ isSigningUp: false });
        }
    },

    login: async (data) => {
        try {
            set({ isLoggingIn: true });
            const res = await axiosInstance.post("/auth/login", data)
            set({ authUser: res.data });
            toast.success("Logged In Successfully!");
            get().connectSocket()
        } catch (error) {
            toast.error(error.response.data.message);
        } finally {
            set({ isLoggingIn: false });
        }
    },

    logout: async () => {
        try {
            await axiosInstance.post("/auth/logout");
            set({ authUser: null });
            toast.success("Logged Out Successfully!");
            get().disconnectSocket()
        }
        catch (error) {
            toast.error("Error logging out. Please try again.");
            console.log("Logout error:", error);
        }
    },

    updateProfile: async () => {
        try {
            const res = await axiosInstance.put("/auth/update-profile", data)
            set({ authUser: res.data })
            toast.success("Profile Updated Successfully")
        } catch (error) {
            console.log("error in update profile", error)
            toast.error(error.response.data.message);
        }
    },
 
    connectSocket: () => {
        const { authUser } = get()
        if (!authUser || get().socket?.connected) return

        const socket = io(BASE_URL, {
            withCredentials: true
        })

        socket.connect()

        set({ socket })

        //listen for online users event
        socket.on("getOnlineUsers", (userIds) => {
            set({ onlineUsers: userIds })
        })
    },

    disconnectSocket: () => {
        if (get().socket?.connected) get().socket.disconnect();
    }
}))

