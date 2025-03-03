"use client";
import { createContext, useState, useEffect, ReactNode } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

interface User {
    id: number;
    email: string;
    role: string;
    fullName: string;
}

interface AuthContextType {
    user: User | null;
    token: string | null;
    login: (userData: { user: User, token: string }) => void;
    logout: () => void;
}

export const AuthContext = createContext<AuthContextType>({
    user: null,
    token: null,
    login: () => { },
    logout: () => { },
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const router = useRouter();

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        const storedToken = Cookies.get("token");

        if (storedUser && storedToken) {
            setUser(JSON.parse(storedUser));
            setToken(storedToken);
        }
    }, []);

    const login = ({ user, token }: { user: User, token: string }) => {
        setUser(user);
        setToken(token);
        localStorage.setItem("user", JSON.stringify(user));
        Cookies.set("token", token, { expires: 1 });

        // Điều hướng dựa trên vai trò
        if (user.role === "Assistant") {
            router.push("/assistant");
        } else {
            router.push("/dashboard");
        }
    };


    const logout = () => {
        setUser(null);
        setToken(null);
        localStorage.removeItem("user");
        Cookies.remove("token");
        router.replace("/auth/login");
    };

    return (
        <AuthContext.Provider value={{ user, token, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
