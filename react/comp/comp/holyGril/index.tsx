"use client"
import { ReactNode, useState } from "react"
import { Menu } from "lucide-react"



export const HolyGrail = ({ children }: { children?: ReactNode }) => {

  const [close, setClose] = useState(false)


  return (
    <div className="flex flex-1 relative">
      <header className="fixed top-0 right-0 h-20 z-10 w-full bg-red-400">
        <div className="flex h-full w-full p-4 justify-start items-center gap-4">
          <>
            <Menu size={24} className="md:hidden block" onClick={() => setClose((prev) => !prev)} />
            <div className="">
              Navbar
            </div>
          </>
        </div>
      </header>
      <div className={`fixed ${close ? "-left-48 md:left-0" : "left-0"} top-20 z-10 bg-green-300 h-full w-48`}>
        <li className="flex flex-col items-end justify-center gap-8 p-4">
          <ul className="cursor-pointer">Home</ul>
          <ul className="cursor-pointer">Update</ul>
          <ul className="cursor-pointer">About</ul>
        </li>
      </div>
      <div className="fixed top-0 left-0 md:top-20 md:left-48 right-0 bottom-0 bg-amber-400 overflow-auto">
        {children}
      </div>
    </div>
  )
}


// HolyGrail>
//         <>
//           <article className="max-w-3xl mx-auto p-10 text-slate-900 space-y-12">
//             <header className="space-y-2 border-b border-slate-800/20 pb-6">
//               <h1 className="text-4xl font-bold">Frontend Deep Dives</h1>
//               <p className="text-slate-800">
//                 Three long-form answers to questions that come up over and over again
//                 when teams adopt React at scale. Read them in order or jump around — each
//                 one stands alone.
//               </p>
//             </header>
//
//             <section className="space-y-4">
//               <h2 className="text-2xl font-semibold">
//                 Q1. What is the React Virtual DOM and why does it matter?
//               </h2>
//               <p>
//                 The Virtual DOM is an in-memory representation of the real DOM that React
//                 maintains as a lightweight JavaScript object tree. When state changes,
//                 React builds a new virtual tree and compares it to the previous one
//                 through a process called reconciliation. Instead of touching the browser
//                 DOM directly on every update, React calculates the smallest set of
//                 changes needed and flushes only those to the actual page.
//               </p>
//               <p>
//                 The reason this matters is that real DOM operations are expensive. Every
//                 time a browser mutates the DOM, it may trigger style recalculation,
//                 layout, and paint — costly operations that can stutter animations or
//                 delay user input. By batching and minimizing these mutations, React lets
//                 developers write code as if the entire UI is rebuilt on every state
//                 change while the runtime quietly applies surgical updates under the hood.
//               </p>
//               <p>
//                 It also separates the intent of rendering from the mechanics of updating.
//                 In a jQuery-era codebase, you had to remember which elements to mutate
//                 when state changed; that imperative bookkeeping is exactly where bugs
//                 hide. With a virtual DOM diff, you describe what the UI should look like,
//                 and React figures out how to get there. That declarative model is
//                 arguably the more important benefit of the approach.
//               </p>
//               <p>
//                 However, the Virtual DOM is not inherently faster than hand-written DOM
//                 updates. A carefully optimized imperative implementation will usually
//                 beat React in raw benchmarks. The Virtual DOM wins on maintainability and
//                 predictable performance, not on microbenchmarks. It is a tradeoff: you
//                 give up some theoretical max speed to gain consistency and developer
//                 velocity across a team and a long-lived codebase.
//               </p>
//               <p>
//                 Modern alternatives like Svelte skip the virtual DOM altogether,
//                 compiling components into direct DOM operations at build time. Solid does
//                 something similar with fine-grained reactivity. These approaches show
//                 that the Virtual DOM is a choice, not a necessity — but React's choice
//                 has held up because the ecosystem, tooling, and mental model it enables
//                 are immensely valuable in practice, even if the underlying diff is not
//                 always the fastest path to pixels on screen.
//               </p>
//             </section>
//
//             <section className="space-y-4">
//               <h2 className="text-2xl font-semibold">
//                 Q2. How do React Hooks change the way we write components?
//               </h2>
//               <p>
//                 Hooks let function components own state, side effects, context, and refs
//                 — features that previously required class components. Before Hooks,
//                 splitting logic between lifecycle methods like componentDidMount and
//                 componentDidUpdate forced related code apart and unrelated code together.
//                 Hooks reverse that: a single useEffect can colocate setup and teardown
//                 for one concern, and you can have many of them per component.
//               </p>
//               <p>
//                 The real shift is composability. A custom hook is just a function whose
//                 name starts with "use" and that calls other hooks. That means you can
//                 extract any stateful logic — a fetch, a subscription, a form field, an
//                 animation — into a reusable unit that any component can opt into. Class
//                 components never had a clean equivalent; higher-order components and
//                 render props were attempts, but both created wrapper hell and awkward
//                 prop plumbing that made debugging a chore.
//               </p>
//               <p>
//                 Hooks also realign React with functional programming principles.
//                 Components become pure functions of props and state, and effects become
//                 explicit, tracked dependencies. This makes code easier to reason about
//                 and test in isolation. It also makes React's concurrent features
//                 viable: Suspense, transitions, and automatic batching all assume renders
//                 are pure and idempotent, which hooks enforce by convention and which
//                 classes could not guarantee without heavy discipline.
//               </p>
//               <p>
//                 That said, hooks introduce their own hazards. The rules of hooks — always
//                 call at the top level, never conditionally — exist because React relies
//                 on call order to match hook state to the component. Miss that rule and
//                 state gets misaligned in confusing ways. The exhaustive-deps lint rule
//                 for useEffect is notoriously tricky; developers routinely add
//                 dependencies they don't mean or omit ones they should track, creating
//                 stale closures or effect storms.
//               </p>
//               <p>
//                 Hooks also blur the boundary between render and effect. In class
//                 components, lifecycle was explicit. With hooks, every render re-runs the
//                 function body, and it's easy to accidentally create new objects or
//                 functions on every render that trigger downstream effects. Understanding
//                 useMemo, useCallback, and referential identity becomes essential as
//                 components grow — something beginners often learn the hard way after
//                 shipping a component that re-renders hundreds of times per interaction.
//               </p>
//               <p>
//                 Still, hooks are a net win. Once you internalize the mental model,
//                 components become shorter, more testable, and more composable. React's
//                 future — server components, async rendering, streaming — all builds on
//                 the hooks foundation. Classes are not deprecated, but they are
//                 effectively legacy in new code, and most of the community has moved on
//                 without looking back.
//               </p>
//             </section>
//
//             <section className="space-y-4">
//               <h2 className="text-2xl font-semibold">
//                 Q3. What is hydration and why is it controversial?
//               </h2>
//               <p>
//                 Hydration is the process by which a server-rendered HTML page gets
//                 "taken over" by client-side React. The server renders the component tree
//                 to HTML and ships it to the browser so the user sees content
//                 immediately. Then the JavaScript bundle loads, React walks the same tree
//                 on the client, and attaches event listeners, reconciles state, and makes
//                 the page interactive. From the user's perspective, a static page
//                 suddenly wakes up.
//               </p>
//               <p>
//                 The appeal is clear: you get the SEO and first-paint benefits of server
//                 rendering, plus the rich interactivity of a SPA. Frameworks like
//                 Next.js, Remix, and Gatsby built their reputations on this model. For
//                 content sites — blogs, marketing pages, e-commerce — hydration used to
//                 be treated as the best of both worlds and became the default pattern
//                 for modern React applications across the industry.
//               </p>
//               <p>
//                 The problem is that hydration is expensive. The browser has to download
//                 the entire component tree's JavaScript, parse it, execute it, and replay
//                 the render just to attach click handlers. On a slow phone, this can mean
//                 the page looks ready for several seconds before it actually responds to
//                 taps — the infamous "uncanny valley" of interactivity where a user sees
//                 content but cannot act on it. The larger the app, the worse the gap.
//               </p>
//               <p>
//                 Hydration is also fragile. If the HTML the server renders differs even
//                 slightly from what the client would render — because of a date, a random
//                 ID, a locale mismatch — React throws a hydration mismatch warning and
//                 may fall back to full re-rendering. Anything that depends on window,
//                 localStorage, or user preferences has to be carefully guarded. These
//                 bugs are hard to debug because they manifest only in production or under
//                 specific conditions that are hard to reproduce locally.
//               </p>
//               <p>
//                 This is why the industry is moving toward alternatives: React Server
//                 Components, islands architecture (Astro, Fresh), and resumability
//                 (Qwik). Server Components keep logic on the server entirely, sending
//                 serialized results instead of JavaScript. Islands ship JavaScript only
//                 for the interactive parts of a page. Qwik serializes the application
//                 state into the HTML so the client never has to replay anything —
//                 execution literally resumes where the server left off.
//               </p>
//               <p>
//                 So hydration is not dead, but it is no longer the default answer. It
//                 served a purpose for a decade and enabled the React-based web we have
//                 now, but its costs are increasingly visible as apps scale and mobile
//                 networks expose the overhead. The next generation of React frameworks
//                 treats hydration as an escape hatch rather than a foundation, which is
//                 probably the right call — but it also means the mental model developers
//                 learned over the last decade is quietly being replaced.
//               </p>
//             </section>
//           </article>
//           <footer className="h-24 w-full bg-blue-300 p-2">
//             <div className="flex w-full h-full justify-between items-center px-6 gap-6 text-slate-900 text-sm">
//               <p className="font-medium whitespace-nowrap">
//                 © 2026 HolyGrail Inc. All rights reserved.
//               </p>
//               <nav className="flex items-center gap-4">
//                 <a href="#" className="hover:underline">GitHub</a>
//                 <a href="#" className="hover:underline">Twitter</a>
//                 <a href="#" className="hover:underline">LinkedIn</a>
//               </nav>
//               <form
//                 onSubmit={(e) => e.preventDefault()}
//                 className="flex items-center gap-2"
//               >
//                 <input
//                   type="email"
//                   placeholder="you@example.com"
//                   className="h-8 rounded border border-slate-700/30 bg-white/80 px-2 text-sm outline-none focus:border-slate-900"
//                 />
//                 <button
//                   type="submit"
//                   className="h-8 rounded bg-slate-900 px-3 text-xs font-semibold text-white hover:bg-slate-800"
//                 >
//                   Subscribe
//                 </button>
//               </form>
//             </div>
//           </footer>
//         </>
//       </HolyGrail>

