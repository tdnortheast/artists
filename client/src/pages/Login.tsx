import { useState } from "react";
import { useLogin } from "@/hooks/use-releases";
import { motion } from "framer-motion";
import { ArrowRight, Lock, Music } from "lucide-react";

export default function Login() {
  const [password, setPassword] = useState("");
  const login = useLogin();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password.trim()) {
      login.mutate(password);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-background relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(255,215,0,0.05),transparent_60%)] pointer-events-none" />
      <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.03] pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-md p-6 relative z-10"
      >
        <div className="glass-panel p-8 md:p-12 rounded-3xl">
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-6 border border-primary/20">
              <Music className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-3xl font-bold mb-2 text-white tracking-tight">VIP Access</h1>
            <p className="text-muted-foreground">Enter your access code to view the collection.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Passphrase"
                  className="
                    w-full pl-12 pr-4 py-4 rounded-xl
                    bg-secondary/50 border border-white/5
                    text-white placeholder:text-muted-foreground/50
                    focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20
                    transition-all duration-200
                  "
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={login.isPending || !password}
              className="
                w-full py-4 rounded-xl font-semibold text-lg
                bg-primary text-primary-foreground
                shadow-lg shadow-primary/10
                hover:shadow-primary/25 hover:bg-primary/90 hover:-translate-y-0.5
                active:translate-y-0
                disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
                transition-all duration-200
                flex items-center justify-center gap-2
              "
            >
              {login.isPending ? (
                <span className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  Enter Vault <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-xs text-muted-foreground/40 uppercase tracking-widest">
              Restricted Area • Authorized Personnel Only
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
