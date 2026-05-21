// Public User Profile Page
// Shows safe public info only


import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api";

function PublicProfile() {
    // Get user ID from URL
    const { id } = useParams();

    // Store public profile data
    const [profile, setProfile] = useState(null);

    // Load public profile
    useEffect(() => {
        api.get(`/users/${id}/public-profile`)
            .then((res) => setProfile(res.data))
            .catch((err) => {
                console.error(err);
                alert("Failed to load profile");
            });
    }, [id]);

    if (!profile) {
        return (
            <div className="container">
                <div className="card">Loading profile...</div>
            </div>
        );
    }

    return (
        <div className="container">
            {/* Profile summary */}
            <div className="card profile-card">

                {/* Public profile photo or fallback initial */}
                <div className="avatar">
                    {profile.profile_photo ? (
                        <img
                            src={`http://localhost:8000/storage/${profile.profile_photo}`}
                            alt="Profile"
                            className="avatar-image"
                        />
                    ) : (
                        profile.name ? profile.name.charAt(0).toUpperCase() : "U"
                    )}
                </div>

                <h2>{profile.name}</h2>

                <p>
                    <strong>Completed Jobs:</strong> {profile.completed_jobs}
                </p>

                <p>
                    <strong>Average Rating:</strong> {profile.average_rating} ★
                </p>

                {/* Public profile details */}
                <div className="profile-details">

                    <p>
                        <strong>About:</strong>
                        <br />
                        {profile.about || "Not added yet"}
                    </p>

                    <p>
                        <strong>Education:</strong>
                        <br />
                        {profile.education || "Not added yet"}
                    </p>

                    <p>
                        <strong>Experience:</strong>
                        <br />
                        {profile.experience || "Not added yet"}
                    </p>

                </div>

                <p className="small">
                    Audio files are private and cannot be viewed from public profiles.
                </p>
            </div>

            {/* Review list */}
            <div className="card">
                <h3>Reviews</h3>

                {profile.reviews.length === 0 && (
                    <p className="small">No reviews yet.</p>
                )}

                {profile.reviews.map((review) => (
                    <div className="review-box" key={review.id}>
                        <p>
                            <strong>{"★".repeat(review.stars)}</strong>
                        </p>

                        {review.comment && (
                            <p>{review.comment}</p>
                        )}

                        <p className="small">
                            Reviewed by {review.reviewer?.name || "User"}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default PublicProfile;