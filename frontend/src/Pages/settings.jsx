import ProfileCard from "../Components/settings/ProfileCard";
import PreferencesCard from "../Components/settings/PreferencesCard";
import SecurityCard from "../Components/settings/SecurityCard";
import BankAccountsCard from "../Components/settings/BankAccountsCard";
import DeleteAccountCard from "../Components/settings/DeleteAccountCard";
import { useState, useEffect } from "react";
import dayjs from 'dayjs';
import Loading from '../Components/Loading';
import { getAllAccountsByUserId, createAccount } from "../api/endpoints/accounts";
import { getUserInfo, updateUserInfo } from "../api/endpoints/user";
import toast from "react-hot-toast";


export default function Settings() {
  const [userInfo, setUserInfo] = useState({});
  const [accountsInfo, setAccountsInfo] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    async function loadSettings() {
      try {
        const [userRes, accountsRes] = await Promise.all([
          getUserInfo(),
          getAllAccountsByUserId()
        ]);
        const {name, createdat, email} = userRes.data[0];
        setAccountsInfo(accountsRes.data.accounts || []);
        setUserInfo ({name, createdat, email});
      } catch (err) {
        console.log(err.message);
      } finally {
        setLoading(false);
      }
    }
    loadSettings();
  }, []);

  async function handlePwdChange (newPwd) {
    try{
      const res = await updateUserInfo(newPwd);
      setUserInfo((prev) => ({ ...prev, createdat: res.data.createdat}));
      toast.success('Password updated successfully!')
    } catch (err) {
      console.log(err.message);
      toast.error ('Unable to update password')
    }
  }



  async function handleAddAccount (payload) {
    try{
      const res = await createAccount(payload);
      setAccountsInfo((prev) => [...prev, res.data]);
      toast.success('Account created successfully!')
    } catch (err) {
      console.log(err.message);
      toast.error ('Account creation failed');
    }
  }

  if (loading) {
    return (
      <Loading message= 'Loading...'/>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6 sm:p-10">
      <div className="mx-auto max-w-5xl space-y-6">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <ProfileCard userInfo = {userInfo} />
          <PreferencesCard />
          <SecurityCard lastModified = {dayjs(userInfo.createdat).format("YYYY-MM-DD")} handlePwdChange = {handlePwdChange} />
          <BankAccountsCard accounts = {accountsInfo} handleAddAccount= {handleAddAccount} />
        </div>

        <DeleteAccountCard />
      </div>
    </div>
  );
}