import type { Player } from "@/utils/types";

// One roster line: the player's assigned dark color as a swatch beside their
// name in chalk. `animate-chalk-in` makes new arrivals drift/fade in.
const PlayerRow = ({ player }: { player: Player }) => {
  return (
    <li className="animate-chalk-in flex items-center gap-3 py-2">
      <span
        className="h-5 w-5 shrink-0 rounded-sm ring-1 ring-[#f5f5f0]/40"
        style={{ backgroundColor: player.color }}
        aria-hidden
      />
      <span className="font-chalk text-2xl text-[#f5f5f0]/90">
        {player.playerName}
      </span>
      {player.isAdmin && (
        <span className="font-chalk ml-auto text-lg text-[#f5f5f0]/50">
          ★ admin
        </span>
      )}
    </li>
  );
};

export default PlayerRow;
