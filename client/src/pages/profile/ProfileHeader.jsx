import { useState } from "react";
import { auth, db } from "../../firebase";
import { doc, updateDoc } from "firebase/firestore";
import { uploadImageToCloudinary } from "../../utils/cloudinary";

export default function ProfileHeader({ user }) {
  const isOwner = auth.currentUser?.uid === user.uid;
  const [uploading, setUploading] = useState(false);

  const updateImage = async (file, field) => {
    if (!file) return;

    try {
      setUploading(true);
      const url = await uploadImageToCloudinary(file);

      await updateDoc(doc(db, "users", user.uid), {
        [field]: url,
      });
    } catch (err) {
      console.error("Upload failed:", err);
      alert("Upload failed");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow overflow-hidden">

      {/* COVER */}
      <div className="relative h-52 bg-gray-200">
        <img
          src={user.coverURL || "/cover-default.jpg"}
          alt="Cover"
          className="w-full h-full object-cover"
        />

        {isOwner && (
          <label className="absolute top-3 right-3 bg-black/60 text-white text-xs px-3 py-1 rounded cursor-pointer">
            Change cover
            <input
              type="file"
              accept="image/*"
              hidden
              onChange={(e) =>
                updateImage(e.target.files[0], "coverURL")
              }
            />
          </label>
        )}
      </div>

      {/* PROFILE BODY */}
      <div className="px-6 pb-6">

        {/* AVATAR + INFO (LEFT ALIGNED) */}
        <div className="-mt-16">

          {/* Avatar */}
          <div className="relative w-fit">
            <img
              src={user.photoURL || "/avatar-default.png"}
              alt="Avatar"
              className="w-32 h-32 rounded-full border-4 border-white object-cover bg-white shadow"
            />

            {isOwner && (
              <label className="absolute bottom-2 right-2 bg-indigo-600 text-white text-xs px-2 py-1 rounded cursor-pointer">
                Edit
                <input
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={(e) =>
                    updateImage(e.target.files[0], "photoURL")
                  }
                />
              </label>
            )}
          </div>

          {/* Name + username BELOW avatar */}
          <div className="mt-4 space-y-1">
            <h1 className="text-2xl font-bold text-gray-900">
              {auth.currentUser?.displayName || user.fullName}
            </h1>

            <p className="text-gray-500 text-sm">
              @{auth.currentUser?.username|| user.username}
            </p>

            <span className="inline-block mt-2 px-4 py-1 text-sm rounded-full bg-indigo-100 text-indigo-600 font-medium">
              {user.role === "educator" ? "Educator" : "Learner"}
            </span>
          </div>
        </div>

        {uploading && (
          <p className="mt-4 text-sm-right text-gray-400">
            Uploading...
          </p>
        )}
      </div>
    </div>
  );
}
