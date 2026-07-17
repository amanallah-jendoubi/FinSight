import NavBar from "./Components/NavBar";
import { Outlet } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import toast from "react-hot-toast";
import { io } from 'socket.io-client';
import { useEffect, useRef, useState } from "react";
import { accessToken, isTokenExpired } from './api/axiosInstance';



export default function Layout() {
    const [alerts, setAlerts] = useState([]);
    const socketRef = useRef(null);
    useEffect(() => {
      let cancelled = false;
      async function waitForFreshToken() {
        while (!cancelled && isTokenExpired(accessToken)) {
          await new Promise((resolve) => setTimeout(resolve, 200)); // check for fresh acess token every 200ms
        }
        if (cancelled) return; // Layout unmounted while waiting => no socket creation

        socketRef.current = io("http://localhost:3500", {
          auth: { token: accessToken }
        });

        socketRef.current.on('budget/alerts', (data) => {
          setAlerts((prev) => [data, ...prev]); // newest first
          toast(data.message, { icon: '⚠️' }); // to do (styling)
        });

        socketRef.current.on('connect_error', (err) => {
          console.error('Socket connection failed:', err.message);
        });
      }
      waitForFreshToken();
      return () => {
        cancelled = true;
        socketRef.current?.disconnect();
      };
    }, []);
  return (
    <div className="lg:flex h-screen">
      <NavBar />
      <main className="flex-1 overflow-y-auto">
        <Outlet context={{ alerts }} />
      </main>
      <Toaster position="top-center" toastOptions={{ duration: 2000 }} />
    </div>
  )
}