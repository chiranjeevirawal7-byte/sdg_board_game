import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { generateCharacter, CharacterStats } from '@/lib/characterGenerator';
import { Sparkles, LogOut, Play, User, Users, Heart, Dumbbell, Brain, Smile, MapPin, Crown, Briefcase, Coins, BookOpen, Check, AlertCircle } from 'lucide-react';

interface Player {
  id: string;
  room_id: string;
  player_name: string;
  character_data: CharacterStats | null;
  has_generated: boolean;
  is_ready: boolean;
  player_token: string;
  created_at: string;
}

function getOrCreateToken(): string {
  const key = 'janma_player_token';
  let token = localStorage.getItem(key);
  if (!token) {
    token = crypto.randomUUID();
    localStorage.setItem(key, token);
  }
  return token;
}

export default function RoomPage() {
  const params = useParams();
  const navigate = useNavigate();
  const roomId = params.roomId!;

  const [playerName, setPlayerName] = useState('');
  const [playerId, setPlayerId] = useState<string | null>(null);
  const [hasGenerated, setHasGenerated] = useState(false);
  const [character, setCharacter] = useState<CharacterStats | null>(null);
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [generating, setGenerating] = useState(false);
  const joinedRef = useRef(false);

  // Join the room
  useEffect(() => {
    if (joinedRef.current) return;
    joinedRef.current = true;

    const token = getOrCreateToken();

    const joinRoom = async () => {
      // Check if player already exists in this room with this token
      const { data: existing } = await supabase
        .from('janma_players')
        .select('*')
        .eq('room_id', roomId)
        .eq('player_token', token)
        .maybeSingle();

      if (existing) {
        setPlayerId(existing.id);
        setPlayerName(existing.player_name);
        setHasGenerated(existing.has_generated);
        if (existing.character_data) {
          setCharacter(existing.character_data as CharacterStats);
        }
      } else {
        // Create new player entry with placeholder name
        const { data, error } = await supabase
          .from('janma_players')
          .insert({
            room_id: roomId,
            player_name: 'Unnamed Player',
            player_token: token,
          })
          .select()
          .single();

        if (error) {
          setError('Failed to join room. Please try again.');
          setLoading(false);
          return;
        }
        setPlayerId(data.id);
      }
      setLoading(false);
    };

    joinRoom();
  }, [roomId]);

  // Subscribe to realtime updates for players in this room
  useEffect(() => {
    if (!playerId) return;

    const channel = supabase
      .channel(`room:${roomId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'janma_players',
          filter: `room_id=eq.${roomId}`,
        },
        async () => {
          const { data } = await supabase
            .from('janma_players')
            .select('*')
            .eq('room_id', roomId)
            .order('created_at', { ascending: true });
          if (data) setPlayers(data as Player[]);
        }
      )
      .subscribe();

    // Initial fetch
    const fetchPlayers = async () => {
      const { data } = await supabase
        .from('janma_players')
        .select('*')
        .eq('room_id', roomId)
        .order('created_at', { ascending: true });
      if (data) setPlayers(data as Player[]);
    };
    fetchPlayers();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [roomId, playerId]);

  // Clean up on unmount: remove player from room
  useEffect(() => {
    return () => {
      const token = getOrCreateToken();
      supabase
        .from('janma_players')
        .delete()
        .eq('player_token', token)
        .eq('room_id', roomId)
        .then(() => {});
    };
  }, [roomId]);

  const handleNameChange = async (name: string) => {
    setPlayerName(name);
    if (playerId && name.trim()) {
      await supabase
        .from('janma_players')
        .update({ player_name: name.trim() })
        .eq('id', playerId);
    }
  };

  const handleGenerate = async () => {
    if (!playerId || hasGenerated || !playerName.trim()) return;
    setGenerating(true);
    setError(null);

    // Small delay for visual feedback
    await new Promise((r) => setTimeout(r, 800));

    const stats = generateCharacter();
    setCharacter(stats);
    setHasGenerated(true);

    await supabase
      .from('janma_players')
      .update({
        character_data: stats as unknown as Record<string, unknown>,
        has_generated: true,
      })
      .eq('id', playerId);

    setGenerating(false);
  };

  const handleLeave = () => {
    navigate('/');
  };

  const handleReady = async () => {
    if (!playerId) return;
    await supabase
      .from('janma_players')
      .update({ is_ready: true })
      .eq('id', playerId);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full border-4 border-saffron-700/30 border-t-saffron-400 animate-spin" />
          <p className="text-saffron-300 font-display text-lg">Entering Room {roomId}...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6">
        <div className="card max-w-md text-center">
          <AlertCircle size={32} className="text-terracotta-400 mx-auto mb-4" />
          <p className="text-terracotta-200 mb-6">{error}</p>
          <button onClick={() => navigate('/')} className="btn-primary">
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  const canGenerate = playerName.trim().length > 0 && !hasGenerated;
  const canStart = hasGenerated;

  return (
    <div className="min-h-screen mandala-bg pb-12">
      {/* Header */}
      <header className="ornate-border mx-4 md:mx-auto max-w-5xl mt-6 rounded-xl px-6 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-saffron-200 font-display">
            JANMA: Walk in My Shoes
          </h1>
          <p className="text-ink-400 text-sm">Room {roomId}</p>
        </div>
        <button onClick={handleLeave} className="btn-danger">
          <LogOut size={18} />
          Leave Room
        </button>
      </header>

      <div className="max-w-5xl mx-auto px-4 md:px-6 mt-6 grid lg:grid-cols-2 gap-6">
        {/* Left: Character Creation */}
        <div className="space-y-6">
          {/* Name Input */}
          <div className="card">
            <label className="flex items-center gap-2 text-saffron-300 font-semibold mb-3">
              <User size={18} />
              Character Name
            </label>
            <input
              type="text"
              value={playerName}
              onChange={(e) => handleNameChange(e.target.value)}
              placeholder="Enter your character's name..."
              className="input-field"
              maxLength={30}
            />
            <p className="text-ink-400 text-xs mt-2">
              This is the only thing you choose. Everything else is fate.
            </p>
          </div>

          {/* Character Generator */}
          <div className="card">
            <div className="flex items-center gap-2 text-saffron-300 font-semibold mb-4">
              <Sparkles size={18} />
              Character Generator
            </div>

            {!hasGenerated && (
              <>
                <p className="text-ink-300 text-sm mb-4">
                  Press the button to randomly generate your character's parameters and conditions.
                  This can only be done once.
                </p>
                <button
                  onClick={handleGenerate}
                  disabled={!canGenerate || generating}
                  className="btn-primary w-full"
                >
                  {generating ? (
                    <>
                      <div className="w-5 h-5 rounded-full border-2 border-ink-900/30 border-t-ink-900 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Sparkles size={20} />
                      Generate Character
                    </>
                  )}
                </button>
                {!playerName.trim() && (
                  <p className="text-terracotta-300 text-xs mt-2 text-center">
                    Enter a character name first
                  </p>
                )}
              </>
            )}

            {hasGenerated && character && (
              <div className="animate-scale-in">
                <div className="flex items-center gap-2 mb-4">
                  <Check size={18} className="text-forest-400" />
                  <span className="text-forest-300 font-semibold text-sm">Character Generated</span>
                </div>

                {/* Character Stats Display */}
                <div className="space-y-4">
                  <h3 className="text-saffron-200 font-display text-lg font-bold border-b border-saffron-800/30 pb-2">
                    Character Stats
                  </h3>

                  {/* Identity */}
                  <div className="grid grid-cols-2 gap-3">
                    <StatChip icon={<User size={14} />} label="Gender" value={character.gender} />
                    <StatChip icon={<MapPin size={14} />} label="Region" value={character.regionOfBirth} />
                    <StatChip icon={<Users size={14} />} label="Ethnicity" value={character.ethnicity} />
                    <StatChip icon={<Crown size={14} />} label="Social Status" value={character.socialStatus} />
                  </div>

                  {/* Numeric Stats */}
                  <div className="space-y-3 pt-2">
                    <StatBar icon={<Heart size={14} />} label="Health" value={character.health} color="bg-terracotta-500" />
                    <StatBar icon={<Dumbbell size={14} />} label="Physical Strength" value={character.physicalStrength} color="bg-saffron-500" />
                    <StatBar icon={<Brain size={14} />} label="Intelligence" value={character.intelligence} color="bg-forest-500" />
                    <StatBar icon={<Smile size={14} />} label="Charisma" value={character.charisma} color="bg-marigold-500" />
                  </div>

                  {/* Conditions */}
                  <div className="grid grid-cols-2 gap-3 pt-2">
                    <StatChip icon={<Briefcase size={14} />} label="Occupation" value={character.occupation} />
                    <StatChip icon={<Coins size={14} />} label="Wealth" value={character.wealth} />
                    <StatChip icon={<BookOpen size={14} />} label="Education" value={character.education} />
                    <StatChip icon={<User size={14} />} label="Starting Age" value={String(character.startingAge)} />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Start Button */}
          <div className="card">
            <button onClick={handleReady} disabled={!canStart} className="btn-primary w-full">
              <Play size={20} />
              Ready to Start
            </button>
            <p className="text-ink-400 text-xs mt-2 text-center">
              {canStart ? 'Signal that you are ready to begin the game' : 'Generate your character first'}
            </p>
          </div>
        </div>

        {/* Right: Players in Room */}
        <div className="card h-fit lg:sticky lg:top-6">
          <div className="flex items-center gap-2 text-saffron-300 font-semibold mb-4">
            <Users size={18} />
            Players in Room
            <span className="ml-auto text-ink-400 text-sm font-normal">
              {players.length} {players.length === 1 ? 'player' : 'players'}
            </span>
          </div>

          {players.length === 0 ? (
            <p className="text-ink-400 text-sm text-center py-8">No players yet.</p>
          ) : (
            <div className="space-y-2 max-h-[500px] overflow-y-auto pr-2">
              {players.map((p, idx) => (
                <div
                  key={p.id}
                  className={`flex items-center gap-3 p-3 rounded-lg border transition-all duration-300 ${
                    p.id === playerId
                      ? 'bg-saffron-500/10 border-saffron-500/30'
                      : 'bg-ink-900/40 border-ink-700/30'
                  }`}
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-saffron-500/30 to-marigold-500/10 border border-saffron-600/30 flex items-center justify-center text-saffron-300 text-sm font-bold">
                    {idx + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-ink-100 font-medium truncate">
                      {p.player_name}
                      {p.id === playerId && <span className="text-saffron-400 text-xs ml-2">(You)</span>}
                    </p>
                    <div className="flex items-center gap-2 mt-0.5">
                      {p.has_generated ? (
                        <span className="flex items-center gap-1 text-forest-400 text-xs">
                          <Check size={10} /> Character ready
                        </span>
                      ) : (
                        <span className="text-ink-500 text-xs">No character yet</span>
                      )}
                      {p.is_ready && (
                        <span className="flex items-center gap-1 text-saffron-400 text-xs">
                          <Play size={10} /> Ready
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function StatChip({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center gap-2 p-2.5 rounded-lg bg-ink-900/50 border border-ink-700/30">
      <div className="text-saffron-400">{icon}</div>
      <div className="min-w-0">
        <div className="text-ink-500 text-xs">{label}</div>
        <div className="text-ink-100 text-sm font-medium truncate">{value}</div>
      </div>
    </div>
  );
}

function StatBar({
  icon,
  label,
  value,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  color: string;
}) {
  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <span className="flex items-center gap-2 text-ink-300 text-sm">
          <span className="text-saffron-400">{icon}</span>
          {label}
        </span>
        <span className="text-ink-200 text-sm font-semibold">{value}</span>
      </div>
      <div className="stat-bar">
        <div className={`stat-fill ${color}`} style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}
