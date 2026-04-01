import { useState } from 'react';
import { motion, AnimatePresence, PanInfo } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import GameCard from './GameCard';
import { Game } from '../data/games';

interface EnhancedCarouselProps {
  games: Game[];
  onGameClick: (game: Game) => void;
  title: string;
}

const swipeConfidenceThreshold = 10000;
const swipePower = (offset: number, velocity: number) => {
  return Math.abs(offset) * velocity;
};

export default function EnhancedCarousel({ games, onGameClick, title }: EnhancedCarouselProps) {
  const [[page, direction], setPage] = useState([0, 0]);
  const [isHovering, setIsHovering] = useState(false);

  const gameIndex = ((page % games.length) + games.length) % games.length;

  const paginate = (newDirection: number) => {
    setPage([page + newDirection, newDirection]);
  };

  const handleDragEnd = (_event: MouseEvent | TouchEvent | PointerEvent, { offset, velocity }: PanInfo) => {
    const swipe = swipePower(offset.x, velocity.x);

    if (swipe < -swipeConfidenceThreshold) {
      paginate(1);
    } else if (swipe > swipeConfidenceThreshold) {
      paginate(-1);
    }
  };

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
      scale: 0.8,
      rotateY: direction > 0 ? 45 : -45,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
      scale: 1,
      rotateY: 0,
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0,
      scale: 0.8,
      rotateY: direction < 0 ? 45 : -45,
    }),
  };

  const displayedGames = [
    games[(gameIndex - 1 + games.length) % games.length],
    games[gameIndex],
    games[(gameIndex + 1) % games.length],
  ];

  return (
    <div
      className="relative w-full overflow-hidden rounded-[34px] border border-white/10 bg-[radial-gradient(circle_at_top,rgba(249,115,22,0.12),transparent_20%),linear-gradient(180deg,rgba(255,255,255,0.03),rgba(255,255,255,0.01))] px-4 py-6 shadow-[0_0_40px_rgba(249,115,22,0.08)] sm:px-6"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.06),transparent_26%)]" />
      <motion.div
        className="relative mb-8 flex items-center justify-between"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div>
          <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.32em] text-orange-300">
            Prime Carousel
          </p>
          <motion.h2
            className="relative text-4xl font-bold text-white"
            animate={{
              textShadow: [
                '0 0 20px rgba(220, 38, 38, 0.3)',
                '0 0 40px rgba(220, 38, 38, 0.6)',
                '0 0 20px rgba(220, 38, 38, 0.3)',
              ],
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            {title}
            <motion.div
              className="absolute -bottom-2 left-0 h-1 bg-gradient-to-r from-red-600 via-orange-500 to-transparent"
              initial={{ width: 0 }}
              animate={{ width: '100%' }}
              transition={{ duration: 0.8, delay: 0.2 }}
            />
          </motion.h2>
        </div>

        <motion.div
          className="flex gap-2"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <motion.button
            onClick={() => paginate(-1)}
            whileHover={{ scale: 1.1, rotate: -5 }}
            whileTap={{ scale: 0.9 }}
            className="group relative overflow-hidden rounded-full bg-gradient-to-r from-gray-800 to-gray-900 p-3 text-white transition-all"
            style={{
              boxShadow: '0 0 20px rgba(220, 38, 38, 0.3)',
            }}
          >
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-red-600 to-orange-600 opacity-0 group-hover:opacity-100 transition-opacity"
              layoutId="buttonBg"
            />
            <ChevronLeft className="h-6 w-6 relative z-10" />
          </motion.button>

          <motion.button
            onClick={() => paginate(1)}
            whileHover={{ scale: 1.1, rotate: 5 }}
            whileTap={{ scale: 0.9 }}
            className="group relative overflow-hidden rounded-full bg-gradient-to-r from-gray-800 to-gray-900 p-3 text-white transition-all"
            style={{
              boxShadow: '0 0 20px rgba(220, 38, 38, 0.3)',
            }}
          >
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-red-600 to-orange-600 opacity-0 group-hover:opacity-100 transition-opacity"
            />
            <ChevronRight className="h-6 w-6 relative z-10" />
          </motion.button>
        </motion.div>
      </motion.div>

      <div className="relative h-[540px] overflow-hidden">
        <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-24 bg-gradient-to-r from-[#08090d] to-transparent" />
        <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-24 bg-gradient-to-l from-[#08090d] to-transparent" />
        <AnimatePresence initial={false} custom={direction} mode="popLayout">
          <motion.div
            key={page}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: 'spring', stiffness: 300, damping: 30 },
              opacity: { duration: 0.3 },
              scale: { duration: 0.4 },
              rotateY: { duration: 0.4 },
            }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.2}
            onDragEnd={handleDragEnd}
            className="absolute inset-0 cursor-grab active:cursor-grabbing"
            style={{
              perspective: '1200px',
            }}
          >
            <div className="flex h-full items-center justify-center gap-6 px-4">
              {displayedGames.map((game, idx) => (
                <motion.div
                  key={`${game.id}-${idx}`}
                  className={`${
                    idx === 1 ? 'relative z-20 w-full max-w-md' : 'relative z-10 w-3/4 max-w-sm opacity-60 scale-90'
                  } transition-all duration-500`}
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{
                    opacity: idx === 1 ? 1 : 0.6,
                    scale: idx === 1 ? 1 : 0.85,
                    y: idx === 1 ? 0 : 20,
                    filter: idx === 1 ? 'blur(0px)' : 'blur(1px)',
                  }}
                  transition={{ delay: idx * 0.1 }}
                  whileHover={idx === 1 ? { scale: 1.02 } : {}}
                >
                  {idx === 1 && (
                    <motion.div
                      className="absolute -inset-3 rounded-[32px] border border-orange-400/35 bg-[radial-gradient(circle_at_top,rgba(249,115,22,0.12),transparent_45%)]"
                      animate={{
                        boxShadow: [
                          '0 0 20px rgba(249,115,22,0.16)',
                          '0 0 38px rgba(249,115,22,0.28)',
                          '0 0 20px rgba(249,115,22,0.16)',
                        ],
                      }}
                      transition={{ duration: 2.6, repeat: Infinity }}
                    />
                  )}
                  <GameCard game={game} onClick={() => idx === 1 && onGameClick(game)} />
                </motion.div>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>

        <motion.div
          className="absolute inset-0 pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: isHovering ? 0.1 : 0 }}
          transition={{ duration: 0.3 }}
          style={{
            background: 'radial-gradient(circle at center, rgba(220, 38, 38, 0.3), transparent 70%)',
          }}
        />
      </div>

      <div className="mt-8 flex justify-center gap-2">
        {games.map((_, index) => (
          <motion.button
            key={index}
            onClick={() => {
              const diff = index - gameIndex;
              paginate(diff > 0 ? 1 : -1);
            }}
            className={`h-2 rounded-full transition-all ${
              index === gameIndex ? 'w-12' : 'w-2'
            }`}
            animate={{
              backgroundColor: index === gameIndex ? '#dc2626' : '#4b5563',
              boxShadow: index === gameIndex ? '0 0 20px rgba(220, 38, 38, 0.8)' : 'none',
            }}
            whileHover={{ scale: 1.5 }}
            whileTap={{ scale: 0.9 }}
          />
        ))}
      </div>
    </div>
  );
}
