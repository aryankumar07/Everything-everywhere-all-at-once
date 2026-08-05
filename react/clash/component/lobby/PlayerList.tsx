import type { Player } from "@/utils/types";
import PlayerRow from "./PlayerRow";

// The live roster. Keyed by clientId so React only animates the rows that are
// genuinely new when a player joins.
const PlayerList = ({ players }: { players: Player[] }) => {
  if (players.length === 0) {
    return (
      <p className="font-chalk py-4 text-center text-xl text-[#f5f5f0]/50">
        Waiting for players…
      </p>
    );
  }

  return (
    <ul className="divide-y divide-[#f5f5f0]/10">
      {players.map((player) => (
        <PlayerRow key={player.clientId} player={player} />
      ))}
    </ul>
  );
};

export default PlayerList;
