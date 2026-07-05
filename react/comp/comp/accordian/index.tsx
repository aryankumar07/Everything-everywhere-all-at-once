'use client'
import { Dispatch, ReactNode, SetStateAction, createContext, useContext, useState } from "react"
import { ChevronDown, ChevronUp } from 'lucide-react';


interface AccordingContextProps {
  isOpen: boolean
  setIsOpen: Dispatch<SetStateAction<boolean>>
}

interface AccordianProps {
  children?: ReactNode
}

interface AccordianItemProps {
  children?: ReactNode
}

interface AccordianItemTriggerProps {
  value: string
}

interface AccordianItemContentProps {
  children?: ReactNode
}

const AccordianContext = createContext<AccordingContextProps | null>(null)

const useAccordianContext = () => {
  const context = useContext(AccordianContext)
  if (context === null) {
    throw new Error("No Accordian Context found")
  }
  return context
}


export const Accordian = ({ children }: AccordianProps) => {

  return (
    <div className="bg-slate-900 flex flex-col justify-center items-center p-2 w-full max-w-lg rounded-2xl">
      {children}
    </div>
  )
}


const AccordianItem = ({ children }: AccordianItemProps) => {
  const [isOpen, setIsOpen] = useState(false)
  return (
    <AccordianContext.Provider value={{ isOpen, setIsOpen }} >
      <div className="border-b border-gray-400 w-full">
        {children}
      </div>
    </AccordianContext.Provider>
  )
}

const AccordianItemTrigger = ({ value }: AccordianItemTriggerProps) => {
  const { isOpen, setIsOpen } = useAccordianContext()
  return (
    <div onClick={() => setIsOpen((prev) => !prev)} className="flex justify-between items-center gap-3 p-2  w-full cursor-pointer">
      <label className="text-lg font-semibold cursor-pointer flex-1 min-w-0 hover:underline ">{value}</label>
      {isOpen ? <ChevronUp className="shrink-0" /> : <ChevronDown className="shrink-0" />}
    </div>
  )
}


const AccordianItemContent = ({ children }: AccordianItemContentProps) => {
  const { isOpen } = useAccordianContext()
  return (
    isOpen && (
      <div className="px-2 py-2 text-sm leading-relaxed text-gray-200 ">
        {children}
      </div>
    )
  )
}

Accordian.item = AccordianItem
AccordianItem.content = AccordianItemContent
AccordianItem.trigger = AccordianItemTrigger
