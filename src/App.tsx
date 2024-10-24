import React, { useState, useEffect } from "react";
import * as XLSX from "xlsx";

interface FileData {
  name: string;
  checked: boolean;
  names: string[];
}

const App: React.FC = () => {
  const [fileNames, setFileNames] = useState<FileData[]>([]);
  const [selectedName, setSelectedName] = useState<string>("");
  const [resultName, setResultName] = useState<string>("");
  const [isPicking, setIsPicking] = useState<boolean>(false);
  const [intervalId, setIntervalId] = useState<number | null>(null);
  const [showAbout, setShowAbout] = useState<boolean>(false);
  const [showAlert, setShowAlert] = useState<boolean>(false);
  const [showFileSelector, setShowFileSelector] = useState<boolean>(false);

  const startRandomPick = () => {
    const selectedFiles = fileNames.filter((file) => file.checked);
    if (selectedFiles.length === 0) {
      setShowAlert(true);
      return;
    }

    setIsPicking(true);
    setSelectedName("");

    const id = setInterval(() => {
      const randomFile =
        selectedFiles[Math.floor(Math.random() * selectedFiles.length)];
      const randomIndex = Math.floor(Math.random() * randomFile.names.length);
      setSelectedName(randomFile.names[randomIndex]);
    }, 100);

    setIntervalId(id);
  };

  const stopRandomPick = () => {
    setIsPicking(false);
    if (intervalId) clearInterval(intervalId);

    const selectedFiles = fileNames.filter((file) => file.checked);
    const finalFile =
      selectedFiles[Math.floor(Math.random() * selectedFiles.length)];
    const finalIndex = Math.floor(Math.random() * finalFile.names.length);
    setResultName(finalFile.names[finalIndex]);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(event.target.files || []);

    selectedFiles.forEach((file) => {
      const existingFileIndex = fileNames.findIndex(
        (item) => item.name === file.name
      );
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

        if (existingFileIndex !== -1) {
          // 如果文件已存在，覆盖原有文件
          setFileNames((prev) =>
            prev.map((item, index) =>
              index === existingFileIndex ? { ...item, names: namesList } : item
            )
          );
        } else {
          // 添加新文件
          setFileNames((prev) => [
            ...prev,
            { name: file.name, checked: false, names: namesList },
          ]);
        }
      };
      reader.readAsArrayBuffer(file);
    });
  };

  const toggleFileCheckbox = (index: number) => {
    setFileNames((prev) =>
      prev.map((file, i) =>
        i === index ? { ...file, checked: !file.checked } : file
      )
    );
  };

  const deleteFile = (index: number) => {
    setFileNames((prev) => prev.filter((_, i) => i !== index));
  };

  const toggleAbout = () => {
    setShowAbout((prev) => !prev);
  };

  const handleOutsideClick = (event: React.MouseEvent) => {
    const target = event.target as HTMLElement;
    if (target.id === "about-overlay") {
      setShowAbout(false);
    } else if (target.id === "alert-overlay") {
      setShowAlert(false);
    } else if (target.id === "file-selector-overlay") {
      setShowFileSelector(false);
    }
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
          <button
            onClick={() => setShowFileSelector(true)}
            className="bg-gray-500 text-white p-2 rounded-lg hover:bg-gray-600"
          >
            Import Data
          </button>
        </div>
      </div>

      {/* 文件选择器 */}
      {showFileSelector && (
        <div
          id="file-selector-overlay"
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
          onClick={handleOutsideClick}
        >
          <div className="bg-white p-5 rounded-lg shadow-lg">
            <h2 className="text-xl font-bold mb-2">Select Excel Files.</h2>
            <input
              type="file"
              accept=".xlsx, .xls"
              onChange={handleFileChange}
              multiple
            />
            <div className="mt-4">
              {fileNames.map((file, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={file.checked}
                      onChange={() => toggleFileCheckbox(index)}
                    />
                    <span className="ml-2">{file.name}</span>
                  </div>
                  <button
                    onClick={() => deleteFile(index)}
                    className="text-red-500 ml-2"
                  >
                    删除
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

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

      {showAlert && (
        <div
          id="alert-overlay"
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
          onClick={handleOutsideClick}
        >
          <div className="bg-white p-5 rounded-lg shadow-lg">
            <h2 className="text-xl font-bold mb-2">No Names Found</h2>
            <p className="mb-2">Please import names from an Excel file.</p>
          </div>
        </div>
      )}

      {showAbout && (
        <div
          id="about-overlay"
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
          onClick={handleOutsideClick}
        >
          <div className="bg-white p-5 rounded-lg shadow-lg max-w-md">
            <h2 className="text-xl font-bold mb-2">About This Project 🎉</h2>
            <p className="mb-2">
              The <strong>Random Name Picker</strong> is a web application
              designed to assist educators in randomly selecting names from a
              list.
              <br />
              <hr />
              This project was created to help my English teacher randomly call
              on students during class, making activities more engaging and
              efficient. 📚✨
            </p>
            <h3 className="font-semibold mt-4">Author: 👤</h3>
            <p className="mb-2">zeroicey (happpy)</p>
            <h3 className="font-semibold">GitHub Repository: 🌐</h3>
            <p>
              Explore the source code and contribute on{" "}
              <a
                href="https://github.com/zeroicey/random_picker"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600"
              >
                GitHub
              </a>
              . 🛠️
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
