import { v4 as uuidv4 } from 'uuid';


export const getRandomId = (): string => {
  const id = uuidv4()
  return id;
}


export const getRandomNo = (): number => {
  return Math.floor(Math.random() * 256)
}
