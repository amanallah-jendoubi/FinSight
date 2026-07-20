import { Globe } from "lucide-react";

export default function PreferencesCard({
  language = "English",
  languages = ["French", "English"],
  onLanguageChange = () => {},
}) {
  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
      <h2 className="mb-5 text-[15px] font-semibold text-gray-900">
        General preferences
      </h2>

      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-violet-100 text-violet-600">
            <Globe size={16} />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-900">
              Interface language
            </p>
            <p className="text-sm text-gray-500">
              Choose the interface language
            </p>
          </div>
        </div>

        <select
          value={language}
          onChange={(e) => onLanguageChange(e.target.value)}
          className="rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-violet-200"
        >
          {languages.map((lang) => (
            <option key={lang} value={lang}>
              {lang}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}