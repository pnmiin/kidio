import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import {
  User,
  Lock,
  Trash2,
  Edit2,
  Shield,
  Users,
  LogOut,
  AlertTriangle,
  Eye,
  EyeOff,
  Loader2,
  CheckCircle2,
} from "lucide-react";
import { PageBackground } from "../../components/PageBackground";
import { KidioPageHeader } from "../../components/KidioPageHeader";
import { changePassword, logoutParent } from "../services/authApi";
import { getChildren, updateChildProfile, deleteChildProfile, ChildSummaryResponse } from "../services/childApi";

export function ParentProfile() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"account" | "children">("account");
  const [parentName, setParentName] = useState("");
  const [parentEmail, setParentEmail] = useState("");

  useEffect(() => {
    // In a real app, you might fetch parent details from an API.
    // For now, we get it from local storage.
    const storedEmail = localStorage.getItem("currentParent") || "parent@example.com";
    setParentEmail(storedEmail);
    // Extract name from email as a fallback
    setParentName(storedEmail.split("@")[0]);
  }, []);

  const handleLogout = async () => {
    await logoutParent();
    navigate("/");
  };

  return (
    <PageBackground variant="parent" className="px-4 py-6 sm:px-6 sm:py-8 min-h-screen">
      <div className="mx-auto max-w-5xl">
        <KidioPageHeader backLabel="Back to Dashboard" backTo="/parent-dashboard" />

        <div className="mt-8 flex flex-col md:flex-row gap-8">
          {/* Sidebar Navigation */}
          <div className="w-full md:w-64 shrink-0">
            <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-4 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white">
              <div className="flex items-center gap-3 px-4 py-4 mb-4 border-b border-gray-100">
                <div className="w-12 h-12 bg-sky-100 rounded-full flex items-center justify-center text-sky-600 font-bold text-xl">
                  {parentName.charAt(0).toUpperCase()}
                </div>
                <div className="overflow-hidden">
                  <h3 className="font-bold text-gray-900 truncate">{parentName}</h3>
                  <p className="text-sm text-gray-500 truncate">{parentEmail}</p>
                </div>
              </div>

              <nav className="space-y-2">
                <button
                  onClick={() => setActiveTab("account")}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-colors font-semibold ${
                    activeTab === "account"
                      ? "bg-sky-50 text-sky-600"
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  <Shield className="w-5 h-5" />
                  Account Security
                </button>
                <button
                  onClick={() => setActiveTab("children")}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-colors font-semibold ${
                    activeTab === "children"
                      ? "bg-violet-50 text-violet-600"
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  <Users className="w-5 h-5" />
                  Manage Children
                </button>
              </nav>

              <div className="mt-8 pt-4 border-t border-gray-100">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-rose-500 font-semibold hover:bg-rose-50 transition-colors"
                >
                  <LogOut className="w-5 h-5" />
                  Log Out
                </button>
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="flex-1">
            <AnimatePresence mode="wait">
              {activeTab === "account" ? (
                <AccountTab key="account" />
              ) : (
                <ChildrenTab key="children" />
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </PageBackground>
  );
}

// ============================================================================
// ACCOUNT TAB COMPONENT
// ============================================================================

function AccountTab() {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setErrorMessage("New passwords do not match.");
      return;
    }

    setIsSubmitting(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      const response = await changePassword(oldPassword, newPassword, confirmPassword);
      if (response.success) {
        setSuccessMessage("Password changed successfully!");
        setOldPassword("");
        setNewPassword("");
        setConfirmPassword("");
        setTimeout(() => setSuccessMessage(""), 5000);
      } else {
        throw new Error(response.message || "Failed to change password.");
      }
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "An error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="bg-white/90 backdrop-blur-sm rounded-3xl p-6 sm:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white"
    >
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Account Security</h2>
        <p className="text-gray-500">Update your password to keep your account secure.</p>
      </div>

      <form onSubmit={handlePasswordChange} className="space-y-6 max-w-md">
        <div>
          <label className="block text-gray-700 mb-2 font-semibold">Current Password</label>
          <div className="relative">
            <input
              type={showOldPassword ? "text" : "password"}
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl border-2 border-gray-100 focus:border-sky-400 outline-none transition-colors pr-12 bg-gray-50/50"
              placeholder="Enter current password"
              required
            />
            <button
              type="button"
              onClick={() => setShowOldPassword(!showOldPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-sky-500 focus:outline-none"
            >
              {showOldPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
        </div>

        <div className="pt-2">
          <label className="block text-gray-700 mb-2 font-semibold">New Password</label>
          <div className="relative">
            <input
              type={showNewPassword ? "text" : "password"}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl border-2 border-gray-100 focus:border-sky-400 outline-none transition-colors pr-12 bg-gray-50/50"
              placeholder="Enter new password"
              required
            />
            <button
              type="button"
              onClick={() => setShowNewPassword(!showNewPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-sky-500 focus:outline-none"
            >
              {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
        </div>

        <div>
          <label className="block text-gray-700 mb-2 font-semibold">Confirm New Password</label>
          <div className="relative">
            <input
              type={showConfirmPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl border-2 border-gray-100 focus:border-sky-400 outline-none transition-colors pr-12 bg-gray-50/50"
              placeholder="Confirm new password"
              required
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-sky-500 focus:outline-none"
            >
              {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {errorMessage && (
          <div className="rounded-2xl bg-amber-50 border border-amber-100 px-4 py-3 text-sm text-amber-700 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
            <p>{errorMessage}</p>
          </div>
        )}

        {successMessage && (
          <div className="rounded-2xl bg-emerald-50 border border-emerald-100 px-4 py-3 text-sm text-emerald-700 flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5" />
            <p>{successMessage}</p>
          </div>
        )}

        <button
          type="submit"
          disabled={isSubmitting || !oldPassword || !newPassword || !confirmPassword}
          className="px-8 py-3 bg-sky-500 hover:bg-sky-600 text-white rounded-full font-bold shadow-md hover:shadow-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Lock className="w-5 h-5" />}
          {isSubmitting ? "Updating..." : "Update Password"}
        </button>
      </form>
    </motion.div>
  );
}

// ============================================================================
// CHILDREN TAB COMPONENT
// ============================================================================

function ChildrenTab() {
  const [kids, setKids] = useState<ChildSummaryResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Edit Modal State
  const [editingKid, setEditingKid] = useState<ChildSummaryResponse | null>(null);
  const [editName, setEditName] = useState("");
  const [editAge, setEditAge] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  // Delete Modal State
  const [deletingKid, setDeletingKid] = useState<ChildSummaryResponse | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchKids = async () => {
    setIsLoading(true);
    try {
      const response = await getChildren(1, 20);
      if (response.success && response.data?.items) {
        setKids(response.data.items);
      }
    } catch (error) {
      console.error("Failed to fetch kids", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchKids();
  }, []);

  const handleEditClick = (kid: ChildSummaryResponse) => {
    setEditingKid(kid);
    setEditName(kid.name || "");
    setEditAge(kid.age.toString());
  };

  const handleSaveEdit = async () => {
    if (!editingKid || !editName.trim() || !editAge) return;
    setIsSaving(true);
    try {
      const res = await updateChildProfile(editingKid.id, editName.trim(), parseInt(editAge, 10));
      if (res.success) {
        await fetchKids();
        setEditingKid(null);
      }
    } catch (error) {
      console.error("Failed to update child", error);
      alert("Failed to update child profile.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteClick = (kid: ChildSummaryResponse) => {
    setDeletingKid(kid);
  };

  const handleConfirmDelete = async () => {
    if (!deletingKid) return;
    setIsDeleting(true);
    try {
      const res = await deleteChildProfile(deletingKid.id);
      if (res.success) {
        await fetchKids();
        setDeletingKid(null);
      }
    } catch (error) {
      console.error("Failed to delete child", error);
      alert("Failed to delete child profile.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="bg-white/90 backdrop-blur-sm rounded-3xl p-6 sm:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white"
    >
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Manage Children</h2>
        <p className="text-gray-500">Update information or remove child profiles from your account.</p>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="w-8 h-8 text-violet-500 animate-spin" />
        </div>
      ) : kids.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-3xl border border-gray-100">
          <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm text-gray-400">
            <Users className="w-8 h-8" />
          </div>
          <p className="text-gray-500 mb-4">No children found in your account.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {kids.map((kid) => (
            <div key={kid.id} className="flex items-center justify-between p-4 rounded-2xl border border-gray-100 bg-white hover:border-violet-200 hover:shadow-sm transition-all group">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-violet-100 to-fuchsia-100 flex items-center justify-center font-bold text-violet-700 text-lg">
                  {kid.name ? kid.name.charAt(0).toUpperCase() : 'K'}
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">{kid.name || "KIDIO Kid"}</h3>
                  <p className="text-sm text-gray-500">{kid.age} years old • {kid.totalStars} Stars</p>
                </div>
              </div>
              
              <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => handleEditClick(kid)}
                  className="p-2 text-gray-400 hover:text-sky-600 hover:bg-sky-50 rounded-xl transition-colors"
                  aria-label="Edit"
                >
                  <Edit2 className="w-5 h-5" />
                </button>
                <button
                  onClick={() => handleDeleteClick(kid)}
                  className="p-2 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
                  aria-label="Delete"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* EDIT MODAL */}
      <AnimatePresence>
        {editingKid && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-gray-900/40 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl p-6 w-full max-w-sm shadow-2xl"
            >
              <h3 className="text-xl font-bold text-gray-900 mb-4">Edit Profile</h3>
              
              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Name</label>
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="w-full px-4 py-3 rounded-2xl border-2 border-gray-100 focus:border-violet-400 outline-none transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Age</label>
                  <input
                    type="number"
                    min="3"
                    max="15"
                    value={editAge}
                    onChange={(e) => setEditAge(e.target.value)}
                    className="w-full px-4 py-3 rounded-2xl border-2 border-gray-100 focus:border-violet-400 outline-none transition-colors"
                  />
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setEditingKid(null)}
                  disabled={isSaving}
                  className="flex-1 py-3 font-semibold text-gray-600 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveEdit}
                  disabled={isSaving || !editName.trim() || !editAge}
                  className="flex-1 py-3 font-semibold text-white bg-violet-500 rounded-full hover:bg-violet-600 transition-colors flex justify-center items-center"
                >
                  {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : "Save"}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* DELETE MODAL */}
      <AnimatePresence>
        {deletingKid && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-gray-900/40 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl p-6 w-full max-w-sm shadow-2xl text-center"
            >
              <div className="w-16 h-16 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertTriangle className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Delete Profile?</h3>
              <p className="text-gray-500 mb-6 text-sm">
                Are you sure you want to delete <strong>{deletingKid.name}</strong>'s profile? This action will hide all their learning data.
              </p>
              
              <div className="flex gap-3">
                <button
                  onClick={() => setDeletingKid(null)}
                  disabled={isDeleting}
                  className="flex-1 py-3 font-semibold text-gray-600 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmDelete}
                  disabled={isDeleting}
                  className="flex-1 py-3 font-semibold text-white bg-rose-500 rounded-full hover:bg-rose-600 transition-colors flex justify-center items-center"
                >
                  {isDeleting ? <Loader2 className="w-5 h-5 animate-spin" /> : "Yes, Delete"}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
