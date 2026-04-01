import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { Game } from '../data/games';

interface DynamicBackgroundProps {
  selectedGame: Game | null;
  theme: 'cyberpunk' | 'space' | 'retro' | 'neon';
}

export default function DynamicBackground({ selectedGame, theme }: DynamicBackgroundProps) {
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number; size: number }>>([]);

  useEffect(() => {
    const generateParticles = () => {
      const newParticles = Array.from({ length: 50 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 4 + 1,
      }));
      setParticles(newParticles);
    };

    generateParticles();
  }, [theme]);

  const getThemeStyles = () => {
    const color = selectedGame?.glowColor || '#dc2626';

    switch (theme) {
      case 'cyberpunk':
        return {
          background: `radial-gradient(circle at 30% 50%, ${color}15, transparent 70%), radial-gradient(circle at 70% 50%, #00f7ff15, transparent 70%)`,
          particleColor: color,
        };
      case 'space':
        return {
          background: `radial-gradient(circle at 50% 50%, ${color}10, transparent 80%), radial-gradient(circle at 20% 80%, #ffffff05, transparent 60%)`,
          particleColor: '#ffffff',
        };
      case 'retro':
        return {
          background: `linear-gradient(180deg, ${color}08 0%, transparent 50%, ${color}08 100%)`,
          particleColor: color,
        };
      case 'neon':
      default:
        return {
          background: `radial-gradient(circle at 40% 40%, ${color}20, transparent 60%), radial-gradient(circle at 60% 60%, ${color}10, transparent 70%)`,
          particleColor: color,
        };
    }
  };

  const styles = getThemeStyles();

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      <motion.div
        className="absolute inset-0"
        animate={{
          background: styles.background,
        }}
        transition={{ duration: 1.5 }}
      />

      <motion.div
        className="absolute inset-0"
        animate={{
          background: [
            'linear-gradient(0deg, transparent 0%, rgba(0,0,0,0) 100%)',
            'linear-gradient(180deg, transparent 0%, rgba(0,0,0,0) 100%)',
            'linear-gradient(0deg, transparent 0%, rgba(0,0,0,0) 100%)',
          ],
        }}
        transition={{ duration: 10, repeat: Infinity }}
      />

      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute rounded-full"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            background: styles.particleColor,
            boxShadow: `0 0 ${particle.size * 3}px ${styles.particleColor}`,
          }}
          animate={{
            y: [0, -30, 0],
            x: [0, Math.random() * 20 - 10, 0],
            opacity: [0.2, 0.8, 0.2],
            scale: [1, 1.5, 1],
          }}
          transition={{
            duration: 3 + Math.random() * 4,
            repeat: Infinity,
            delay: Math.random() * 2,
          }}
        />
      ))}

      <motion.div
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.1) 1px, transparent 1px)',
          backgroundSize: '50px 50px',
        }}
        animate={{
          backgroundPosition: ['0px 0px', '50px 50px'],
        }}
        transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
      />
    </div>
  );
}
