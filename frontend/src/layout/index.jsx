import { Outlet } from "react-router-dom"
import { Navbar } from "../components/Navbar"

export function PageLayout({ handleLogout }) {
    return (
        <>
            <Navbar handleLogout={handleLogout}/>
            <Outlet/>
        </>

    )
}