import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  getDatabase,
  ref,
  onValue,
  query,
  orderByChild,
  equalTo,
  get,
} from "firebase/database";
import { auth } from "../firebase";
import { signOut, updateProfile } from "firebase/auth";
import {
  getStorage,
  ref as storageRef,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";
import toast, { Toaster } from "react-hot-toast";
import { QRCodeSVG } from "qrcode.react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSignOutAlt,
  faEye,
  faCopy,
  faQrcode,
} from "@fortawesome/free-solid-svg-icons";

const UserProfile = () => {
  const [user, setUser] = useState(null);
  const [uploads, setUploads] = useState([]);
  const [selectedUpload, setSelectedUpload] = useState(null);
  const [loading, setLoading] = useState(true);
  const [profileImage, setProfileImage] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        setProfileImage(currentUser.photoURL);
        fetchUploads(currentUser.uid);
      } else {
        setUser(null);
        setUploads([]);
        navigate("/");
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [navigate]);

  const fetchUploads = (userId) => {
    const db = getDatabase();
    const uploadsRef = ref(db, `uploads/${userId}`);
    onValue(uploadsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const uploadsList = Object.entries(data).map(([key, value]) => ({
          id: key,
          ...value,
        }));
        setUploads(uploadsList.sort((a, b) => b.timestamp - a.timestamp));
      } else {
        setUploads([]);
      }
    });
  };

  const handleCopyUrl = (url) => {
    navigator.clipboard.writeText(url).then(
      () => toast.success("URL copied to clipboard"),
      () => toast.error("Failed to copy URL")
    );
  };

  const handleSelectUpload = (upload) => {
    setSelectedUpload(upload);
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      toast.success("Signed out successfully");
      navigate("/");
    } catch (error) {
      console.error("Sign out error:", error);
      toast.error("Failed to sign out");
    }
  };

  const handleProfileImageChange = (e) => {
    if (e.target.files[0]) {
      const file = e.target.files[0];
      const storage = getStorage();
      const storageReference = storageRef(storage, `profileImages/${user.uid}`);
      uploadBytes(storageReference, file)
        .then(() => {
          getDownloadURL(storageReference)
            .then((url) => {
              updateProfile(user, { photoURL: url })
                .then(() => {
                  setProfileImage(url);
                  toast.success("Profile image updated successfully");
                })
                .catch((error) => {
                  console.error("Error updating profile image:", error);
                  toast.error("Failed to update profile image");
                });
            })
            .catch((error) => {
              console.error("Error getting download URL:", error);
              toast.error("Failed to get download URL");
            });
        })
        .catch((error) => {
          console.error("Error uploading profile image:", error);
          toast.error("Failed to upload profile image");
        });
    }
  };

  if (loading) {
    return <div className="text-center mt-10">Loading...</div>;
  }

  if (!user) {
    return (
      <div className="text-center mt-10">
        Please log in to view your profile.
      </div>
    );
  }

  return (
    <div className="bg-gray-900 text-white min-h-screen">
      <Toaster position="top-right" />
      <nav className="bg-gray-800 p-4">
        <div className="container mx-auto flex justify-between items-center">
          <Link to="/" className="text-white text-2xl font-bold">
            FileShare
          </Link>
          <div className="flex space-x-4 items-center">
            <Link to="/upload" className="text-white hover:text-gray-300">
              Upload
            </Link>
            <button
              onClick={handleSignOut}
              className="text-white hover:text-gray-300"
            >
              <FontAwesomeIcon icon={faSignOutAlt} />
            </button>
          </div>
        </div>
      </nav>

      <div className="container mx-auto mt-10 px-4">
        <div className="flex items-center mb-4">
          <img
            src={profileImage}
            alt="Profile"
            className="w-20 h-20 rounded-full mr-4"
          />
          <div>
            <h2 className="text-2xl font-bold">{user.displayName}</h2>
            <p className="text-gray-400">{user.email}</p>
            <input
              type="file"
              onChange={handleProfileImageChange}
              className="mt-2 text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 file:cursor-pointer"
            />
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          <div className="w-full lg:w-1/2">
            <h3 className="text-xl font-semibold mb-4">Upload History</h3>
            {uploads.length > 0 ? (
              <div className="space-y-4">
                {uploads.map((upload) => (
                  <div
                    key={upload.id}
                    className="bg-gray-800 p-4 rounded-lg hover:bg-gray-700 transition duration-300"
                  >
                    <h4 className="font-semibold mb-2">{upload.name}</h4>
                    <p className="text-sm text-gray-400">
                      Uploaded on: {new Date(upload.timestamp).toLocaleString()}
                    </p>
                    <div className="flex space-x-2 mt-2">
                      <a
                        href={upload.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition duration-300"
                      >
                        <FontAwesomeIcon icon={faEye} className="mr-2" />
                        View
                      </a>
                      <button
                        onClick={() => handleCopyUrl(upload.url)}
                        className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 transition duration-300"
                      >
                        <FontAwesomeIcon icon={faCopy} className="mr-2" />
                        Copy URL
                      </button>
                      <button
                        onClick={() => handleSelectUpload(upload)}
                        className="bg-purple-500 text-white px-3 py-1 rounded hover:bg-purple-600 transition duration-300"
                      >
                        <FontAwesomeIcon icon={faQrcode} className="mr-2" />
                        Show QR
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-400">
                You haven't uploaded any files yet.
              </p>
            )}
          </div>

          <div className="w-full lg:w-1/2">
            <h3 className="text-xl font-semibold mb-4">QR Code</h3>
            {selectedUpload ? (
              <div className="bg-white p-4 rounded-lg">
                <QRCodeSVG
                  value={selectedUpload.url}
                  size={256}
                  level="H"
                  includeMargin={true}
                />
                <p className="mt-2 text-center text-gray-800">
                  {selectedUpload.name}
                </p>
              </div>
            ) : (
              <p className="text-gray-400">
                Select a file to display its QR code.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
