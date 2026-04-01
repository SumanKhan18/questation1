import { useEffect, useRef, useState } from 'react';
import { X, Maximize2, Volume2, VolumeX, Sparkles, Users, Star, Zap, Clock3, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Game } from '../data/games';

interface VideoPlayerProps {
  game: Game | null;
  onClose: () => void;
}

export default function VideoPlayer({ game, onClose }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number }>>([]);
  const isHostedEmbed = Boolean(game?.videoUrl && isHostedVideoUrl(game.videoUrl));
  const embedUrl = game?.videoUrl ? getHostedEmbedUrl(game.videoUrl) : '';

  useEffect(() => {
    if (game) {
      setIsVisible(true);
      if (isHostedEmbed) {
        return;
      }

      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.play().catch(() => {
            // Browser autoplay may be blocked until the user interacts with the page.
          });
        }
      }, 100);

      const interval = setInterval(() => {
        setParticles(prev => [
          ...prev.slice(-20),
          {
            id: Date.now(),
            x: Math.random() * 100,
            y: Math.random() * 100,
          }
        ]);
      }, 200);

      return () => clearInterval(interval);
    } else {
      setIsVisible(false);
      setParticles([]);
    }
  }, [game, isHostedEmbed]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  const toggleMute = () => {
    if (isHostedEmbed) return;

    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setIsMuted(!isMuted);
    }
  };

  const toggleFullscreen = () => {
    if (isHostedEmbed) return;

    if (videoRef.current) {
      if (document.fullscreenElement) {
        document.exitFullscreen();
      } else {
        videoRef.current.requestFullscreen();
      }
    }
  };

  if (!game) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 px-3 py-4 backdrop-blur-xl sm:px-5 sm:py-6"
          onClick={onClose}
        >
          {particles.map((particle) => (
            <motion.div
              key={particle.id}
              className="absolute w-2 h-2 rounded-full"
              style={{
                left: `${particle.x}%`,
                top: `${particle.y}%`,
                background: game.glowColor,
                boxShadow: `0 0 10px ${game.glowColor}`,
              }}
              initial={{ scale: 0, opacity: 1 }}
              animate={{ scale: [0, 1, 0], opacity: [1, 0.5, 0] }}
              transition={{ duration: 2 }}
            />
          ))}

          <motion.div
            className="absolute inset-0 pointer-events-none"
            animate={{
              background: [
                `radial-gradient(circle at 20% 50%, ${game.glowColor}15, transparent 50%)`,
                `radial-gradient(circle at 80% 50%, ${game.glowColor}15, transparent 50%)`,
                `radial-gradient(circle at 20% 50%, ${game.glowColor}15, transparent 50%)`,
              ],
            }}
            transition={{ duration: 10, repeat: Infinity }}
          />

          <motion.div
            initial={{ scale: 0.8, opacity: 0, y: 50 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: 50 }}
            transition={{ type: 'spring', stiffness: 200, damping: 20 }}
            className="relative w-full max-w-7xl"
            onClick={(e) => e.stopPropagation()}
          >
            <motion.button
              onClick={onClose}
              aria-label="Close video"
              className="absolute right-3 top-3 z-50 inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/70 px-3 py-2 text-sm font-semibold text-white backdrop-blur-md sm:right-5 sm:top-5"
              style={{
                boxShadow: `0 0 24px ${game.glowColor}55`,
              }}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.9 }}
            >
              <X className="h-5 w-5" />
              <span className="hidden sm:inline">Close</span>
            </motion.button>

            <motion.div
              className="relative mx-auto flex max-h-[92vh] w-full max-w-[min(1120px,100%)] flex-col overflow-hidden rounded-[28px] border border-white/10 bg-black/90 shadow-2xl"
              style={{
                background: 'linear-gradient(to bottom, #111, #000)',
              }}
              animate={{
                boxShadow: [
                  `0 0 60px ${game.glowColor}60, 0 20px 80px rgba(0,0,0,0.5)`,
                  `0 0 80px ${game.glowColor}80, 0 20px 100px rgba(0,0,0,0.7)`,
                  `0 0 60px ${game.glowColor}60, 0 20px 80px rgba(0,0,0,0.5)`,
                ],
              }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              <motion.div
                className="absolute -inset-1 rounded-3xl blur-2xl"
                style={{
                  background: `radial-gradient(circle at center, ${game.glowColor}40, transparent 70%)`,
                }}
                animate={{
                  opacity: [0.3, 0.6, 0.3],
                  scale: [1, 1.05, 1],
                }}
                transition={{ duration: 4, repeat: Infinity }}
              />

              <motion.div
                className="absolute inset-0 rounded-3xl"
                style={{
                  background: `conic-gradient(from 0deg at 50% 50%, transparent 0deg, ${game.glowColor}40 60deg, transparent 120deg)`,
                }}
                animate={{ rotate: 360 }}
                transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
              />

              <div className="relative flex max-h-[92vh] flex-col overflow-hidden">
                <motion.div
                  className="relative aspect-video w-full overflow-hidden bg-black"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  {isHostedEmbed ? (
                    <iframe
                      key={`${game.id}-${embedUrl}`}
                      src={embedUrl}
                      title={`${game.title} video`}
                      className="absolute inset-0 h-full w-full border-0"
                      allow="autoplay; fullscreen; picture-in-picture"
                      allowFullScreen
                    />
                  ) : (
                    <video
                      key={`${game.id}-${game.videoUrl}`}
                      ref={videoRef}
                      src={game.videoUrl}
                      className="h-full w-full object-cover"
                      controls
                      autoPlay
                      loop
                      muted={isMuted}
                      playsInline
                      preload="metadata"
                    />
                  )}

                  <motion.div
                    className="absolute top-0 left-0 w-full h-1"
                    style={{
                      background: `linear-gradient(90deg, ${game.glowColor}, transparent)`,
                    }}
                    animate={{ x: ['0%', '100%'] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                </motion.div>

                <motion.div
                  className="relative overflow-y-auto px-5 pb-6 pt-5 sm:px-6 sm:pb-7 sm:pt-6 lg:px-8 lg:pb-8"
                  style={{
                    background: `linear-gradient(to bottom, #111, #000)`,
                  }}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  <div className="mb-2 flex flex-col gap-6 lg:mb-0 lg:flex-row lg:items-start lg:justify-between">
                    <div className="flex-1">
                      <div className="mb-3 flex flex-wrap items-center gap-3">
                        <motion.span
                          className="flex items-center gap-2 rounded-full px-4 py-2 text-sm font-bold text-white shadow-lg relative overflow-hidden"
                          style={{
                            background: `linear-gradient(135deg, ${game.glowColor}, ${game.glowColor}cc)`,
                            boxShadow: `0 0 20px ${game.glowColor}60`,
                          }}
                          whileHover={{ scale: 1.05 }}
                        >
                          <motion.div
                            className="absolute inset-0 bg-white/20"
                            animate={{ x: ['-100%', '100%'] }}
                            transition={{ duration: 2, repeat: Infinity }}
                          />
                          <motion.div
                            animate={{ rotate: [0, 360] }}
                            transition={{ duration: 3, repeat: Infinity }}
                          >
                            <Sparkles className="h-4 w-4 relative z-10" />
                          </motion.div>
                          <span className="relative z-10">{game.category}</span>
                        </motion.span>

                        <motion.div
                          className="flex items-center gap-1.5 rounded-full bg-black/60 px-3 py-2 backdrop-blur-sm"
                          whileHover={{ scale: 1.05 }}
                        >
                          <motion.div
                            animate={{
                              rotate: [0, 360],
                              scale: [1, 1.2, 1],
                            }}
                            transition={{ duration: 2, repeat: Infinity }}
                          >
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          </motion.div>
                          <span className="text-sm font-bold text-white">{game.rating}/5.0</span>
                        </motion.div>
                      </div>

                      <motion.h2
                        className="mb-3 text-2xl font-bold text-white sm:text-3xl lg:text-4xl"
                        style={{
                          textShadow: `0 0 30px ${game.glowColor}60`,
                        }}
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.6 }}
                      >
                        {game.title}
                      </motion.h2>

                      <motion.p
                        className="mb-4 max-w-3xl text-base leading-relaxed text-gray-300 sm:text-lg"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.7 }}
                      >
                        {game.description}
                      </motion.p>

                      <motion.div
                        className="flex flex-wrap items-center gap-3"
                        initial={{ y: 10, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.8 }}
                      >
                        <motion.div
                          className="flex items-center gap-2 rounded-full bg-gray-800/60 px-4 py-2 backdrop-blur-sm"
                          whileHover={{ scale: 1.05, backgroundColor: `${game.glowColor}40` }}
                        >
                          <Users className="h-4 w-4 text-gray-300" />
                          <span className="text-sm text-gray-300">{game.players}</span>
                        </motion.div>

                        <motion.div
                          className="flex items-center gap-2 rounded-full bg-gray-800/60 px-4 py-2 backdrop-blur-sm"
                          whileHover={{ scale: 1.05, backgroundColor: `${game.glowColor}40` }}
                        >
                          <Clock3 className="h-4 w-4 text-gray-300" />
                          <span className="text-sm text-gray-300">{game.duration}</span>
                        </motion.div>

                        <motion.div
                          className="flex items-center gap-2 rounded-full bg-gray-800/60 px-4 py-2 backdrop-blur-sm"
                          whileHover={{ scale: 1.05, backgroundColor: `${game.glowColor}40` }}
                        >
                          <ShieldCheck className="h-4 w-4 text-gray-300" />
                          <span className="text-sm text-gray-300">Age {game.ageLimit}</span>
                        </motion.div>

                        <motion.div
                          className="flex items-center gap-1 text-sm"
                          animate={{ x: [0, 5, 0] }}
                          transition={{ duration: 1.5, repeat: Infinity }}
                        >
                          <Zap className="h-4 w-4" style={{ color: game.glowColor }} />
                          <span style={{ color: game.glowColor }}>Ready to Play</span>
                        </motion.div>
                      </motion.div>
                    </div>

                    <div className="flex flex-row gap-3 self-start lg:flex-col">
                      <motion.button
                        onClick={toggleMute}
                        className="rounded-xl bg-gray-800/80 p-3 text-white backdrop-blur-sm disabled:cursor-not-allowed disabled:opacity-50 sm:p-4"
                        style={{
                          boxShadow: `0 0 20px ${game.glowColor}20`,
                        }}
                        disabled={isHostedEmbed}
                        whileHover={{
                          scale: isHostedEmbed ? 1 : 1.1,
                          background: `${game.glowColor}40`,
                          boxShadow: `0 0 30px ${game.glowColor}60`,
                        }}
                        whileTap={{ scale: 0.95 }}
                        initial={{ x: 20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.9 }}
                      >
                        <motion.div
                          animate={{ scale: isMuted ? [1, 1.2, 1] : 1 }}
                          transition={{ duration: 0.3 }}
                        >
                          {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
                        </motion.div>
                      </motion.button>

                      <motion.button
                        onClick={toggleFullscreen}
                        className="rounded-xl bg-gray-800/80 p-3 text-white backdrop-blur-sm disabled:cursor-not-allowed disabled:opacity-50 sm:p-4"
                        style={{
                          boxShadow: `0 0 20px ${game.glowColor}20`,
                        }}
                        disabled={isHostedEmbed}
                        whileHover={{
                          scale: isHostedEmbed ? 1 : 1.1,
                          background: `${game.glowColor}40`,
                          boxShadow: `0 0 30px ${game.glowColor}60`,
                        }}
                        whileTap={{ scale: 0.95 }}
                        initial={{ x: 20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 1.0 }}
                      >
                        <Maximize2 className="h-5 w-5" />
                      </motion.button>

                      <motion.button
                        onClick={onClose}
                        className="rounded-xl p-4 text-white relative overflow-hidden"
                        style={{
                          background: `linear-gradient(135deg, ${game.glowColor}, ${game.glowColor}cc)`,
                          boxShadow: `0 0 30px ${game.glowColor}60`,
                        }}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        initial={{ x: 20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 1.1 }}
                      >
                        <motion.div
                          className="absolute inset-0 bg-white/20"
                          animate={{ x: ['-100%', '100%'] }}
                          transition={{ duration: 1.5, repeat: Infinity }}
                        />
                        <motion.div
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ duration: 1, repeat: Infinity }}
                        >
                          <span className="relative z-10 text-sm font-semibold">Done</span>
                        </motion.div>
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function isHostedVideoUrl(url: string) {
  return /jumpshare\.com|drive\.google\.com/i.test(url);
}

function getHostedEmbedUrl(url: string) {
  if (/jumpshare\.com/i.test(url)) {
    return url.replace('/s/', '/v/') + (url.includes('?') ? '&autoplay=1' : '?autoplay=1');
  }

  if (/drive\.google\.com/i.test(url)) {
    const match = url.match(/\/file\/d\/([^/]+)/i);

    if (match) {
      return `https://drive.google.com/file/d/${match[1]}/preview`;
    }
  }

  return url;
}
