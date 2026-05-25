"use client";
import { createContext, useState, useEffect, ReactNode } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

interface User {
    id: number;
    email: string;
    role: string;
    fullName: string;
    gradeLevel?: string;
}

interface AuthContextType {
    user: User | null;
    token: string | null;
    login: (userData: { user: User, token: string }) => void;
    logout: () => void;
    updateUser: (updated: User) => void;
}

export const AuthContext = createContext<AuthContextType>({
    user: null,
    token: null,
    login: () => { },
    logout: () => { },
    updateUser: () => { },
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const router = useRouter();

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        const storedToken = Cookies.get("token");

        console.log("🔹 Token từ Cookies:", storedToken);
        console.log("🔹 User từ LocalStorage:", storedUser);

        if (storedUser && storedToken) {
            setUser(JSON.parse(storedUser));
            setToken(storedToken);
        } else {
            console.warn("⚠ Không tìm thấy user hoặc token trong LocalStorage.");
        }
    }, []);


    const login = ({ user, token }: { user: User, token: string }) => {
        setUser(user);
        setToken(token);
        localStorage.setItem("user", JSON.stringify(user));
        Cookies.set("token", token, { expires: 1 });

        // Điều hướng dựa trên vai trò
        if (user.role === "ADMIN") {
            router.push("/dashboard");
        } else if (user.role === "TEACHER") {
            router.push("/teacher");
        } else if (user.role === "MANAGER") {
            router.push("/manager");
        } else if (user.role === "ASSISTANT") {
            router.push("/assistant");
        } else if (user.role === "STUDENT") {
            router.push("/student");
        }

    };


    const updateUser = (updated: User) => {
        setUser(updated);
        localStorage.setItem("user", JSON.stringify(updated));
    };

    const logout = () => {
        setUser(null);
        setToken(null);
        localStorage.removeItem("user");
        Cookies.remove("token");
        router.replace("/auth/login");
    };

    return (
        <AuthContext.Provider value={{ user, token, login, logout, updateUser }}>
            {children}
        </AuthContext.Provider>
    );
};
