import { useState } from "react";
import { useChangePassword } from "../hooks/auth/useChangePassword";
import { Save, Lock } from "lucide-react";

export function Settings() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const changePasswordMutation = useChangePassword();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      alert("New passwords do not match!");
      return;
    }
    changePasswordMutation.mutate({ old_password: currentPassword, new_password: newPassword, confirm_password: confirmPassword }, {
      onSuccess: () => {
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      }
    });
  };

  return (
    <div className="p-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-semibold text-text-primary">Settings</h1>
        <p className="text-text-secondary mt-2">Manage your admin preferences and security.</p>
      </div>

      <div className="bg-bg-secondary border border-border-subtle rounded-2xl p-8 max-w-2xl">
        <div className="flex items-center gap-3 mb-6 pb-6 border-b border-border-subtle">
          <div className="p-3 bg-bg-tertiary rounded-xl">
            <Lock className="text-accent" size={24} />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-text-primary">Change Password</h2>
            <p className="text-text-secondary text-sm">Update your admin account password</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2">Current Password</label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full px-4 py-3 bg-bg-primary border border-border-subtle rounded-lg text-text-primary focus:outline-none focus:border-accent transition-colors"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2">New Password</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full px-4 py-3 bg-bg-primary border border-border-subtle rounded-lg text-text-primary focus:outline-none focus:border-accent transition-colors"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2">Confirm New Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-3 bg-bg-primary border border-border-subtle rounded-lg text-text-primary focus:outline-none focus:border-accent transition-colors"
              required
            />
          </div>

          <div className="mt-4 flex justify-end">
            <button 
              type="submit" 
              disabled={changePasswordMutation.isPending}
              className="flex items-center gap-2 px-6 py-3 bg-accent hover:bg-accent-hover text-white font-semibold rounded-lg transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              <Save size={18} />
              {changePasswordMutation.isPending ? "Updating..." : "Update Password"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
