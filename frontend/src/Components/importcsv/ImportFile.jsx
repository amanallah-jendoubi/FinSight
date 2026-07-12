import { useCallback, useRef, useState } from "react";
import { UploadCloud } from "lucide-react";

export default function ImportFile({ onFileSelect, fileName ,setFileName }) {
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef(null);

  const handleFile = useCallback(
    (file) => {
      if (!file) return;
      if (!file.name.toLowerCase().endsWith(".csv")) return;
      setFileName(file.name);
      onFileSelect?.(file);
    },
    [onFileSelect]
  );

  const handleDrop = useCallback(
    (e) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files?.[0];
      handleFile(file);
    },
    [handleFile]
  );

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleInputChange = (e) => {
    const file = e.target.files?.[0];
    handleFile(file);
  };

  return (
    <div className="flex items-center bg-white mt-25 ">
      <div className="w-[70%] mx-auto mb-5">
      <h2 className="text-base font-semibold text-gray-900 mb-4">
        CSV File Import
      </h2>

      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => inputRef.current?.click()}
        className={`flex flex-col items-center justify-center gap-4 rounded-xl border-2 border-dashed px-15 py-24 text-center cursor-pointer transition-colors
          ${isDragging
            ? "border-indigo-500 bg-indigo-50"
            : "border-indigo-200 bg-indigo-50/40 hover:bg-indigo-50"
          }`}
      >
        <div className="flex items-center justify-center w-14 h-14 rounded-full bg-indigo-100">
          <UploadCloud className="w-6 h-6 text-indigo-500" strokeWidth={2} />
        </div>

        <div className="space-y-1">
          <p className="text-sm text-gray-500">
            Drag and drop your CSV file here
          </p>
          <p className="text-sm text-gray-400">ou</p>
        </div>

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            inputRef.current?.click();
          }}
          className="px-5 py-2.5 rounded-lg bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 active:bg-indigo-800 transition-colors"
        >
          Choose a file
        </button>

        <input
          ref={inputRef}
          type="file"
          accept=".csv"
          onChange={handleInputChange}
          className="hidden"
        />
      </div>

      {fileName && (
        <p className="mt-3 text-sm text-gray-600 truncate">
          File selected : <span className="font-medium">{fileName}</span>
        </p>
      )}
      </div>
    </div>
  );
}