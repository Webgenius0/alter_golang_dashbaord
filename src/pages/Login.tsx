import { useState } from "react";
import { useAdminLogin } from "../hooks/auth/useAdminLogin";
import { LogIn, Eye, EyeOff } from "lucide-react";

export function Login() {
  const [email, setEmail] = useState("admin@altar.com");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const loginMutation = useAdminLogin();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loginMutation.mutate({ email, password });
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[radial-gradient(ellipse_at_center,_var(--color-bg-secondary)_0%,_var(--color-bg-primary)_100%)]">
      <div className="w-full max-w-[420px] p-10 bg-glass backdrop-blur-xl border border-border-subtle rounded-3xl shadow-2xl">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-2 text-text-primary">Altar Admin</h2>
          <p className="text-text-secondary">Sign in to your account</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-bg-primary border border-border-subtle rounded-lg text-text-primary placeholder:text-text-secondary focus:outline-none focus:border-accent transition-colors"
              placeholder="admin@altar.com"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 pr-12 bg-bg-primary border border-border-subtle rounded-lg text-text-primary placeholder:text-text-secondary focus:outline-none focus:border-accent transition-colors"
                placeholder="Enter your password"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute inset-y-0 right-0 flex items-center px-4 text-text-secondary hover:text-text-primary transition-colors"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loginMutation.isPending}
            className="w-full flex items-center justify-center gap-2 py-3 mt-4 bg-accent hover:bg-accent-hover text-white font-semibold rounded-lg transition-all duration-200 hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
          >
            <LogIn size={20} />
            {loginMutation.isPending ? "Signing in..." : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
}
