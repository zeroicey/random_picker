import React, { useState, useEffect } from "react";
import * as XLSX from "xlsx";

const App: React.FC = () => {
  const [names, setNames] = useState<string[]>([]);
  const [selectedName, setSelectedName] = useState<string>("");
  const [resultName, setResultName] = useState<string>("");
  const [isPicking, setIsPicking] = useState<boolean>(false);
  const [intervalId, setIntervalId] = useState<number | null>(null);
  const [showAbout, setShowAbout] = useState<boolean>(false); // 控制弹窗显示

  const startRandomPick = () => {
    setIsPicking(true);
    setSelectedName("");

    const id = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * names.length);
      setSelectedName(names[randomIndex]);
    }, 100);

    setIntervalId(id);
  };

  const stopRandomPick = () => {
    setIsPicking(false);
    if (intervalId) clearInterval(intervalId);

    const finalIndex = Math.floor(Math.random() * names.length);
    setResultName(names[finalIndex]);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: "array" });
        const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData: any[][] = XLSX.utils.sheet_to_json(firstSheet, {
          header: 1,
        });

        const namesList = jsonData
          .map((row) => row[0])
          .filter((name) => typeof name === "string" && name.trim() !== "");

        setNames(namesList);
        console.log("Names extracted:", namesList);
      };
      reader.readAsArrayBuffer(file);
    }
  };

  const toggleAbout = () => {
    setShowAbout((prev) => !prev); // 切换弹窗显示状态
  };

  useEffect(() => {
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [intervalId]);

  return (
    <div className="w-screen h-screen p-5 flex flex-col gap-5 bg-gradient-to-r from-blue-300 to-purple-300">
      <div className="w-full border-2 border-gray-600 bg-gradient-to-b from-white to-gray-200 flex rounded-lg p-4 shadow-lg items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-800">Random Name Picker</h1>
        <div className="flex gap-4">
          <button
            onClick={toggleAbout}
            className="bg-gray-500 text-white p-2 rounded-lg hover:bg-gray-600"
          >
            About
          </button>
          <input
            type="file"
            accept=".xlsx, .xls"
            onChange={handleFileChange}
            className="hidden"
            id="file-input"
          />
          <label
            htmlFor="file-input"
            className="bg-gray-500 text-white p-2 rounded-lg hover:bg-gray-600 cursor-pointer"
          >
            Import Data
            <span className="sr-only">Upload Excel File</span>
          </label>
        </div>
      </div>

      <div className="w-full border-2 border-gray-600 bg-gradient-to-b from-white to-gray-200 flex flex-col rounded-lg flex-grow justify-center items-center shadow-lg">
        <span
          className={`text-[250px] font-bold text-gray-800 transition-opacity duration-300`}
        >
          {isPicking ? selectedName : resultName}
        </span>
        <button
          onClick={isPicking ? stopRandomPick : startRandomPick}
          className="bg-blue-600 text-white p-4 rounded-lg mt-4 hover:bg-blue-700 transition duration-300"
        >
          {isPicking ? "Stop Picking" : "Start Picking"}
        </button>
      </div>

      {/* About 弹窗 */}
      {showAbout && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-5 rounded-lg shadow-lg">
            <h2 className="text-xl font-bold mb-2">About This Project</h2>
            <p className="mb-2">
              This is a simple random name picker application.
            </p>
            <p className="mb-2">Author: zeroicey (happpy)</p>
            <p className="mb-2">
              GitHub:{" "}
              <a
                href="https://github.com/random_picker"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600"
              >
                zeroicey/random_picker
              </a>
            </p>
            <button
              onClick={toggleAbout}
              className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
