export default function ProfileCard({
  userInfo,
  onEdit = () => {},
}) {
  function getInitials(fullName) {
    const words = fullName.trim().split(/\s+/).filter(Boolean);
    if (words.length === 0) return "";
    if (words.length === 1) return words[0].slice(0, 2).toUpperCase();

    return (words[0][0] + words[words.length - 1][0]).toUpperCase();
  }
  const initials  = getInitials (userInfo.name);
  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
      <h2 className="mb-5 text-[15px] font-semibold text-gray-900">
        User profile
      </h2>

      <div className="flex items-center gap-2.5 min-[375px]:gap-4">
          <div className="flex h-12 w-12 min-[375px]:h-16 min-[375px]:w-16 items-center justify-center rounded-full bg-indigo-100 text-lg font-semibold text-indigo-600">
            {initials}
          </div>

        <div>
          <p className="text-[15px] font-semibold text-gray-900">{userInfo.name}</p>
          <p className="text-sm text-gray-500">{userInfo.email}</p>
        </div>
      </div>
    </div>
  );
}