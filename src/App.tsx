import type { ReactNode } from 'react';
import { useState, useEffect, useCallback, useRef } from 'react';
import { Gamepad2, Search, User, Menu, Flame, Filter, RotateCcw, Zap, ShieldCheck, Trophy, Radio, ChevronRight, X, Crown, Headphones, Sparkles, Command, ArrowUpRight } from 'lucide-react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import EnhancedCarousel from './components/EnhancedCarousel';
import GameCard from './components/GameCard';
import VideoPlayer from './components/VideoPlayer';
import CustomCursor from './components/CustomCursor';
import DynamicBackground from './components/DynamicBackground';
import LoadingScreen from './components/LoadingScreen';
import { games, Game } from './data/games';
import { useKeyboardNavigation } from './hooks/useKeyboardNavigation';
import { useSwipeGesture } from './hooks/useSwipeGesture';
import { playWhooshSound } from './utils/soundEffects';

function App() {
  const heroRef = useRef<HTMLElement | null>(null);
  const [isBooting, setIsBooting] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [lastPlayedGame, setLastPlayedGame] = useState<Game | null>(null);
  const [currentTheme, setCurrentTheme] = useState<'cyberpunk' | 'space' | 'retro' | 'neon'>('neon');

  const categories = ['All', ...Array.from(new Set(games.map((game) => game.category)))];
  const heroStats = [
    { label: 'Live Arenas', value: '24', icon: Radio },
    { label: 'Verified Titles', value: '120+', icon: ShieldCheck },
    { label: 'Weekly Tournaments', value: '08', icon: Trophy },
  ];
  const menuLinks = [
    { label: 'Continue Playing', href: '#continue' },
    { label: 'Featured', href: '#featured' },
    { label: 'Trending', href: '#trending' },
    { label: 'Prime Access', href: '#prime' },
  ];
  const footerColumns = [
    {
      title: 'Platform',
      links: ['Prime Library', 'Live Showcases', 'Arena Rankings'],
    },
    {
      title: 'Support',
      links: ['Help Center', 'Priority Contact', 'FAQ'],
    },
    {
      title: 'Community',
      links: ['Tournaments', 'Discord', 'Creator Program'],
    },
    {
      title: 'Legal',
      links: ['Privacy Policy', 'Terms of Service', 'Cookie Policy'],
    },
  ];
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });
  const heroImageY = useTransform(scrollYProgress, [0, 1], ['0%', '10%']);
  const heroContentY = useTransform(scrollYProgress, [0, 1], ['0%', '18%']);
  const heroGlowOpacity = useTransform(scrollYProgress, [0, 1], [0.35, 0.12]);

  const filteredGames = games.filter((game) => {
    const matchesSearch = game.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || game.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const recommendedGames = selectedGame
    ? games.filter((g) => g.category === selectedGame.category && g.id !== selectedGame.id)
    : [];
  const searchResults = (searchQuery.trim() ? filteredGames : games).slice(0, 4);
  const shouldShowSearchPanel = isSearchFocused && (searchQuery.trim().length > 0 || searchResults.length > 0);
  const primaryButtonClass = 'inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-orange-500 via-red-500 to-red-600 px-7 py-4 text-sm font-bold uppercase tracking-[0.16em] text-white shadow-[0_0_30px_rgba(249,115,22,0.24)] transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_38px_rgba(249,115,22,0.34)]';
  const secondaryButtonClass = 'inline-flex items-center justify-center gap-2 rounded-2xl border border-white/15 bg-white/5 px-7 py-4 text-sm font-bold uppercase tracking-[0.16em] text-white backdrop-blur-xl transition-all duration-300 hover:scale-[1.02] hover:border-orange-400/60 hover:bg-white/10';

  const { focusedIndex } = useKeyboardNavigation(filteredGames.length, (index) => {
    setSelectedGame(filteredGames[index]);
  });

  useEffect(() => {
    const progressTimer = window.setInterval(() => {
      setLoadingProgress((prev) => {
        if (prev >= 100) {
          window.clearInterval(progressTimer);
          return 100;
        }

        const increment = prev < 45 ? 11 : prev < 80 ? 7 : 4;
        return Math.min(prev + increment, 100);
      });
    }, 120);

    const bootTimer = window.setTimeout(() => {
      setLoadingProgress(100);
      setIsBooting(false);
    }, 1700);

    return () => {
      window.clearInterval(progressTimer);
      window.clearTimeout(bootTimer);
    };
  }, []);

  useEffect(() => {
    const lastGameId = localStorage.getItem('lastPlayedGame');
    if (lastGameId) {
      const game = games.find((g) => g.id === parseInt(lastGameId));
      if (game) {
        setLastPlayedGame(game);
      }
    }
  }, []);

  useEffect(() => {
    if (selectedGame) {
      localStorage.setItem('lastPlayedGame', selectedGame.id.toString());
      setLastPlayedGame(selectedGame);
      setCurrentTheme(selectedGame.theme);
    }
  }, [selectedGame]);

  const handleGameClick = useCallback((game: Game) => {
    playWhooshSound();
    setSelectedGame(game);
    setIsSearchFocused(false);
  }, []);

  useSwipeGesture({
    onSwipeLeft: () => {
      if (selectedGame) {
        setSelectedGame(null);
      }
    },
    onSwipeRight: () => {
      if (selectedGame) {
        setSelectedGame(null);
      }
    },
  });

  useEffect(() => {
    document.body.style.cursor = 'none';
    return () => {
      document.body.style.cursor = 'auto';
    };
  }, []);

  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = '';
      };
    }

    document.body.style.overflow = '';
  }, [isMenuOpen]);

  return (
    <div className="min-h-screen bg-black relative overflow-x-hidden">
      {!isBooting && <CustomCursor />}
      <DynamicBackground selectedGame={selectedGame || lastPlayedGame} theme={currentTheme} />
      <AnimatePresence>{isBooting && <LoadingScreen progress={loadingProgress} />}</AnimatePresence>

      <nav className="fixed top-0 z-40 w-full border-b border-gray-800/50 bg-black/90 backdrop-blur-xl">
        <div className="mx-auto max-w-7xl px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-8">
              <div className="flex items-center gap-2 cursor-hover">
                <div className="relative">
                  <Gamepad2 className="h-8 w-8 text-red-600" />
                  <div className="absolute inset-0 h-8 w-8 animate-pulse rounded-full bg-red-600/20 blur-lg" />
                </div>
                <div>
                  <span
                    className="text-2xl font-bold text-white"
                    style={{ textShadow: '0 0 20px rgba(220, 38, 38, 0.5)' }}
                  >
                    GameVerse
                  </span>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-gray-500">
                    Arena Prime
                  </p>
                </div>
              </div>

              <div className="hidden items-center gap-6 md:flex">
                <a
                  href="#continue"
                  className="cursor-hover text-gray-300 transition-all hover:text-red-600 hover:drop-shadow-[0_0_8px_rgba(220,38,38,0.8)]"
                >
                  Continue Playing
                </a>
                <a
                  href="#featured"
                  className="cursor-hover text-gray-300 transition-all hover:text-red-600 hover:drop-shadow-[0_0_8px_rgba(220,38,38,0.8)]"
                >
                  Featured
                </a>
                <a
                  href="#trending"
                  className="cursor-hover text-gray-300 transition-all hover:text-red-600 hover:drop-shadow-[0_0_8px_rgba(220,38,38,0.8)]"
                >
                  Trending
                </a>
                <div className="rounded-full border border-red-500/30 bg-red-500/10 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.24em] text-red-300">
                  Prime Access
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="relative hidden md:block">
                <input
                  type="text"
                  placeholder="Search games..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setIsSearchFocused(true)}
                  onBlur={() => {
                    window.setTimeout(() => {
                      setIsSearchFocused(false);
                    }, 120);
                  }}
                  className="cursor-hover w-64 rounded-full bg-gray-800/60 px-4 py-2 pl-10 text-sm text-white placeholder-gray-400 backdrop-blur-sm transition-all focus:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-red-600"
                />
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />

                <AnimatePresence>
                  {shouldShowSearchPanel && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 6 }}
                      className="absolute right-0 top-[calc(100%+14px)] z-50 w-[380px] overflow-hidden rounded-[28px] border border-white/10 bg-[radial-gradient(circle_at_top,rgba(249,115,22,0.16),transparent_28%),linear-gradient(180deg,#0b0d12,#050608)] shadow-[0_0_40px_rgba(249,115,22,0.12)] backdrop-blur-2xl"
                    >
                      <div className="border-b border-white/10 px-5 py-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-orange-300">
                              Search Command
                            </p>
                            <p className="mt-1 text-sm text-gray-400">
                              {searchQuery.trim() ? `Top matches for "${searchQuery}"` : 'Popular picks right now'}
                            </p>
                          </div>
                          <div className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-gray-300">
                            {searchResults.length} results
                          </div>
                        </div>
                      </div>

                      <div className="p-3">
                        {searchResults.length > 0 ? (
                          <div className="space-y-2">
                            {searchResults.map((game) => (
                              <button
                                key={game.id}
                                onMouseDown={(e) => e.preventDefault()}
                                onClick={() => {
                                  setSearchQuery(game.title);
                                  handleGameClick(game);
                                }}
                                className="flex w-full items-center gap-4 rounded-2xl border border-white/10 bg-white/5 px-3 py-3 text-left transition-all hover:border-orange-400/50 hover:bg-white/10"
                              >
                                <img
                                  src={game.image}
                                  alt={game.title}
                                  className="h-14 w-16 rounded-xl object-cover"
                                />
                                <div className="min-w-0 flex-1">
                                  <p className="truncate text-sm font-bold text-white">{game.title}</p>
                                  <p className="mt-1 text-xs uppercase tracking-[0.18em] text-gray-400">
                                    {game.category} • {game.duration} • Age {game.ageLimit}
                                  </p>
                                </div>
                                <ArrowUpRight className="h-4 w-4 text-orange-300" />
                              </button>
                            ))}
                          </div>
                        ) : (
                          <div className="rounded-2xl border border-dashed border-white/10 px-4 py-8 text-center text-sm text-gray-400">
                            No games match your search yet.
                          </div>
                        )}
                      </div>

                      <div className="flex items-center justify-between border-t border-white/10 px-5 py-3 text-[11px] uppercase tracking-[0.22em] text-gray-500">
                        <span className="flex items-center gap-2"><Command className="h-3.5 w-3.5" /> Premium search</span>
                        <span>Press enter to launch</span>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              <button className="cursor-hover rounded-full bg-gray-800/60 p-2 text-white backdrop-blur-sm transition-all hover:bg-red-600 hover:shadow-[0_0_20px_rgba(220,38,38,0.6)] md:hidden">
                <Search className="h-5 w-5" />
              </button>
              <button className="cursor-hover rounded-full bg-gray-800/60 p-2 text-white backdrop-blur-sm transition-all hover:bg-red-600 hover:shadow-[0_0_20px_rgba(220,38,38,0.6)]">
                <User className="h-5 w-5" />
              </button>
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="cursor-hover rounded-full bg-gray-800/60 p-2 text-white backdrop-blur-sm transition-all hover:bg-red-600 hover:shadow-[0_0_20px_rgba(220,38,38,0.6)] md:hidden"
              >
                <Menu className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] md:hidden"
          >
            <button
              aria-label="Close mobile menu"
              className="absolute inset-0 bg-black/80 backdrop-blur-xl"
              onClick={() => setIsMenuOpen(false)}
            />

            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 240, damping: 28 }}
              className="absolute right-0 top-0 flex h-full w-[88%] max-w-sm flex-col border-l border-white/10 bg-[radial-gradient(circle_at_top,rgba(249,115,22,0.18),transparent_30%),linear-gradient(180deg,#090b10,#040506)] p-6 shadow-[0_0_60px_rgba(239,68,68,0.14)]"
            >
              <div className="mb-8 flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.34em] text-orange-400">
                    GameVerse
                  </p>
                  <h2 className="mt-2 text-2xl font-black text-white">Arena Prime</h2>
                </div>
                <button
                  onClick={() => setIsMenuOpen(false)}
                  className="rounded-full border border-white/10 bg-white/5 p-2 text-white"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="mb-8 rounded-3xl border border-white/10 bg-white/5 p-4 backdrop-blur-lg">
                <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-gray-400">
                  Premium Access
                </p>
                <p className="mt-3 text-lg font-bold text-white">
                  Fast discovery, richer visuals, sharper game selection.
                </p>
              </div>

              <div className="space-y-3">
                {menuLinks.map((link, index) => (
                  <motion.a
                    key={link.label}
                    href={link.href}
                    onClick={() => setIsMenuOpen(false)}
                    initial={{ opacity: 0, x: 24 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.08 + index * 0.08 }}
                    className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-4 text-base font-semibold text-white backdrop-blur-lg"
                  >
                    <span>{link.label}</span>
                    <ChevronRight className="h-4 w-4 text-orange-300" />
                  </motion.a>
                ))}
              </div>

              <div className="mt-auto grid gap-3 rounded-3xl border border-white/10 bg-black/30 p-4 backdrop-blur-lg">
                <PremiumMenuStat icon={<Crown className="h-4 w-4" />} label="Prime ready" value="Elite UI" />
                <PremiumMenuStat icon={<Headphones className="h-4 w-4" />} label="Session audio" value="Immersive" />
                <PremiumMenuStat icon={<Sparkles className="h-4 w-4" />} label="Curated flow" value="High-end" />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <section ref={heroRef} className="relative min-h-screen overflow-hidden pt-20">
        <motion.div className="absolute inset-0" style={{ y: heroImageY }}>
          <motion.img
            src="/images/escape_the_lava copy copy.jpg"
            alt="Featured Game"
            className="h-full w-full object-cover object-[center_18%] scale-[1.03]"
            style={{ scale: 1.05 }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/50" />
          <motion.div
            className="absolute inset-0 opacity-30"
            style={{
              opacity: heroGlowOpacity,
              background:
                'radial-gradient(circle at 30% 50%, rgba(255, 107, 0, 0.2), transparent 50%)',
            }}
          />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(255,255,255,0.08),transparent_20%)]" />
        </motion.div>

        <motion.div
          className="relative mx-auto flex min-h-[calc(100vh-5rem)] max-w-7xl items-center px-6 py-16 sm:py-20 lg:justify-between lg:gap-14 lg:py-24"
          style={{ y: heroContentY }}
        >
          <div className="max-w-2xl space-y-6 slide-in-up lg:space-y-8">
            <div className="flex items-center gap-2">
              <Flame className="h-6 w-6 text-orange-500 neon-glow" />
              <span
                className="text-sm font-bold uppercase tracking-wider"
                style={{
                  color: '#ff6b00',
                  textShadow: '0 0 20px rgba(255, 107, 0, 0.8)',
                }}
              >
                Featured Game
              </span>
              <span className="rounded-full border border-orange-400/40 bg-orange-500/10 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.24em] text-orange-200">
                Editor's Elite Pick
              </span>
            </div>

            <h1
              className="text-5xl font-bold text-white sm:text-6xl lg:text-7xl"
              style={{
                textShadow: '0 0 40px rgba(255, 107, 0, 0.4), 0 4px 20px rgba(0,0,0,0.8)',
              }}
            >
              Escape The Lava
            </h1>

            <p className="max-w-xl text-lg leading-relaxed text-gray-200 sm:text-xl">
              Navigate through treacherous terrain and escape the rising lava. Test your reflexes
              and survival skills in this intense platformer adventure.
            </p>

            <div className="flex flex-wrap items-center gap-4">
              <button
                onClick={() => setSelectedGame(games[0])}
                className={`${primaryButtonClass} cursor-hover`}
              >
                <Gamepad2 className="h-6 w-6" />
                Play Now
              </button>
              <button className={`${secondaryButtonClass} cursor-hover`}>
                More Info
              </button>
            </div>

            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400 sm:gap-6">
              <span
                className="rounded-full px-5 py-2 font-bold text-white shadow-lg"
                style={{
                  background: 'linear-gradient(135deg, #ff6b00, #ff8800)',
                  boxShadow: '0 0 30px rgba(255, 107, 0, 0.5)',
                }}
              >
                Adventure
              </span>
              <span>Rating: 4.8/5.0</span>
              <span>1 Player</span>
            </div>

            <div className="grid gap-4 pt-4 sm:grid-cols-3">
              {heroStats.map((stat, index) => {
                const Icon = stat.icon;

                return (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 18 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 + index * 0.1 }}
                    className="rounded-2xl border border-white/10 bg-black/35 p-4 backdrop-blur-xl shadow-[0_0_24px_rgba(0,0,0,0.2)]"
                  >
                    <div className="mb-3 flex items-center justify-between">
                      <span className="rounded-xl bg-white/5 p-2 text-orange-300">
                        <Icon className="h-4 w-4" />
                      </span>
                      <span className="text-[11px] font-semibold uppercase tracking-[0.24em] text-gray-500">
                        Live
                      </span>
                    </div>
                    <p className="text-2xl font-black text-white">{stat.value}</p>
                    <p className="mt-1 text-sm text-gray-400">{stat.label}</p>
                  </motion.div>
                );
              })}
            </div>
          </div>

        </motion.div>
      </section>

      <main className="relative space-y-16 px-6 py-16">
        <div className="mx-auto max-w-7xl">
          <motion.section
            id="continue"
            className="mb-20 scroll-mt-28"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6 }}
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8 flex items-center gap-3"
            >
              <RotateCcw className="h-8 w-8 text-red-600" />
              <h2 className="text-4xl font-bold text-white">Continue Playing</h2>
            </motion.div>

            {lastPlayedGame ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="max-w-md"
              >
                <GameCard game={lastPlayedGame} onClick={() => handleGameClick(lastPlayedGame)} />
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-3xl overflow-hidden rounded-3xl border border-gray-800 bg-gradient-to-br from-gray-900 via-black to-gray-950 p-8 shadow-[0_0_40px_rgba(220,38,38,0.12)]"
              >
                <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
                  <div className="space-y-2">
                    <p className="text-sm font-semibold uppercase tracking-[0.24em] text-red-500">
                      No Recent Game Found
                    </p>
                    <h3 className="text-2xl font-bold text-white">Pick a game to start your streak</h3>
                    <p className="max-w-xl text-base leading-relaxed text-gray-400">
                      Your recently played game will show up here once you launch one from the
                      library or the featured section.
                    </p>
                  </div>

                  <a
                    href="#featured"
                    className={primaryButtonClass}
                  >
                    Explore Games
                  </a>
                </div>
              </motion.div>
            )}
          </motion.section>

          <motion.section
            className="mb-16 rounded-[32px] border border-white/5 bg-[linear-gradient(180deg,rgba(255,255,255,0.03),rgba(255,255,255,0))] p-6 sm:p-8"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.18 }}
            transition={{ duration: 0.65 }}
          >
            <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <Filter className="h-8 w-8 text-red-600" />
                <div>
                  <h2 className="text-4xl font-bold text-white">Browse Games</h2>
                  <p className="mt-1 text-sm uppercase tracking-[0.22em] text-gray-500">
                    Curated by genre, difficulty, and crowd energy
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`cursor-hover rounded-full px-5 py-2 text-sm font-bold transition-all ${
                      selectedCategory === category
                        ? 'bg-gradient-to-r from-red-600 to-orange-600 text-white shadow-lg shadow-red-600/50'
                        : 'bg-gray-800/60 text-gray-300 hover:bg-gray-700 hover:text-white'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
            <motion.div
              className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3"
              layout
            >
              {filteredGames.map((game, index) => (
                <motion.div
                  key={game.id}
                  layout
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <GameCard
                    game={game}
                    onClick={() => handleGameClick(game)}
                    isFocused={index === focusedIndex}
                  />
                </motion.div>
              ))}
            </motion.div>
          </motion.section>

          {recommendedGames.length > 0 && (
            <motion.section
              id="recommended"
              className="mb-20"
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.6 }}
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8 flex items-center gap-3"
              >
                <Zap className="h-8 w-8 text-red-600" />
                <h2 className="text-4xl font-bold text-white">Recommended for You</h2>
              </motion.div>
              <EnhancedCarousel
                games={recommendedGames}
                onGameClick={handleGameClick}
                title="Based on your interests"
              />
            </motion.section>
          )}

          <motion.section
            id="featured"
            className="mb-20"
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.18 }}
            transition={{ duration: 0.6 }}
          >
            <EnhancedCarousel games={games} onGameClick={handleGameClick} title="Trending Now" />
          </motion.section>

          <motion.section
            id="trending"
            className="mb-20"
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.18 }}
            transition={{ duration: 0.6 }}
          >
            <EnhancedCarousel
              games={[...games].reverse()}
              onGameClick={handleGameClick}
              title="Hot Games"
            />
          </motion.section>

          <motion.section
            id="prime"
            className="mb-20 overflow-hidden rounded-[36px] border border-white/10 bg-[radial-gradient(circle_at_top_left,rgba(249,115,22,0.18),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(239,68,68,0.18),transparent_28%),linear-gradient(135deg,#0a0d14,#050608)] p-8 shadow-[0_0_50px_rgba(239,68,68,0.08)] sm:p-10"
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.18 }}
            transition={{ duration: 0.65 }}
          >
            <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
              <div className="max-w-2xl">
                <p className="text-sm font-semibold uppercase tracking-[0.34em] text-orange-400">
                  Prime Membership
                </p>
                <h2 className="mt-3 text-3xl font-black text-white sm:text-4xl">
                  Elevate every match with a sharper, premium gaming experience
                </h2>
                <p className="mt-4 text-base leading-relaxed text-gray-300 sm:text-lg">
                  Discover featured rooms faster, track competitive titles, and step into a more
                  refined game selection hub built for players who like their platform to feel
                  elite.
                </p>
              </div>

              <div className="grid gap-4 sm:min-w-[320px]">
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-lg">
                  <p className="text-sm font-semibold text-white">Priority discovery lanes</p>
                  <p className="mt-1 text-sm text-gray-400">
                    Better surfacing for featured drops, trending rooms, and premium showcases.
                  </p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-lg">
                  <p className="text-sm font-semibold text-white">Immersive showcase design</p>
                  <p className="mt-1 text-sm text-gray-400">
                    Cinematic visuals, stronger hierarchy, and cleaner gaming-brand presentation.
                  </p>
                </div>
                <button className={primaryButtonClass}>
                  Unlock Prime Feel
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </motion.section>
        </div>
      </main>

      <footer className="relative z-10 overflow-hidden border-t border-white/10 bg-[radial-gradient(circle_at_top,rgba(249,115,22,0.12),transparent_20%),linear-gradient(180deg,#07090d,#020304)] py-14">
        <div className="absolute inset-0 opacity-20 [background-image:linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] [background-size:40px_40px]" />
        <div className="relative mx-auto max-w-7xl px-6">
          <div className="mb-12 grid gap-8 rounded-[32px] border border-white/10 bg-white/[0.03] p-8 backdrop-blur-2xl lg:grid-cols-[1.3fr_1fr]">
            <div>
              <div className="mb-5 flex items-center gap-3">
                <div className="rounded-2xl bg-gradient-to-br from-orange-500 to-red-600 p-3 shadow-[0_0_28px_rgba(249,115,22,0.3)]">
                  <Gamepad2 className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="text-2xl font-black text-white">GameVerse Arena</p>
                  <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gray-500">
                    Prime-tier game discovery
                  </p>
                </div>
              </div>
              <p className="max-w-2xl text-base leading-relaxed text-gray-300">
                A sharper gaming showcase built to feel premium, immersive, and confidently ahead of
                ordinary library interfaces.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
              <FooterBadge title="Discovery Engine" value="Curated" />
              <FooterBadge title="Visual Identity" value="Exclusive" />
              <FooterBadge title="Player Mood" value="Elite" />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-10 md:grid-cols-2 xl:grid-cols-5">
            <div className="xl:col-span-1">
              <p className="text-sm font-semibold uppercase tracking-[0.34em] text-orange-400">
                Prime Access
              </p>
              <h3 className="mt-3 text-3xl font-black text-white">Stay on top of the field</h3>
              <p className="mt-3 text-sm leading-relaxed text-gray-400">
                Premium presentation, premium motion, and premium discovery flow for standout player perception.
              </p>
            </div>

            {footerColumns.map((column) => (
              <div key={column.title}>
                <h3 className="mb-4 text-sm font-bold uppercase tracking-[0.24em] text-white">
                  {column.title}
                </h3>
                <ul className="space-y-3 text-sm text-gray-400">
                  {column.links.map((link) => (
                    <li key={link}>
                      <a href="#" className="cursor-hover transition-colors hover:text-orange-300">
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="mt-12 flex flex-col gap-4 border-t border-white/10 pt-8 text-sm text-gray-500 md:flex-row md:items-center md:justify-between">
            <p>&copy; 2024 GameVerse Arena. Crafted for a premium gaming presence.</p>
            <div className="flex items-center gap-4">
              <span>Performance-led UI</span>
              <span>Immersive platform feel</span>
              <span>Prime presentation</span>
            </div>
          </div>
        </div>
      </footer>

      <VideoPlayer game={selectedGame} onClose={() => setSelectedGame(null)} />
    </div>
  );
}

export default App;

function PremiumMenuStat({ icon, label, value }: { icon: ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
      <div className="flex items-center gap-3 text-sm text-gray-300">
        <span className="text-orange-300">{icon}</span>
        <span>{label}</span>
      </div>
      <span className="text-sm font-semibold text-white">{value}</span>
    </div>
  );
}

function PrestigeRow({ title, value }: { title: string; value: string }) {
  return (
    <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
      <span className="text-sm text-gray-300">{title}</span>
      <span className="text-sm font-bold uppercase tracking-[0.2em] text-orange-300">{value}</span>
    </div>
  );
}

function FooterBadge({ title, value }: { title: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-black/35 px-4 py-4">
      <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-gray-500">{title}</p>
      <p className="mt-2 text-lg font-black text-white">{value}</p>
    </div>
  );
}
