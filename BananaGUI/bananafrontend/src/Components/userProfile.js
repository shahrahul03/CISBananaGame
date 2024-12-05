import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaTimes } from "react-icons/fa";

const UserProfile = () => {
  const [profile, setProfile] = useState({
    user: {},
    bio: "",
    profileImage: "",
  });
  const [bio, setBio] = useState("");
  const [profileImage, setProfileImage] = useState(null);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [leaderboard, setLeaderboard] = useState([]); // Store leaderboard data
  const [showLeaderboard, setShowLeaderboard] = useState(true); // Toggle leaderboard visibility

  const token = localStorage.getItem("authToken");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/profile", {
          headers: {
            Authorization: ` ${token}`,
          },
        });

        setProfile(response.data.profile);
        setBio(response.data.profile.bio || "");
      } catch (err) {
        setError(err.response?.data?.msg || "Error fetching profile");
      }
    };

    const fetchLeaderboard = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/game/leaderboard"
        );
        setLeaderboard(response.data);
      } catch (err) {
        console.error("Error fetching leaderboard:", err);
      }
    };

    fetchProfile();
    fetchLeaderboard();
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("bio", bio);
    if (profileImage) formData.append("profileImage", profileImage);

    try {
      const response = await axios.put(
        "http://localhost:5000/api/profile/update",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: ` ${token}`,
          },
        }
      );

      setProfile((prevProfile) => ({
        ...prevProfile,
        bio: response.data.profile.bio,
        profileImage: response.data.profile.profileImage,
      }));
      setSuccess("Profile updated successfully!");
      setError(null);
      setProfileImage(null);
      setIsEditing(false);
    } catch (err) {
      setError(err.response?.data?.msg || "Error updating profile");
      setSuccess("");
    }
  };

  const loggedInUser = leaderboard.find(
    (record) => record.username === profile.user.name
  );
  const otherUsers = leaderboard.filter(
    (record) => record.username !== profile.user.name
  );

  if (!profile.user.name) return <p className="text-gray-600">Loading...</p>;

  return (
    <div className="max-w-6xl mx-auto p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Profile Section */}
      <div className="col-span-1 bg-gray-200 text-gray-700  p-6 rounded-lg flex flex-col items-center">
        {profile.profileImage && (
          <img
            src={profile.profileImage}
            alt="Profile"
            className="w-32 h-32 object-cover rounded-full mb-4"
          />
        )}
        <h1 className="text-2xl  font-semibold">{profile.user.name}</h1>
        <p className="text-lg mt-2">{profile.bio}</p>
        <button
          onClick={() => setIsEditing(true)}
          className="mt-4 px-4 py-2  text-green-700 font-semibold rounded-lg hover:bg-white  focus:outline-none focus:ring-2 focus:ring-green-500"
        >
          Update Profile
        </button>
      </div>

      {/* Leaderboard */}
      {showLeaderboard && (
        <div className="col-span-2 bg-white shadow-md rounded-lg p-8 relative">
          {/* Close Button */}
          <button
            onClick={() => {
              setShowLeaderboard(false);
              window.location.href = "/game";
            }}
            className="absolute top-4 right-4 text-gray-600 hover:text-gray-800 focus:outline-none"
          >
            <FaTimes size={20} />
          </button>
          <h2 className="text-xl bg-gray-200 rounded-2xl p-2 font-semibold text-green-700 text-center mb-4">
            Leaderboard
          </h2>
          <ul className="space-y-2">
            {loggedInUser && (
              <li className="flex justify-between bg-yellow-200 p-3 rounded-lg shadow-sm">
                <span>🏅 {loggedInUser.username} (You)</span>
                <span className="font-semibold">{loggedInUser.score} pts</span>
              </li>
            )}
            {otherUsers.map((GameRecord, index) => (
              <li
                key={index}
                className="flex justify-between bg-gray-100 p-3 rounded-lg shadow-sm"
              >
                <span>
                  {index + 1 + (loggedInUser ? 1 : 0)}. {GameRecord.username}
                </span>
                <span className="font-semibold">{GameRecord.score} pts</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {isEditing && (
        <div className="col-span-2 bg-white shadow-md rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Edit Profile</h2>
          {success && <p className="text-green-600 mb-4">{success}</p>}
          {error && <p className="text-red-600 mb-4">{error}</p>}
          <form onSubmit={handleSubmit} className="space-y-4">
            <label className="block">
              <span className="text-gray-700">Bio:</span>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-lg p-2"
                rows="4"
              />
            </label>
            <label className="block">
              <span className="text-gray-700">Profile Image:</span>
              <input
                type="file"
                onChange={(e) => setProfileImage(e.target.files[0])}
                className="mt-1 block w-full border border-gray-300 rounded-lg p-2"
              />
            </label>
            <button
              type="submit"
              className="px-4 py-2 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              Update Profile
            </button>
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="ml-2 px-4 py-2 bg-gray-500 text-white font-semibold rounded-lg hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              Cancel
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default UserProfile;
