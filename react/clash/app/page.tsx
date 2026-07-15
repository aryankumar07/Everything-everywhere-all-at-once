"use client"

import { useRouter } from 'next/navigation';
import { getRandomId } from '@/utils/getRandomid';
import { useSocket } from '@/utils/socketContext';
import Modal from '@/component/model';
import { useState, useRef } from 'react';

export default function Home() {

  const router = useRouter()
  const { joinGame } = useSocket()
  const inputRef = useRef<HTMLInputElement>(null)
  const nameRef = useRef<HTMLInputElement>(null)

  const [joinOpen, setJoinOpen] = useState(false)
  const [newGameOpen, setNewGameOpen] = useState(false)
  const [newGameId, setNewGameId] = useState('')

  const enterGame = async (id: string, name: string) => {
    try {
      await joinGame(id, name)
      router.replace(`/game/${id}/${name}`);
    } catch {
      alert("Could not connect to the game server");
    }
  };

  const onGenerateNewGame = () => {
    setNewGameId(getRandomId())
    setNewGameOpen(true)
  }

  const onStartGame = () => {
    if (!nameRef || !nameRef.current) {
      alert("Please provide a name dear")
    }
    enterGame(newGameId, nameRef.current!.value);
  }

  const onJoinGame = () => {
    const id = inputRef.current?.value.trim();
    const name = nameRef.current?.value.trim();

    if (!name) {
      alert("Please provide a name dear")
    }
    if (!id) {
      alert("No Game ID provided");
      return;
    }

    enterGame(id, name!);
  };


  return (
    <div className="flex flex-col bg-zinc-50 font-sans dark:bg-black">
      <div className="flex flex-col items-center justify-center p-2 gap-2.5">
        <button
          className="w-56 bg-white text-black font-bold p-2 border border-black rounded-2xl hover:cursor-grab dark:bg-zinc-900 dark:text-white dark:border-zinc-600 dark:hover:bg-zinc-800 transition-colors"
          onClick={onGenerateNewGame}>
          NEW GAME
        </button>
        <button
          className="w-56 bg-white text-black font-bold p-2 border border-black rounded-2xl hover:cursor-grab dark:bg-zinc-900 dark:text-white dark:border-zinc-600 dark:hover:bg-zinc-800 transition-colors"
          onClick={() => setJoinOpen(true)} >
          JOIN GAME
        </button>
      </div>
      <Modal
        open={joinOpen}
        isOpen={(input) => setJoinOpen(input)}
        title='JOIN THE GAME'
        secondaryButtonTitle='JOIN'
        secondaryAction={onJoinGame}
      >
        <div className='flex flex-col gap-2'>
          <input type='text' ref={inputRef} placeholder='Enter the Id' className='w-full h-10 px-2 bg-white text-black border border-black rounded-md placeholder-gray-400 dark:bg-zinc-800 dark:text-white dark:border-zinc-600 dark:placeholder-zinc-500' />
          <input type='text' ref={nameRef} placeholder='Your Game Name' className='w-full h-10 px-2 bg-white text-black border border-black rounded-md placeholder-gray-400 dark:bg-zinc-800 dark:text-white dark:border-zinc-600 dark:placeholder-zinc-500' />
        </div>
      </Modal>
      <Modal
        open={newGameOpen}
        isOpen={(input) => setNewGameOpen(input)}
        title='NEW GAME'
        secondaryButtonTitle='START'
        secondaryAction={onStartGame}
      >
        <div className='flex flex-col gap-2'>
          <div className='flex justify-center items-center gap-2'>
            <input type='text' readOnly value={newGameId} className='w-full h-10 px-2 bg-white text-black border border-black rounded-md dark:bg-zinc-800 dark:text-white dark:border-zinc-600' />
          </div>
          <input type='text' ref={nameRef} placeholder='Your Game Name' className='w-full h-10 px-2 bg-white text-black border border-black rounded-md placeholder-gray-400 dark:bg-zinc-800 dark:text-white dark:border-zinc-600 dark:placeholder-zinc-500' />
        </div>
      </Modal>
    </div>
  );
}
