import NavBar from "./Components/NavBar";
import { Outlet } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import toast from "react-hot-toast";
import { io } from 'socket.io-client';
import { useEffect, useRef, useState } from "react";
import { accessToken, isTokenExpired } from './api/axiosInstance';
import { getUnreadAlertsCount } from "./api/endpoints/alerts";




export default function Layout() {
    const socketRef = useRef(null);
    const [unreadAlertsCount, setUnreadAlertsCount] = useState (0);

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
          setUnreadAlertsCount((prev) => prev+1);
          toast(data.title, { icon: '⚠️' }); // to do (styling)
        });
        socketRef.current.on('account/alerts', (data) => {
          setUnreadAlertsCount((prev) => prev+1);
          toast(data.title, { icon: '⚠️' }); // to do (styling)
        });

        socketRef.current.on('connect_error', (err) => {
          console.error('Socket connection failed:', err.message);
        });
      }
      async function fetchUnreadAlertsCount (){
        try{
          const countRes = await getUnreadAlertsCount ();
          setUnreadAlertsCount(countRes.data || 0);
        }catch(err){
          console.log (err.message);
        }
      }
      waitForFreshToken();
      fetchUnreadAlertsCount();
      return () => {
        cancelled = true;
        socketRef.current?.disconnect();
      };
    }, []);

  return (
    <div className="lg:flex h-screen">
      <NavBar  unreadAlertsCount={ unreadAlertsCount} />
      <main className="flex-1 overflow-y-auto">
        <Outlet context={{ setUnreadAlertsCount }} />
      </main>
      <Toaster position="top-center" toastOptions={{ duration: 2000 }} />
    </div>
  )
}