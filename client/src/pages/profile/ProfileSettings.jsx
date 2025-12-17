import { useState } from "react";
import { auth, db } from "../../firebase";
import {
  doc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import {
  updatePassword,
  reauthenticateWithCredential,
  EmailAuthProvider,
  deleteUser,
  signOut,
} from "firebase/auth";

export default function ProfileSettings({ user }) {
  // Password change
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [pwLoading, setPwLoading] = useState(false);

  // Preferences
  const [notificationsEnabled, setNotificationsEnabled] = useState(
    user.notificationsEnabled ?? true
  );
  const [prefSaving, setPrefSaving] = useState(false);

  // Danger zone
  const [confirmText, setConfirmText] = useState("");
  const [deleting, setDeleting] = useState(false);

  const handleChangePassword = async () => {
    const currentUser = auth.currentUser;
    if (!currentUser || !currentUser.email) return;

    if (newPassword.length < 6) {
      alert("Password must be at least 6 characters.");
      return;
    }

    try {
      setPwLoading(true);

      // Re-authenticate
      const credential = EmailAuthProvider.credential(
        currentUser.email,
        currentPassword
      );
      await reauthenticateWithCredential(
        currentUser,
        credential
      );

      await updatePassword(currentUser, newPassword);

      setCurrentPassword("");
      setNewPassword("");
      alert("Password updated successfully.");
    } catch (err) {
      console.error(err);
      alert("Password update failed.");
    } finally {
      setPwLoading(false);
    }
  };

  const savePreferences = async () => {
    const currentUser = auth.currentUser;
    if (!currentUser) return;

    try {
      setPrefSaving(true);
      await updateDoc(doc(db, "users", currentUser.uid), {
        notificationsEnabled,
      });
    } catch (err) {
      console.error(err);
      alert("Failed to save preferences.");
    } finally {
      setPrefSaving(false);
    }
  };

  const handleDeleteAccount = async () => {
    const currentUser = auth.currentUser;
    if (!currentUser) return;

    if (confirmText !== "DELETE") {
      alert('Type "DELETE" to confirm.');
      return;
    }

    try {
      setDeleting(true);

      // Delete Firestore user profile
      await deleteAccountData(currentUser.uid);

      // Delete Auth user
      await deleteUser(currentUser);

      // Sign out
      await signOut(auth);
    } catch (err) {
      console.error(err);
      alert(
        "Account deletion failed. Re-login and try again."
      );
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow p-6 space-y-8">
      <h2 className="text-lg font-semibold">
        Settings
      </h2>

      {/* PASSWORD */}
      <section className="space-y-3">
        <h3 className="font-medium">
          Change Password
        </h3>

        <input
          type="password"
          placeholder="Current password"
          className="w-full border rounded p-2"
          value={currentPassword}
          onChange={(e) =>
            setCurrentPassword(e.target.value)
          }
        />

        <input
          type="password"
          placeholder="New password"
          className="w-full border rounded p-2"
          value={newPassword}
          onChange={(e) =>
            setNewPassword(e.target.value)
          }
        />

        <button
          onClick={handleChangePassword}
          disabled={pwLoading}
          className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-500"
        >
          {pwLoading ? "Updating..." : "Update Password"}
        </button>
      </section>

      {/* PREFERENCES */}
      <section className="space-y-3">
        <h3 className="font-medium">
          Preferences
        </h3>

        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={notificationsEnabled}
            onChange={(e) =>
              setNotificationsEnabled(e.target.checked)
            }
          />
          Enable notifications
        </label>

        <button
          onClick={savePreferences}
          disabled={prefSaving}
          className="text-indigo-600 text-sm"
        >
          {prefSaving ? "Saving..." : "Save Preferences"}
        </button>
      </section>

      {/* DANGER ZONE */}
      <section className="border-t pt-6 space-y-3">
        <h3 className="font-medium text-red-600">
          Danger Zone
        </h3>

        <p className="text-sm text-gray-600">
          This will permanently delete your account and
          profile. This action cannot be undone.
        </p>

        <input
          placeholder='Type "DELETE" to confirm'
          className="w-full border rounded p-2"
          value={confirmText}
          onChange={(e) =>
            setConfirmText(e.target.value)
          }
        />

        <button
          onClick={handleDeleteAccount}
          disabled={deleting}
          className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-500"
        >
          {deleting ? "Deleting..." : "Delete Account"}
        </button>
      </section>
    </div>
  );
}

// OPTIONAL: expand this later to delete related data
async function deleteAccountData(uid) {
  // Minimal safe deletion (profile only)
  await deleteDoc(doc(db, "users", uid));

  // You can later add:
  // - progress cleanup
  // - notifications cleanup
  // - enrollments cleanup (Cloud Function recommended)
}
