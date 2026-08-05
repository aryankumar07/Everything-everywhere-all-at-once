// The dark chalkboard surface the roster is written on. Intentionally dark in
// both themes; a faint chalk-dust texture + vignette give it depth, and a
// wooden frame sets it apart from the page background.
const ChalkBoard = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => {
  return (
    <div className="w-full max-w-md rounded-xl bg-[#3a2416] p-2 shadow-2xl shadow-black/50">
      <div className="chalkboard relative overflow-hidden rounded-md border border-black/40 bg-[#22403a] px-6 py-5">
        <h2 className="font-chalk mb-4 text-center text-3xl tracking-wide text-[#f5f5f0]/90">
          {title}
        </h2>
        {children}
      </div>
    </div>
  );
};

export default ChalkBoard;
