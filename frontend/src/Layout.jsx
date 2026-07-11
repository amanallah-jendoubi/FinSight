import NavBar from "./Components/NavBar";
import { Outlet } from "react-router-dom";
import { Toaster } from "react-hot-toast";


export default function Layout() {
  return (
    <div className="lg:flex lg:h-screen">
      <NavBar />
      <main className="flex-1 overflow-y-auto">
        <Outlet />
      </main>
      <Toaster position="top-center" toastOptions={{ duration: 2000 }} />
    </div>
  )
}
