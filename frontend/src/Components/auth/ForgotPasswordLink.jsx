import { Link } from "react-router-dom";

const ForgotPasswordLink = () => (
  <div className="flex justify-end">
    <Link
      to="/forgot-password"
      className="text-[11px] text-indigo-500 hover:text-indigo-700 font-medium hover:underline transition-colors"
    >
      Forgot password?
    </Link>
  </div>
);

export default ForgotPasswordLink;
