"use client"
import { useEffect } from "react"
import { getUser } from "@/auth"
import { useRouter } from "next/navigation"
import BackgroundTree from "@/backgrounds"


const Dashboard = () => {

  const router = useRouter()


  useEffect(() => {
    getUser(() => {
      router.push("/")
    })
  }, [])

  return (
    <div className="relative inset-0 h-screen w-screen">
      <BackgroundTree
        transparent={true}
        backgroundColor={'#ffffff'}
        branchCount={8}
        branchWidth={0.6}
        shadowOpacity={1}
        windStrength={4}
        windSpeed={3}
        bokehCount={18}
        bokehOpacity={1}
        position={'top-left'}
      />
      <div className="p-2 w-screen h-screen flex justify-center items-center">
        <h1>DASHBOARD</h1>
      </div>
    </div>
  )

}

export default Dashboard
