import { atom } from 'jotai'

export const accessTokenAtom = atom<string | null>(null)

export const userAtom = atom<{ id: string; name: string; email: string } | null>(null)
