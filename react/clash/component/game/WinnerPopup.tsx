// Shown to everyone when a STOP broadcast arrives. The winner's name is styled
// in chalk; the page auto-redirects back to the lobby shortly after.
const WinnerPopup = ({ name }: { name: string }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="mx-4 rounded-xl bg-white p-8 text-center shadow-2xl dark:bg-zinc-900">
        <div className="font-chalk text-xl text-zinc-400">Winner</div>
        <div className="font-chalk mt-2 text-4xl font-bold text-zinc-900 dark:text-white">
          {name} 🏆
        </div>
        <div className="mt-4 text-sm text-zinc-400">returning to lobby…</div>
      </div>
    </div>
  );
};

export default WinnerPopup;
