import { useState, useMemo } from "react";
import { Lock, X, Eye, EyeOff } from "lucide-react";
import PasswordField from "../auth/PasswordField";

export default function ChangePasswordModal({
  onClose ,
  onSubmit
}) {
  const [form , setForm] = useState ({});
  const [errors, setErrors] = useState({});


  const update = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    // Clear the error for this field as soon as the user fixes it
    if (errors[key]) {
      setErrors((prev) => ({ ...prev, [key]: undefined }));
    }
  };


  const validate = () => {
    const errObj = {};
    if (!form.newPassword) errObj.newPassword = "Required field";
    if (!form.confirmPassword) errObj.confirmPassword = "Required field";
    if (form.newPassword && form.confirmPassword){
        if (form?.confirmPassword != form?.newPassword){
            errObj.confirmPassword = "Please ensure both passwords match";
            errObj.newPassword = "Please ensure both passwords match";
        } 
        else if (form?.confirmPassword.length < 6){
            errObj.newPassword = "Password must be at least 6 characters";
            errObj.confirmPassword = "Password must be at least 6 characters";
        } 
    }
    setErrors(errObj);
    return Object.keys(errObj).length === 0;
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    await onSubmit(form.newPassword);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/40 p-4"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="change-password-title"
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl"
      >
        <div className="mb-5 flex items-start justify-between">
          <div className="flex gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-violet-100 text-indigo-700">
              <Lock size={18} />
            </div>
            <div>
              <h2 id="change-password-title" className="text-base font-semibold text-gray-900">
                Change password
              </h2>
              <p className="mt-0.5 text-sm text-gray-500">
                Make sure to use a strong password to protect your account.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="text-gray-400 hover:text-gray-600"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">

          <div>
            <PasswordField
              label="New password"
              error={errors.newPassword}
              value={form.newPassword}
              onChange={(e) => update("newPassword", e.target.value)}
            />
          </div>

          <PasswordField
            label="Confirm new password"
            error={errors.confirmPassword}
            value={form.confirmPassword}
            onChange={(e) => update("confirmPassword", e.target.value)}
          />

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-lg bg-indigo-600 px-6 py-2.5 text-sm font-medium text-white hover:bg-indigo-700"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}