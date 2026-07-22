import { Lock } from "lucide-react";
import { useState } from "react";
import ChangePasswordModal from "./ChangePasswordModal";


export default function SecurityCard({
  lastModified,
  handlePwdChange 
}) {
    const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
      <h2 className="mb-5 text-[15px] font-semibold text-gray-900">Security</h2>

      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-indigo-100 text-indigo-600">
            <Lock size={16} />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-900">Password</p>
            <p className="text-sm text-gray-500 ">
              Last modified :<p className="min-[430px]:inline "> {lastModified}</p>
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={(payload)=>{
            setIsModalOpen(true);
          }}
          className="flex items-center gap-1 rounded-lg border border-violet-200 px-4 py-2 text-sm font-medium text-indigo-600 hover:bg-violet-50"
        >
          Change
          <span aria-hidden="true">›</span>
        </button>
      </div>
      {
        isModalOpen && (
            <ChangePasswordModal onSubmit = {(payload)=>{
                handlePwdChange(payload);
                setIsModalOpen(false);
            }}
            onClose={()=> setIsModalOpen(false)}
            />
        )
      }
    </div>
  );
}