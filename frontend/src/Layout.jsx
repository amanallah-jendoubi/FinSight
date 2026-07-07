import NavBar from "./Components/NavBar";
import { Outlet } from "react-router-dom";

export default function Layout() {
  return (
    <div className="md:flex md:h-screen">
      <NavBar />
      <main className="flex-1 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  )
}
