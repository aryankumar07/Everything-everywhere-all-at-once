// The shared 12-box board. Each box shows the color of whoever clicked it last;
// a player wins by turning every box their own color.
const GameGrid = ({
  board,
  disabled,
  onCellClick,
}: {
  board: (string | null)[];
  disabled: boolean;
  onCellClick: (index: number) => void;
}) => {
  return (
    <div className="grid grid-cols-4 gap-3">
      {board.map((color, index) => (
        <button
          key={index}
          disabled={disabled}
          onClick={() => onCellClick(index)}
          style={color ? { backgroundColor: color } : undefined}
          className={`aspect-square rounded-lg border transition ${
            color
              ? "border-transparent"
              : "border-zinc-300 bg-white dark:border-zinc-700 dark:bg-zinc-800"
          } ${
            disabled
              ? "cursor-not-allowed opacity-90"
              : "cursor-pointer hover:brightness-125"
          }`}
          aria-label={`box ${index + 1}`}
        />
      ))}
    </div>
  );
};

export default GameGrid;
