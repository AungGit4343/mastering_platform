import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api";
import Cropper from "react-easy-crop";
import getCroppedImg from "../utils/cropImage";

function Dashboard() {
  const [user, setUser] = useState(null);

  const [showEditModal, setShowEditModal] = useState(false);

  // Profile photo crop states
  const [photo, setPhoto] = useState(null);
  const [imageSrc, setImageSrc] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [showCropModal, setShowCropModal] = useState(false);

  // Email and password states for edit profile form
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");

  // Editable profile detail fields
  const [about, setAbout] = useState("");
  const [education, setEducation] = useState("");
  const [experience, setExperience] = useState("");

  useEffect(() => {
    const isAdmin = localStorage.getItem("is_admin") === "true";

    if (isAdmin) {
      window.location.href = "/admin";
      return;
    }

    api.get("/me")
      .then((res) => {
        setUser(res.data);
        setEmail(res.data.email || "");
        setAbout(res.data.about || "");
        setEducation(res.data.education || "");
        setExperience(res.data.experience || "");
      })
      .catch((err) => {
        console.error(err);
        alert("Failed to load dashboard");
      });
  }, []);

  const openEditModal = () => {
    setEmail(user.email || "");
    setPassword("");
    setPasswordConfirmation("");
    setAbout(user.about || "");
    setEducation(user.education || "");
    setExperience(user.experience || "");
    setShowEditModal(true);
  };

  const closeEditModal = () => {
    setShowEditModal(false);
    setPassword("");
    setPasswordConfirmation("");
  };


  // When user selects image, open crop modal
  const handlePhotoSelect = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    const reader = new FileReader();

    reader.onload = () => {
      setImageSrc(reader.result);
      setShowCropModal(true);
    };

    reader.readAsDataURL(file);
  };


  // Save cropped image as uploadable file
  const saveCroppedImage = async () => {
    try {
      const croppedBlob = await getCroppedImg(imageSrc, croppedAreaPixels);

      const croppedFile = new File(
        [croppedBlob],
        "profile-photo.jpg",
        { type: "image/jpeg" }
      );

      setPhoto(croppedFile);
      setShowCropModal(false);
    } catch (err) {
      console.error(err);
      alert("Image crop failed");
    }
  };

  // Update profile with email/password/photo
  // Uses FormData because photo is a file

  const updateProfile = async () => {
    try {
      const formData = new FormData();

      // Add editable fields
      formData.append("email", email);
      formData.append("about", about);
      formData.append("education", education);
      formData.append("experience", experience);

      // Add password only if user entered it
      if (password) {
        formData.append("password", password);
        formData.append("password_confirmation", passwordConfirmation);
      }

      // Add Cropped Photo only if user selected one
      if (photo) {
        formData.append("photo", photo);
      }

      // Laravel accepts PUT through method spoofing with FormData
      await api.post("/profile?_method=PUT", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      alert("Profile updated!");

      const res = await api.get("/me");
      setUser(res.data);
      setEmail(res.data.email || "");

      closeEditModal();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to update profile");
    }
  };

  if (!user) {
    return (
      <div className="container">
        <div className="card">
          <p>Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="dashboard-grid">
        <div className="profile-card">
          {/* User profile photo or first letter fallback */}
          <div className="avatar">
            {user.profile_photo ? (
              <img
                src={`http://localhost:8000/storage/${user.profile_photo}`}
                alt="Profile"
                className="avatar-image"
              />
            ) : (
              user.name ? user.name.charAt(0).toUpperCase() : "U"
            )}
          </div>

          <h2>{user.name}</h2>
          <p className="small">{user.email}</p>

          {/* User profile details shown on dashboard */}
          <div className="profile-details">
            <p>
              <strong>About:</strong> {user.about || "Not added yet"}
            </p>

            <p>
              <strong>Education:</strong> {user.education || "Not added yet"}
            </p>

            <p>
              <strong>Experience:</strong> {user.experience || "Not added yet"}
            </p>
          </div>

          <div className="points-box">
            <span className="points-label">Points</span>
            <span className="points-value">{user.points}</span>
          </div>

          <button onClick={openEditModal}>Edit Profile</button>
        </div>

        <div className="dashboard-main">
          <div className="card">
            <h2>Welcome back</h2>
            <p className="small">
              Manage your profile, points, and audio mastering jobs.
            </p>
          </div>

          <div className="dashboard-actions">
            <Link to="/jobs" className="dashboard-link-card">
              <h3>Browse Jobs</h3>
              <p>See open mastering jobs and accept work.</p>
            </Link>

            <Link to="/post" className="dashboard-link-card">
              <h3>Post a Job</h3>
              <p>Create a new job and offer points to engineers.</p>
            </Link>
          </div>
        </div>
      </div>

      {showEditModal && (
        <div className="modal-overlay">
          <div className="modal-card">
            <h2>Edit Profile</h2>
            <p className="small">Username cannot be changed.</p>

            <label>Name / Username</label>
            <input value={user.name} disabled />

            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <label>Profile Photo</label>

            <input
              type="file"
              accept="image/*"
              onChange={handlePhotoSelect}
            />

            {photo && (
              <p className="small">
                Cropped photo ready to upload.
              </p>
            )}

            {/* ========================================
   About section
======================================== */}
            <label>About</label>

            <textarea
              placeholder="Tell others about yourself"
              value={about}
              onChange={(e) => setAbout(e.target.value)}
            />

            {/* ========================================
   Education section
======================================== */}
            <label>Education</label>

            <textarea
              placeholder="Your education background"
              value={education}
              onChange={(e) => setEducation(e.target.value)}
            />

            {/* Experience section */}
            <label>Experience</label>

            <textarea
              placeholder="Your mastering / audio experience"
              value={experience}
              onChange={(e) => setExperience(e.target.value)}
            />

            <label>New Password</label>
            <input
              type="password"
              placeholder="Leave blank to keep current password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <label>Confirm Password</label>
            <input
              type="password"
              placeholder="Confirm new password"
              value={passwordConfirmation}
              onChange={(e) => setPasswordConfirmation(e.target.value)}
            />

            <button onClick={updateProfile}>Save Profile</button>

            <button className="cancel-btn" onClick={closeEditModal}>
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Crop Profile Photo Modal */}
      {showCropModal && (
        <div className="modal-overlay">
          <div className="modal-card crop-modal">
            <h2>Crop Profile Photo</h2>

            <div className="crop-container">
              <Cropper
                image={imageSrc}
                crop={crop}
                zoom={zoom}
                aspect={1}
                cropShape="round"
                showGrid={false}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={(croppedArea, croppedPixels) =>
                  setCroppedAreaPixels(croppedPixels)
                }
              />
            </div>

            <label>Zoom</label>
            <input
              type="range"
              min={1}
              max={3}
              step={0.1}
              value={zoom}
              onChange={(e) => setZoom(e.target.value)}
            />

            <button onClick={saveCroppedImage}>
              Use Cropped Photo
            </button>

            <button
              className="cancel-btn"
              onClick={() => setShowCropModal(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;