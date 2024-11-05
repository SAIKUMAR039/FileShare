import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import {
  getDatabase,
  ref as dbRef,
  push,
  onValue,
  remove,
} from "firebase/database";
import QRCode from "qrcode";
import { app, auth } from "../firebase";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import toast, { Toaster } from "react-hot-toast";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSignOutAlt,
  faDownload,
  faShare,
  faQrcode,
  faTrash,
  faEye,
} from "@fortawesome/free-solid-svg-icons";
import { AnimatePresence, motion } from "framer-motion";
import Footer from "./Footer";

const FileUpload = () => {
  const [file, setFile] = useState(null);
  const [qrCode, setQrCode] = useState("");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [fileUrl, setFileUrl] = useState("");
  const [recentUploads, setRecentUploads] = useState([]);
  const [visibleQr, setVisibleQr] = useState({});
  const user = auth.currentUser;
  const navigate = useNavigate();

  const allowedDomains = ["yourdomain.com", "anotherdomain.com"];

  useEffect(() => {
    if (user) {
      fetchRecentUploads();
    } else {
      navigate("/");
    }
  }, [user, navigate]);

  const fetchRecentUploads = () => {
    const database = getDatabase(app);
    const uploadsRef = dbRef(database, `uploads/${user.uid}`);
    onValue(uploadsRef, (snapshot) => {
      const uploads = snapshot.val();
      if (uploads) {
        const uploadsArray = Object.entries(uploads).map(([id, upload]) => ({
          id,
          ...upload,
        }));
        setRecentUploads(
          uploadsArray.sort((a, b) => b.timestamp - a.timestamp)
        );
      }
    });
  };

  const handleChange = (e) => {
    if (e.target.files[0]) {
      setFile(e.target.files[0]);
      toast.success(`File "${e.target.files[0].name}" selected`);
    }
  };

  const handleUpload = () => {
    if (!file) {
      toast.error("Please select a file first");
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    const uploadToast = toast.loading("Upload in progress...");

    const storage = getStorage(app);
    const storageRef = ref(
      storage,
      `files/${user.uid}/${Date.now()}_${file.name}`
    );
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setUploadProgress(progress);
        toast.loading(`Uploading: ${Math.round(progress)}%`, {
          id: uploadToast,
        });
      },
      (error) => {
        console.error(error);
        setIsUploading(false);
        toast.error("Upload failed", { id: uploadToast });
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((url) => {
          const database = getDatabase(app);
          const uploadsRef = dbRef(database, `uploads/${user.uid}`);
          generateQrCode(url).then((qrCodeUrl) => {
            push(uploadsRef, {
              name: file.name,
              url,
              qrCode: qrCodeUrl,
              timestamp: Date.now(),
              size: file.size,
              type: file.type,
            }).then(() => {
              setFileUrl(url);
              setQrCode(qrCodeUrl);
              setIsUploading(false);
              setFile(null);
              toast.success("Upload completed successfully", {
                id: uploadToast,
              });
              fetchRecentUploads();
            });
          });
        });
      }
    );
  };

  const generateQrCode = async (url) => {
    try {
      const qrCodeUrl = await QRCode.toDataURL(url);
      return qrCodeUrl;
    } catch (err) {
      console.error(err);
      toast.error("Failed to generate QR code");
      return null;
    }
  };

  const handleViewFile = (url, name) => {
    try {
      const blob = new Blob([url], { type: "application/octet-stream" });
      const fileUrl = URL.createObjectURL(blob);
      window.open(fileUrl, "_blank");
    } catch (error) {
      console.error("Error viewing file:", error);
      toast.error("Unable to view file");
    }
  };

  const handleDownload = (url) => {
    try {
      window.open(url, "_blank");
    } catch (error) {
      console.error("Download error:", error);
      toast.error("Failed to download file");
    }
  };

  const handleShare = async (url, fileName) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: fileName,
          text: `Check out this file: ${fileName}`,
          url: url,
        });
        toast.success("Shared successfully");
      } catch (error) {
        if (error.name !== "AbortError") {
          toast.error("Failed to share");
        }
      }
    } else {
      try {
        await navigator.clipboard.writeText(url);
        toast.success("Link copied to clipboard");
      } catch (error) {
        toast.error("Failed to copy link");
      }
    }
  };

  const handleSignOut = async () => {
    try {
      await auth.signOut();
      toast.success("Signed out successfully");
      navigate("/");
    } catch (error) {
      console.error("Sign out error:", error);
      toast.error("Failed to sign out");
    }
  };

  const toggleQrVisibility = (id) => {
    setVisibleQr((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleDelete = async (fileId, fileUrl) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this file?"
    );
    if (!confirmDelete) return;

    try {
      const storage = getStorage(app);
      const fileRef = ref(storage, fileUrl);
      await deleteObject(fileRef);

      const database = getDatabase(app);
      const fileDbRef = dbRef(database, `uploads/${user.uid}/${fileId}`);
      await remove(fileDbRef);

      toast.success("File deleted successfully");
      setRecentUploads((prevUploads) =>
        prevUploads.filter((upload) => upload.id !== fileId)
      );
    } catch (error) {
      console.error("Error deleting file:", error);
      toast.error("Failed to delete file");
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
  };

  return (
    <>
      <div className="bg-gray-900 text-white min-h-screen">
        <Toaster position="top-right" />
        {/* Navbar */}
        <nav className="bg-gray-800 p-4">
          <div className="container mx-auto flex justify-between items-center">
            <a href="/" className="text-white text-2xl font-bold">
              FileShare
            </a>
            <div className="flex space-x-4 items-center">
              <Link to="/profile" className="text-white hidden sm:block">
                Profile
              </Link>
              <Link to="/upload" className="text-white hidden sm:block">
                Upload
              </Link>
              {user && (
                <>
                  <Link to="/profile">
                    <img
                      src={user.photoURL}
                      alt="Profile"
                      className="w-8 h-8 rounded-full"
                    />
                  </Link>
                  <button
                    onClick={handleSignOut}
                    className="text-white ml-2 sm:ml-4"
                  >
                    <FontAwesomeIcon icon={faSignOutAlt} size="lg" />
                  </button>
                </>
              )}
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <div className="max-w-4xl mx-auto bg-gray-800 p-6 rounded-lg shadow-md mt-10">
          <h2 className="text-2xl font-bold mb-4">Upload a File</h2>
          <div className="flex flex-col sm:flex-row gap-4 items-center">
            <input
              type="file"
              onChange={handleChange}
              className="flex-1 w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 file:cursor-pointer"
            />
            {!isUploading ? (
              <button
                onClick={handleUpload}
                className="w-full sm:w-auto bg-blue-500 text-white py-2 px-8 rounded-lg hover:bg-blue-600 transition duration-300"
              >
                Upload
              </button>
            ) : (
              <div className="w-20 h-20">
                <CircularProgressbar
                  value={uploadProgress}
                  text={`${Math.round(uploadProgress)}%`}
                  styles={{
                    path: {
                      stroke: `rgba(59, 130, 246, ${uploadProgress / 100})`,
                    },
                    text: {
                      fill: "#fff",
                      fontSize: "16px",
                    },
                  }}
                />
              </div>
            )}
          </div>

          <div className="mt-8">
            <h3 className="text-xl font-bold mb-4">Recent Uploads</h3>
            <div className="space-y-4">
              <AnimatePresence>
                {recentUploads.map((upload) => (
                  <motion.div
                    key={upload.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="bg-gray-700 p-4 rounded-lg"
                  >
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                      <div className="flex-1">
                        <h4 className="font-medium truncate">{upload.name}</h4>
                        <p className="text-sm text-gray-400">
                          {formatFileSize(upload.size)} •{" "}
                          {new Date(upload.timestamp).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <button
                          onClick={() =>
                            handleDownload(upload.url, upload.name)
                          }
                          className="inline-flex items-center px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
                        >
                          <FontAwesomeIcon icon={faDownload} className="mr-2" />
                          Download
                        </button>
                        <button
                          onClick={() => handleShare(upload.url, upload.name)}
                          className="inline-flex items-center px-3 py-1 bg-purple-500 text-white rounded hover:bg-purple-600 transition-colors"
                        >
                          <FontAwesomeIcon icon={faShare} className="mr-2" />
                          Share
                        </button>
                        <button
                          onClick={() => toggleQrVisibility(upload.id)}
                          className="inline-flex items-center px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition-colors"
                        >
                          <FontAwesomeIcon icon={faQrcode} className="mr-2" />
                          QR
                        </button>
                        <button
                          onClick={() => handleDelete(upload.id, upload.url)}
                          className="inline-flex items-center px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                        >
                          <FontAwesomeIcon icon={faTrash} className="mr-2" />
                          Delete
                        </button>
                      </div>
                    </div>
                    <AnimatePresence>
                      {visibleQr[upload.id] && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="mt-4"
                        >
                          <img
                            src={upload.qrCode}
                            alt="QR Code"
                            className="w-32 h-32"
                          />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default FileUpload;
