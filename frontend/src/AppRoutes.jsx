import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Home } from './pages/Home';
import { Reserva } from './pages/Reserva';
import { Login } from "./pages/Login";
import { useState, useEffect } from "react";
import { PageLayout } from "./layout";
import {jwtDecode} from "jwt-decode";
import { CadastroUsuario } from "./components/FormAddUser";

const isTokenValid = (token) => {
    if (!token) return false;

    try {
        const decoded = jwtDecode(token);
        const currentTime = Date.now() / 1000;
        return decoded.exp > currentTime;
    } catch (error) {
        console.log(error);
        return false;
    }
}

export function AppRoutes() {
    const [token, setToken] = useState(localStorage.getItem('token') || '');

    useEffect(() => {
        if (token && isTokenValid(token)) {
            localStorage.setItem('token', token);
        } else {
            setToken('');
            localStorage.removeItem('token');
        }
    }, [token]);

    const isAuthenticated = !!token;

    const handleLogout = () => {
        setToken('');
        localStorage.removeItem('token');
    }

    return (
        <BrowserRouter>
            <Routes>
                <Route path="/login" element={!isAuthenticated ? <Login setToken={setToken} /> : <Navigate replace to="/home" />} />
                <Route path="/criar-usuario" element={<CadastroUsuario/>}/>
                <Route path="/" element={<PageLayout handleLogout={handleLogout} />}>
                    <Route path="/home" element={isAuthenticated ? <Home token={token} /> : <Navigate replace to="/login" />} />
                    <Route path="/reserva" element={isAuthenticated ? <Reserva token={token} /> : <Navigate replace to="/login" />} />
                    <Route path="/" element={<Navigate replace to={isAuthenticated ? "/home" : "/login"} />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}
