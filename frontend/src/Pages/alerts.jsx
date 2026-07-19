import { useEffect, useState } from "react";
import AlertList from "../Components/alerts/AlertList";
import { getAllAlerts, updateAlert } from "../api/endpoints/alerts";
import Loading from '../Components/Loading';
import { useOutletContext } from "react-router-dom";



export default function Alerts() {
  const [isLoading, setIsLoading] = useState (true);
  const [alerts, setAlerts] = useState ([]);
  const { setUnreadAlertsCount } = useOutletContext(); 

  useEffect (()=>{
    async function fetchAlerts (){
      try{
        const alertsRes = await getAllAlerts ();
        setAlerts(alertsRes.data || []);
      }catch(err){
        console.log (err.message);
      }
      finally{
        setIsLoading(false);
      }
    }
    fetchAlerts();
  }, []);

  async function handleClick(id) {
    try {
      const updatedAlert = (await updateAlert(id)).data;
      setAlerts((prev) => prev.map((a) => (a.id === id ? updatedAlert : a)));
      setUnreadAlertsCount((prev) => prev-1 );
    } catch (err) {
      console.log(err.message);
    }
  }


  if (isLoading) {
    return (
      <Loading message = 'Loading alerts...'/>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6">
      <AlertList
        alerts = {alerts} handleClick = {handleClick}
      />
    </div>
  );
}