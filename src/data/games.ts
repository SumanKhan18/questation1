export interface Game {
  id: number;
  title: string;
  image: string;
  category: string;
  description: string;
  videoUrl: string;
  rating: number;
  players: string;
  duration: string;
  ageLimit: string;
  glowColor: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  tags: string[];
  theme: 'cyberpunk' | 'space' | 'retro' | 'neon';
  previewVideo?: string;
}

const sharedVideoUrl = "https://drive.google.com/file/d/1w-hKYupz13P5EsISiwtFIAcSJ7qAgcps/view?usp=sharing";

export const games: Game[] = [
  {
    id: 1,
    title: "Escape The Lava",
    image: "/images/escape_the_lava copy copy.jpg",
    category: "Adventure",
    description: "Navigate through treacherous terrain and escape the rising lava. Test your reflexes and survival skills in this intense platformer adventure.",
    videoUrl: sharedVideoUrl,
    rating: 4.8,
    players: "1 Player",
    duration: "12-18 min",
    ageLimit: "12+",
    glowColor: "#ff6b00",
    difficulty: "Hard",
    tags: ["Popular", "New"],
    theme: "neon",
    previewVideo: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
  },
  {
    id: 2,
    title: "Find The Color",
    image: "/images/find_the_color copy.jpg",
    category: "Puzzle",
    description: "Race against time to identify and select the correct colors. Challenge your perception and reaction speed in this vibrant puzzle game.",
    videoUrl: sharedVideoUrl,
    rating: 4.7,
    players: "1-2 Players",
    duration: "5-10 min",
    ageLimit: "6+",
    glowColor: "#00f7ff",
    difficulty: "Easy",
    tags: ["Casual", "Popular"],
    theme: "cyberpunk",
    previewVideo: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4"
  },
  {
    id: 3,
    title: "Red Light Green Light",
    image: "/images/red_light_green_light copy copy.jpg",
    category: "Action",
    description: "Stop when the light is red, move when it's green. One wrong move and you're out. Can you survive and reach the finish line?",
    videoUrl: sharedVideoUrl,
    rating: 4.9,
    players: "2-4 Players",
    duration: "8-15 min",
    ageLimit: "10+",
    glowColor: "#00ff41",
    difficulty: "Medium",
    tags: ["Multiplayer", "Popular"],
    theme: "retro",
    previewVideo: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4"
  },
  {
    id: 4,
    title: "Sharp Shooter",
    image: "/images/shooter copy copy.jpg",
    category: "Shooter",
    description: "Fast-paced multiplayer shooter action. Compete in intense battles and prove you're the sharpest shooter in the arena.",
    videoUrl: sharedVideoUrl,
    rating: 4.9,
    players: "1-8 Players",
    duration: "15-25 min",
    ageLimit: "16+",
    glowColor: "#ff0055",
    difficulty: "Hard",
    tags: ["Competitive", "New"],
    theme: "space",
    previewVideo: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4"
  }
];
