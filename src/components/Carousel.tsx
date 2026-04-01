import { useState, useRef, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import GameCard from './GameCard';
import { Game } from '../data/games';

interface CarouselProps {
  games: Game[];
  onGameClick: (game: Game) => void;
  title: string;
}

export default function Carousel({ games, onGameClick, title }: CarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);

  const itemsPerView = 3;
  const maxIndex = Math.max(0, games.length - itemsPerView);

  const goToNext = useCallback(() => {
    setCurrentIndex((prev) => Math.min(prev + 1, maxIndex));
  }, [maxIndex]);

  const goToPrev = useCallback(() => {
    setCurrentIndex((prev) => Math.max(prev - 1, 0));
  }, []);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setStartX(e.pageX - (carouselRef.current?.offsetLeft || 0));
    setScrollLeft(carouselRef.current?.scrollLeft || 0);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - (carouselRef.current?.offsetLeft || 0);
    const walk = (x - startX) * 2;
    if (carouselRef.current) {
      carouselRef.current.scrollLeft = scrollLeft - walk;
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true);
    setStartX(e.touches[0].pageX - (carouselRef.current?.offsetLeft || 0));
    setScrollLeft(carouselRef.current?.scrollLeft || 0);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    const x = e.touches[0].pageX - (carouselRef.current?.offsetLeft || 0);
    const walk = (x - startX) * 2;
    if (carouselRef.current) {
      carouselRef.current.scrollLeft = scrollLeft - walk;
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        goToPrev();
      } else if (e.key === 'ArrowRight') {
        goToNext();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [goToNext, goToPrev]);

  return (
    <div className="relative w-full">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-3xl font-bold text-white">{title}</h2>
        <div className="flex gap-2">
          <button
            onClick={goToPrev}
            disabled={currentIndex === 0}
            className="rounded-full bg-gray-800 p-3 text-white transition-all hover:bg-red-600 disabled:opacity-30 disabled:hover:bg-gray-800"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          <button
            onClick={goToNext}
            disabled={currentIndex === maxIndex}
            className="rounded-full bg-gray-800 p-3 text-white transition-all hover:bg-red-600 disabled:opacity-30 disabled:hover:bg-gray-800"
          >
            <ChevronRight className="h-6 w-6" />
          </button>
        </div>
      </div>

      <div
        ref={carouselRef}
        className={`flex gap-6 overflow-x-auto scroll-smooth ${
          isDragging ? 'cursor-grabbing' : 'cursor-grab'
        } scrollbar-hide`}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        style={{
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
        }}
      >
        {games.map((game) => (
          <div
            key={game.id}
            className="min-w-[calc(33.333%-1rem)] flex-shrink-0 md:min-w-[calc(33.333%-1rem)] sm:min-w-[calc(50%-0.75rem)] xs:min-w-[calc(100%-1rem)]"
          >
            <GameCard game={game} onClick={() => onGameClick(game)} />
          </div>
        ))}
      </div>

      <div className="mt-6 flex justify-center gap-2">
        {Array.from({ length: games.length }).map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(Math.min(index, maxIndex))}
            className={`h-2 rounded-full transition-all ${
              index >= currentIndex && index < currentIndex + itemsPerView
                ? 'w-8 bg-red-600'
                : 'w-2 bg-gray-600'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
