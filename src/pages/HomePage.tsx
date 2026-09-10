import { Link } from 'react-router-dom';
import { ScanLine, Play, Sparkles, Leaf, GraduationCap, Briefcase, Recycle, Users, BookOpen, ChevronRight } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen mandala-bg">
      {/* Hero Section */}
      <header className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-saffron-900/20 via-transparent to-transparent" />
        <div className="relative max-w-5xl mx-auto px-6 pt-20 pb-12 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-saffron-500/10 border border-saffron-500/30 text-saffron-300 text-sm font-medium mb-6 animate-fade-in">
            <Sparkles size={14} />
            An Interactive Board Game Experience
          </div>
          <h1 className="text-5xl md:text-7xl font-bold text-saffron-200 mb-4 animate-slide-up tracking-wide">
            JANMA
          </h1>
          <p className="text-xl md:text-2xl text-marigold-300/80 font-display italic mb-8 animate-slide-up">
            Walk in My Shoes
          </p>
          <p className="max-w-2xl mx-auto text-ink-200 text-lg leading-relaxed mb-10 animate-fade-in">
            Step into the world of medieval India. Experience life through the eyes of a character
            shaped by fate — their caste, their wealth, their occupation — all decided by chance.
            Every player walks a different path. Every choice defines who wins.
          </p>
          <div className="flex flex-wrap justify-center gap-4 animate-scale-in">
            <Link to="/scan" className="btn-primary">
              <ScanLine size={20} />
              Scan QR Code
            </Link>
            <Link to="/qr-codes" className="btn-secondary">
              <BookOpen size={20} />
              View Room QR Codes
            </Link>
          </div>
        </div>
      </header>

      {/* SDG Section */}
      <section className="max-w-5xl mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <h2 className="section-title text-center">Aligned with UN Sustainable Development Goals</h2>
          <p className="text-ink-300 max-w-2xl mx-auto mt-2">
            JANMA is more than a game — it's a tool for empathy, education, and sustainable practice.
          </p>
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          <SDGCard
            icon={<Users size={28} />}
            number="10"
            title="Reduced Inequalities"
            color="from-pink-600/20 to-pink-700/10 border-pink-500/30"
            accent="text-pink-300"
            description="No matter your character's occupation, social status, or wealth, the choices you make determine who wins the game. Every player starts on equal footing — as a human navigating their fate."
          />
          <SDGCard
            icon={<GraduationCap size={28} />}
            number="4"
            title="Quality Education"
            color="from-red-600/20 to-red-700/10 border-red-500/30"
            accent="text-red-300"
            description="Educates players about the cultural and historical aspects of medieval Indian civilizations — their social structures, occupations, regions, and daily realities."
          />
          <SDGCard
            icon={<Briefcase size={28} />}
            number="8"
            title="Decent Work & Economic Growth"
            color="from-forest-600/20 to-forest-700/10 border-forest-500/30"
            accent="text-forest-300"
            description="Supports local artisans who create the physical game components — the board, the pieces, the cards — sustaining traditional craft livelihoods."
          />
          <SDGCard
            icon={<Recycle size={28} />}
            number="12"
            title="Responsible Consumption"
            color="from-terracotta-600/20 to-terracotta-700/10 border-terracotta-500/30"
            accent="text-terracotta-300"
            description="Uses recyclable board materials, ensuring the physical game has minimal environmental impact while delivering maximum engagement."
          />
        </div>
      </section>

      {/* About the Game */}
      <section className="max-w-4xl mx-auto px-6 py-16">
        <div className="card">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-saffron-500/15 border border-saffron-500/30">
              <Play size={24} className="text-saffron-300" />
            </div>
            <h2 className="section-title mb-0">About the Game</h2>
          </div>
          <div className="space-y-4 text-ink-200 leading-relaxed">
            <p>
              JANMA: Walk in My Shoes is an interactive technology-driven board game that transports
              you to a medieval Indian civilization. Each player generates a unique character through
              a randomized system — you only choose the name. Everything else, from gender and
              ethnicity to occupation and social standing, is determined by fate.
            </p>
            <p>
              Your character's starting age is always 18. From there, you navigate life events,
              make decisions, and experience the consequences of circumstances beyond your control.
              A farmer's journey differs wildly from a noble's, yet victory is not predetermined by
              birth — it is earned through the wisdom of your choices.
            </p>
            <p>
              The game bridges the physical and digital: a tangible board crafted by local artisans,
              paired with this web companion that handles character generation, room management,
              and player coordination through QR code scanning.
            </p>
          </div>
        </div>
      </section>

      {/* How to Play */}
      <section className="max-w-4xl mx-auto px-6 py-16 pb-24">
        <h2 className="section-title text-center mb-12">How to Play</h2>
        <div className="space-y-6">
          <StepCard
            step={1}
            icon={<ScanLine size={24} />}
            title="Scan the QR Code"
            description="Use the scanner on this website to scan the QR code provided along with the board game. Each QR code sends your party to a private room."
          />
          <StepCard
            step={2}
            icon={<Sparkles size={24} />}
            title="Generate Your Character"
            description="Once in the room, enter your character's name and press the Character Generator button. This randomly assigns your parameters and conditions — gender, ethnicity, region, health, strength, intelligence, social status, occupation, wealth, and education."
          />
          <StepCard
            step={3}
            icon={<Play size={24} />}
            title="Ready to Start"
            description="Press the Ready button to signal you're prepared. Once all players are ready, the game begins — your journey through medieval India awaits."
          />
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-saffron-900/20 py-8 text-center text-ink-400 text-sm">
        <p>JANMA: Walk in My Shoes — Experience medieval India, one life at a time.</p>
      </footer>
    </div>
  );
}

function SDGCard({
  icon,
  number,
  title,
  color,
  accent,
  description,
}: {
  icon: React.ReactNode;
  number: string;
  title: string;
  color: string;
  accent: string;
  description: string;
}) {
  return (
    <div className={`rounded-xl p-6 bg-gradient-to-br ${color} border backdrop-blur-sm hover:scale-[1.02] transition-transform duration-300`}>
      <div className="flex items-center gap-4 mb-4">
        <div className={`p-3 rounded-lg bg-ink-900/40 border border-ink-700/50 ${accent}`}>
          {icon}
        </div>
        <div>
          <div className={`text-xs font-semibold ${accent} uppercase tracking-wider`}>SDG {number}</div>
          <h3 className="text-lg font-bold text-ink-50">{title}</h3>
        </div>
      </div>
      <p className="text-ink-300 leading-relaxed text-sm">{description}</p>
    </div>
  );
}

function StepCard({
  step,
  icon,
  title,
  description,
}: {
  step: number;
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="card flex gap-5 items-start hover:border-saffron-500/40 transition-all duration-300 group">
      <div className="flex-shrink-0 w-14 h-14 rounded-xl bg-gradient-to-br from-saffron-500/20 to-marigold-500/10 border border-saffron-500/30 flex items-center justify-center text-saffron-300 group-hover:scale-110 transition-transform duration-300">
        {icon}
      </div>
      <div className="flex-1">
        <div className="flex items-center gap-3 mb-1">
          <span className="text-xs font-bold text-saffron-500 bg-saffron-500/10 px-2 py-0.5 rounded-full border border-saffron-500/20">
            STEP {step}
          </span>
          <h3 className="text-lg font-bold text-saffron-200">{title}</h3>
        </div>
        <p className="text-ink-300 leading-relaxed">{description}</p>
      </div>
      <ChevronRight className="text-saffron-700/40 group-hover:text-saffron-500/60 transition-colors mt-4" size={20} />
    </div>
  );
}
