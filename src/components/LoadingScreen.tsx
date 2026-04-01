import type { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { Gamepad2, Shield, Zap } from 'lucide-react';

interface LoadingScreenProps {
  progress: number;
}

const loadingMessages = [
  'Authenticating player session',
  'Syncing game library',
  'Loading arena visuals',
  'Preparing immersive launch',
];

export default function LoadingScreen({ progress }: LoadingScreenProps) {
  const messageIndex = Math.min(
    loadingMessages.length - 1,
    Math.floor((progress / 100) * loadingMessages.length)
  );

  return (
    <div className="fixed inset-0 z-[100] overflow-hidden bg-[#05070b]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(249,115,22,0.24),_transparent_35%),radial-gradient(circle_at_80%_20%,_rgba(239,68,68,0.18),_transparent_28%),linear-gradient(180deg,_#090c13_0%,_#040506_100%)]" />
      <div className="absolute inset-0 opacity-20 [background-image:linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] [background-size:48px_48px]" />

      <div className="relative flex min-h-screen items-center justify-center px-6">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-2xl rounded-[32px] border border-white/10 bg-black/35 p-8 shadow-[0_0_80px_rgba(239,68,68,0.14)] backdrop-blur-2xl sm:p-10"
        >
          <div className="mb-8 flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <motion.div
                className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-500 via-red-500 to-red-700 shadow-[0_0_35px_rgba(249,115,22,0.35)]"
                animate={{ rotate: [0, 4, -4, 0], scale: [1, 1.04, 1] }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                <Gamepad2 className="h-8 w-8 text-white" />
              </motion.div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.34em] text-orange-400">
                  Premium Gaming Hub
                </p>
                <h1 className="mt-2 text-3xl font-black tracking-[0.12em] text-white sm:text-4xl">
                  GameVerse Arena
                </h1>
              </div>
            </div>

            <motion.div
              className="hidden rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-gray-200 sm:block"
              animate={{ boxShadow: ['0 0 0 rgba(249,115,22,0)', '0 0 18px rgba(249,115,22,0.28)', '0 0 0 rgba(249,115,22,0)'] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              System Online
            </motion.div>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <StatusPill icon={<Shield className="h-4 w-4" />} label="Secure Matchmaking" />
            <StatusPill icon={<Zap className="h-4 w-4" />} label="Fast Launch Pipeline" />
            <StatusPill icon={<Gamepad2 className="h-4 w-4" />} label="Controller Ready" />
          </div>

          <div className="mt-10">
            <div className="mb-3 flex items-center justify-between text-sm text-gray-300">
              <span>{loadingMessages[messageIndex]}</span>
              <span>{Math.round(progress)}%</span>
            </div>

            <div className="h-3 overflow-hidden rounded-full bg-white/10">
              <motion.div
                className="h-full rounded-full bg-[linear-gradient(90deg,#f97316_0%,#ef4444_55%,#fb7185_100%)]"
                animate={{ width: `${progress}%` }}
                transition={{ ease: 'easeOut', duration: 0.25 }}
              />
            </div>
          </div>

          <div className="mt-8 flex flex-wrap items-center justify-between gap-4 text-sm text-gray-400">
            <span>Initializing immersive game selection experience</span>
            <span className="font-semibold text-gray-200">Stand by for deployment</span>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

function StatusPill({ icon, label }: { icon: ReactNode; label: string }) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-gray-200">
      <span className="text-orange-400">{icon}</span>
      <span>{label}</span>
    </div>
  );
}
