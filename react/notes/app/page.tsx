'use client'
import { useEffect, useState } from "react";

export default function Home() {

  const [msg, setMsg] = useState()

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch('http://localhost:4000/', {
        method: "POST",
        headers: {
          'Content-Type': "application/json"
        },
        body: JSON.stringify({
          query: `
        query {
          hello
        }
        `
        })
      })
      const data = await response.json()
      setMsg(data.data.hello)
    }
    fetchData()
  }, [])


  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex flex-1 w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start">
      </main>
    </div>
  );
}
