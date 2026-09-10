/*
# Create JANMA rooms and players tables (single-tenant, no auth)

1. New Tables
- `janma_players`
  - `id` (uuid, primary key)
  - `room_id` (text, not null) — identifies which of the 10 rooms the player is in (e.g. 'room1')
  - `player_name` (text, not null) — the character name the player entered
  - `character_data` (jsonb, nullable) — the generated character stats (parameters + conditions)
  - `has_generated` (boolean, default false) — whether the player has pressed the character generator
  - `is_ready` (boolean, default false) — whether the player has pressed the start button
  - `player_token` (text, not null) — a unique token stored in localStorage to identify this browser/player
  - `created_at` (timestamptz, default now())
  - `updated_at` (timestamptz, default now())
2. Security
- Enable RLS on `janma_players`.
- Allow anon + authenticated CRUD because the app has no sign-in screen (single-tenant, shared game rooms).
- All data is intentionally public within the game context — players in the same room can see each other.
3. Realtime
- Enable realtime on `janma_players` table so room pages can subscribe to player presence updates.
4. Notes
- The `player_token` is a UUID generated client-side and stored in localStorage. It lets us identify
  a returning player (same browser) so we don't create duplicate rows when they re-enter a room.
- `updated_at` is refreshed via a trigger on every UPDATE so we can sort players by join time.
*/

CREATE TABLE IF NOT EXISTS janma_players (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id text NOT NULL,
  player_name text NOT NULL,
  character_data jsonb,
  has_generated boolean NOT NULL DEFAULT false,
  is_ready boolean NOT NULL DEFAULT false,
  player_token text NOT NULL UNIQUE,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE janma_players ENABLE ROW LEVEL SECURITY;

-- Allow anon + authenticated to read all players (shared game rooms)
DROP POLICY IF EXISTS "anon_select_janma_players" ON janma_players;
CREATE POLICY "anon_select_janma_players"
ON janma_players FOR SELECT
TO anon, authenticated USING (true);

-- Allow anon + authenticated to insert
DROP POLICY IF EXISTS "anon_insert_janma_players" ON janma_players;
CREATE POLICY "anon_insert_janma_players"
ON janma_players FOR INSERT
TO anon, authenticated WITH CHECK (true);

-- Allow anon + authenticated to update
DROP POLICY IF EXISTS "anon_update_janma_players" ON janma_players;
CREATE POLICY "anon_update_janma_players"
ON janma_players FOR UPDATE
TO anon, authenticated USING (true) WITH CHECK (true);

-- Allow anon + authenticated to delete (when leaving room)
DROP POLICY IF EXISTS "anon_delete_janma_players" ON janma_players;
CREATE POLICY "anon_delete_janma_players"
ON janma_players FOR DELETE
TO anon, authenticated USING (true);

-- Create index on room_id for fast room queries
CREATE INDEX IF NOT EXISTS idx_janma_players_room_id ON janma_players(room_id);

-- Trigger to update updated_at on row update
CREATE OR REPLACE FUNCTION update_janma_players_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_janma_players_updated_at ON janma_players;
CREATE TRIGGER trigger_janma_players_updated_at
BEFORE UPDATE ON janma_players
FOR EACH ROW EXECUTE FUNCTION update_janma_players_updated_at();

-- Enable realtime
ALTER PUBLICATION supabase_realtime ADD TABLE janma_players;
