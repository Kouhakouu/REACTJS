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
    status?: number; // chỉ áp dụng cho trợ giảng: 0 = chưa kích hoạt, 1 = đã kích hoạt
}

interface AuthContextType {
    user: User | null;
    token: string | null;
    initialized: boolean; // đã đọc xong user/token từ localStorage chưa
    login: (userData: { user: User, token: string }) => void;
    logout: () => void;
    updateUser: (updated: User) => void;
}

export const AuthContext = createContext<AuthContextType>({
    user: null,
    token: null,
    initialized: false,
    login: () => { },
    logout: () => { },
    updateUser: () => { },
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [initialized, setInitialized] = useState(false);
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
        setInitialized(true);
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
            // Chưa kích hoạt (status !== 1) -> phải làm test + nhập mã ở /quiz
            if (user.status === 1) {
                router.push("/assistant");
            } else {
                router.push("/quiz");
            }
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
        <AuthContext.Provider value={{ user, token, initialized, login, logout, updateUser }}>
            {children}
        </AuthContext.Provider>
    );
};
