import { Game } from '../data/games';
import { Play, Star, Users, Sparkles, Zap, Award, Flame, Clock3, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';
import { useState, useRef } from 'react';
import { playHoverSound, playClickSound } from '../utils/soundEffects';

interface GameCardProps {
  game: Game;
  onClick: () => void;
  isFocused?: boolean;
}

export default function GameCard({ game, onClick, isFocused = false }: GameCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const hoverTimeoutRef = useRef<NodeJS.Timeout>();

  const handleMouseEnter = () => {
    setIsHovered(true);
    playHoverSound();
    hoverTimeoutRef.current = setTimeout(() => {
      setShowPreview(true);
      if (videoRef.current) {
        videoRef.current.play();
      }
    }, 800);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setShowPreview(false);
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy':
        return '#00ff41';
      case 'Medium':
        return '#ffaa00';
      case 'Hard':
        return '#ff0055';
      default:
        return '#00f7ff';
    }
  };

  const handleClick = () => {
    playClickSound();
    onClick();
  };

  return (
    <motion.div
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="group relative cursor-pointer cursor-hover"
      whileHover={{
        scale: 1.05,
        y: -10,
        rotateY: 5,
        rotateX: 2,
      }}
      whileTap={{ scale: 0.98 }}
      animate={{
        scale: isFocused ? 1.03 : 1,
        boxShadow: isFocused ? `0 0 50px ${game.glowColor}80` : 'none',
      }}
      transition={{
        type: 'spring',
        stiffness: 300,
        damping: 20
      }}
      style={{
        transformStyle: 'preserve-3d',
        perspective: '1000px',
      }}
    >
      <motion.div
        className="absolute -inset-1 rounded-3xl blur-xl"
        animate={{
          opacity: isHovered ? 1 : 0,
          scale: isHovered ? 1.1 : 1,
        }}
        transition={{ duration: 0.4 }}
        style={{
          background: `radial-gradient(circle at center, ${game.glowColor}60, transparent 70%)`,
        }}
      />

      <motion.div
        className="absolute -inset-2 rounded-3xl opacity-0"
        animate={{
          opacity: isHovered ? [0, 0.5, 0] : 0,
          scale: isHovered ? [1, 1.2, 1.3] : 1,
        }}
        transition={{ duration: 1, repeat: isHovered ? Infinity : 0 }}
        style={{
          background: `radial-gradient(circle at center, ${game.glowColor}30, transparent 60%)`,
        }}
      />

      <motion.div
        className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-gray-900 to-black shadow-2xl ring-1 ring-gray-800"
        animate={{
          boxShadow: isHovered
            ? `0 0 40px 8px ${game.glowColor}80, 0 0 80px 4px ${game.glowColor}40`
            : `0 0 0 0 ${game.glowColor}00`,
          borderColor: isHovered ? game.glowColor : 'transparent',
        }}
        transition={{ duration: 0.4 }}
      >
        <motion.div
          className="absolute top-0 left-0 w-full h-full opacity-0 pointer-events-none"
          animate={{
            opacity: isHovered ? [0, 0.3, 0] : 0,
            background: [
              `linear-gradient(45deg, transparent 30%, ${game.glowColor}40 50%, transparent 70%)`,
              `linear-gradient(45deg, transparent 30%, ${game.glowColor}40 50%, transparent 70%)`,
            ],
            x: isHovered ? ['-100%', '100%'] : '-100%',
          }}
          transition={{ duration: 1.5, repeat: isHovered ? Infinity : 0 }}
        />

        <div className="relative h-72 w-full overflow-hidden">
          <img
            src={game.image}
            alt={game.title}
            className="h-full w-full object-cover transition-all duration-700 group-hover:scale-110 group-hover:brightness-110"
          />

          {showPreview && game.previewVideo && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute inset-0"
            >
              <video
                ref={videoRef}
                src={game.previewVideo}
                className="h-full w-full object-cover"
                loop
                muted
                playsInline
              />
            </motion.div>
          )}

          <div className="absolute top-4 left-4 flex flex-wrap gap-2 z-20">
            {game.tags.map((tag, index) => (
              <motion.span
                key={tag}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center gap-1 rounded-full bg-black/70 backdrop-blur-sm px-3 py-1 text-xs font-bold text-white"
              >
                <Flame className="h-3 w-3" />
                {tag}
              </motion.span>
            ))}
          </div>

          <motion.div
            className="absolute top-4 right-4 z-20 rounded-full px-3 py-1 backdrop-blur-sm"
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            whileHover={{ scale: 1.1, rotate: 5 }}
            style={{
              background: `linear-gradient(135deg, ${getDifficultyColor(game.difficulty)}, ${getDifficultyColor(game.difficulty)}cc)`,
              boxShadow: `0 0 15px ${getDifficultyColor(game.difficulty)}`,
            }}
          >
            <div className="flex items-center gap-1">
              <Award className="h-3 w-3 text-white" />
              <span className="text-xs font-bold text-white">{game.difficulty}</span>
            </div>
          </motion.div>
        </div>

        <motion.div
          className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent"
          animate={{ opacity: isHovered ? 0.95 : 0.6 }}
          transition={{ duration: 0.3 }}
        >
          <motion.div
            className="absolute inset-0 flex items-center justify-center"
            initial={{ opacity: 0, scale: 0 }}
            animate={{
              opacity: isHovered ? 1 : 0,
              scale: isHovered ? 1 : 0,
            }}
            transition={{ duration: 0.3 }}
          >
            <motion.div
              className="rounded-full p-6 shadow-2xl relative"
              style={{
                background: `linear-gradient(135deg, ${game.glowColor}, ${game.glowColor}cc)`,
                boxShadow: `0 0 60px ${game.glowColor}`,
              }}
              animate={{
                rotate: isHovered ? 360 : 0,
                scale: isHovered ? [1, 1.1, 1] : 1,
              }}
              transition={{
                rotate: { duration: 20, repeat: Infinity, ease: 'linear' },
                scale: { duration: 2, repeat: Infinity }
              }}
            >
              <motion.div
                animate={{
                  scale: isHovered ? [1, 1.2, 1] : 1,
                }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <Play className="h-10 w-10 text-white" fill="white" />
              </motion.div>

              <motion.div
                className="absolute inset-0 rounded-full"
                style={{
                  border: `2px solid ${game.glowColor}`,
                }}
                animate={{
                  scale: [1, 1.5, 2],
                  opacity: [0.8, 0.4, 0],
                }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </motion.div>
          </motion.div>
        </motion.div>

        <motion.div
          className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black/95 to-transparent p-6"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <div className="mb-3 flex items-center justify-between">
            <motion.span
              className="flex items-center gap-1 rounded-full px-4 py-1.5 text-xs font-bold text-white shadow-lg relative overflow-hidden"
              style={{
                background: `linear-gradient(135deg, ${game.glowColor}, ${game.glowColor}cc)`,
                boxShadow: `0 0 20px ${game.glowColor}40`,
              }}
              whileHover={{ scale: 1.05 }}
            >
              <motion.div
                className="absolute inset-0 bg-white/20"
                initial={{ x: '-100%' }}
                animate={{ x: isHovered ? '100%' : '-100%' }}
                transition={{ duration: 0.6 }}
              />
              <motion.div
                animate={{ rotate: isHovered ? [0, 360] : 0 }}
                transition={{ duration: 1, repeat: isHovered ? Infinity : 0 }}
              >
                <Sparkles className="h-3 w-3 relative z-10" />
              </motion.div>
              <span className="relative z-10">{game.category}</span>
            </motion.span>
          </div>

          <motion.h3
            className="mb-2 text-2xl font-bold"
            animate={{
              color: isHovered ? game.glowColor : 'white',
              textShadow: isHovered
                ? `0 0 30px ${game.glowColor}, 0 0 60px ${game.glowColor}40`
                : '0 2px 10px rgba(0,0,0,0.5)',
              x: isHovered ? 5 : 0,
            }}
            transition={{ duration: 0.3 }}
          >
            {game.title.split('').map((char, index) => (
              <motion.span
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{
                  scale: 1.2,
                  color: game.glowColor,
                  textShadow: `0 0 20px ${game.glowColor}`,
                }}
              >
                {char}
              </motion.span>
            ))}
          </motion.h3>

          <motion.p
            className="mb-3 line-clamp-2 text-sm text-gray-400"
            initial={{ opacity: 0, height: 0 }}
            animate={{
              opacity: isHovered ? 1 : 0,
              height: isHovered ? 'auto' : 0,
            }}
            transition={{ duration: 0.3 }}
          >
            {game.description}
          </motion.p>

          <motion.div
            className="flex flex-wrap items-center gap-3 text-sm text-gray-300"
            whileHover={{ x: 5 }}
          >
            <motion.div
              animate={{ scale: isHovered ? [1, 1.2, 1] : 1 }}
              transition={{ duration: 0.5, repeat: isHovered ? Infinity : 0 }}
              className="flex items-center gap-1"
            >
              <Users className="h-4 w-4" />
              <span>{game.players}</span>
            </motion.div>

            <motion.div
              animate={{ scale: isHovered ? [1, 1.2, 1] : 1 }}
              transition={{ duration: 0.5, repeat: isHovered ? Infinity : 0 }}
              className="flex items-center gap-1"
            >
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span>{game.rating}</span>
            </motion.div>

            <motion.div
              animate={{ scale: isHovered ? [1, 1.2, 1] : 1 }}
              transition={{ duration: 0.5, repeat: isHovered ? Infinity : 0, delay: 0.1 }}
              className="flex items-center gap-1"
            >
              <Clock3 className="h-4 w-4" />
              <span>{game.duration}</span>
            </motion.div>

            <motion.div
              animate={{ scale: isHovered ? [1, 1.2, 1] : 1 }}
              transition={{ duration: 0.5, repeat: isHovered ? Infinity : 0, delay: 0.2 }}
              className="flex items-center gap-1"
            >
              <ShieldCheck className="h-4 w-4" />
              <span>{game.ageLimit}</span>
            </motion.div>

            <motion.div
              className="ml-auto"
              animate={{ x: isHovered ? [0, 5, 0] : 0 }}
              transition={{ duration: 1, repeat: isHovered ? Infinity : 0 }}
            >
              <Zap className="h-4 w-4" style={{ color: game.glowColor }} />
            </motion.div>
          </motion.div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
