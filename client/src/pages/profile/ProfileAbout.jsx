import { useState } from "react";
import { auth, db } from "../../firebase";
import { doc, updateDoc } from "firebase/firestore";

export default function AboutSection({ user }) {
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  const [fullName, setFullName] = useState(user.fullName || "");
  const [dob, setDob] = useState(user.dob || "");
  const [bio, setBio] = useState(user.bio || "");

  const handleSave = async () => {
    const currentUser = auth.currentUser;
    if (!currentUser) return;

    setSaving(true);

    try {
      await updateDoc(doc(db, "users", currentUser.uid), {
        fullName: fullName.trim(),
        dob,
        bio: bio.trim(),
      });

      setEditing(false);
    } catch (err) {
      console.error("Profile update failed:", err);
      alert("Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">About</h2>

        {!editing ? (
          <button
            onClick={() => setEditing(true)}
            className="text-indigo-600 text-sm hover:underline"
          >
            Edit
          </button>
        ) : (
          <div className="flex gap-3">
            <button
              onClick={() => setEditing(false)}
              className="text-gray-500 text-sm"
              disabled={saving}
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="text-indigo-600 text-sm font-medium"
              disabled={saving}
            >
              {saving ? "Saving..." : "Save"}
            </button>
          </div>
        )}
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {/* FULL NAME */}
        <div>
          <label className="text-sm text-gray-500">
            Full Name
          </label>
          {editing ? (
            <input
              className="mt-1 w-full border rounded p-2"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />
          ) : (
            <p className="mt-1 text-gray-800">
              { auth.currentUser?.displayName ||user.fullName || "—"}
            </p>
          )}
        </div>

        {/* EMAIL (READ ONLY) */}
        <div>
          <label className="text-sm text-gray-500">
            Email
          </label>
          <p className="mt-1 text-gray-800">
            {user.email || auth.currentUser.email} 
          </p>
        </div>

        {/* USERNAME (READ ONLY) */}
        <div>
          <label className="text-sm text-gray-500">
            Username
          </label>
          <p className="mt-1 text-gray-800">
            @{user.username}
          </p>
        </div>

        {/* DATE OF BIRTH */}
        <div>
          <label className="text-sm text-gray-500">
            Date of Birth
          </label>
          {editing ? (
            <input
              type="date"
              className="mt-1 w-full border rounded p-2"
              value={dob}
              onChange={(e) => setDob(e.target.value)}
            />
          ) : (
            <p className="mt-1 text-gray-800">
              {user.dob || "—"}
            </p>
          )}
        </div>

        {/* BIO */}
        <div className="md:col-span-2">
          <label className="text-sm text-gray-500">
            Bio
          </label>
          {editing ? (
            <textarea
              className="mt-1 w-full border rounded p-2"
              rows={3}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
            />
          ) : (
            <p className="mt-1 text-gray-800">
              {user.bio || "—"}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
