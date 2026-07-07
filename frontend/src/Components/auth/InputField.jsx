const InputField = ({ label, id, type = "text", placeholder, icon, rightIcon, hint, error, value, onChange }) => (
  <div className="flex flex-col gap-1">
    <label htmlFor={id} className="text-xs font-medium text-slate-500 uppercase tracking-widest">
      {label}
    </label>
    <div className="relative">
      {icon && (
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">{icon}</span>
      )}
      <input
        id={id}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className={`w-full bg-slate-50 border rounded-xl text-sm text-slate-800 placeholder-slate-400
          focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-150
          ${error ? "border-red-400 focus:ring-red-400" : "border-slate-200 focus:ring-indigo-500"}
          ${icon ? "pl-10" : "pl-4"} ${rightIcon ? "pr-10" : "pr-4"} py-2.5`}
      />
      {rightIcon && (
        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 cursor-pointer select-none">
          {rightIcon}
        </span>
      )}
    </div>
    {error ? (
      <p className="text-[10px] text-red-500 mt-0.5">{error}</p>
    ) : (
      hint && <p className="text-[10px] text-slate-400 mt-0.5">{hint}</p>
    )}
  </div>
);

export default InputField;
