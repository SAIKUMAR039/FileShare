import { getDatabase, ref, onValue } from "firebase/database";
import { useEffect, useState } from "react";
import QRCode from "qrcode";
import { app } from "../firebase"; // Ensure you are importing the initialized app

const FileList = () => {
  const [files, setFiles] = useState([]);
  const [visibleQr, setVisibleQr] = useState({});

  useEffect(() => {
    const database = getDatabase(app);
    const fileRef = ref(database, "files");
    onValue(fileRef, (snapshot) => {
      const files = snapshot.val();
      const fileList = [];
      for (let id in files) {
        fileList.push({ id, ...files[id] });
      }
      setFiles(fileList);
    });
  }, []);

  const generateQrCode = async (url) => {
    try {
      const qrCode = await QRCode.toDataURL(url);
      return qrCode;
    } catch (err) {
      console.error(err);
    }
  };

  const toggleQrVisibility = (id) => {
    setVisibleQr((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <div className="max-w-4xl mx-auto mt-8">
      <h2 className="text-2xl font-bold mb-4">File List</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {files.map((file) => (
          <div key={file.id} className="bg-white p-4 rounded-lg shadow-md">
            <a
              href={file.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:underline"
            >
              {file.name}
            </a>
            <button
              onClick={() => toggleQrVisibility(file.id)}
              className="mt-2 text-white bg-blue-500 hover:bg-blue-700 px-4 py-2 rounded"
            >
              {visibleQr[file.id] ? "Hide QR" : "Show QR"}
            </button>
            {visibleQr[file.id] && (
              <div className="mt-2">
                <img
                  src={generateQrCode(file.url)}
                  alt="QR Code"
                  className="mt-2 mx-auto"
                />
                <p className="mt-2">{file.details}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default FileList;
