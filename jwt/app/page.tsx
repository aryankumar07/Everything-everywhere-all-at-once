"use client";
import { useForm, SubmitHandler } from "react-hook-form";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { useState } from "react";
import { handleRegister, handleLogin } from "@/auth";
import { useRouter } from "next/navigation";
import BackgroundTree from "@/backgrounds";


export interface RegistrationInput {
  name: string | undefined;
  email: string;
  password: string;
}

export default function Home() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegistrationInput>();

  const router = useRouter()

  const [registered, setRegistered] = useState(false)

  const onSubmit: SubmitHandler<RegistrationInput> = async (formData) => {
    if (!registered) {
      handleRegister(formData, setRegistered)
    } else {
      handleLogin(formData, () => {
        router.push('/dashboard')
      })
    }
  };

  return (
    <div className="relative flex h-screen w-screen justify-center items-center bg-white">
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
      <ToastContainer />
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        {!registered && (<div>
          <input
            className="border border-gray-500 bg-gray-900 p-2 rounded text-white placeholder-gray-400"
            placeholder="name"
            {...register("name", { required: "name is required" })}
          />
          {errors.name && <p className="text-red-500 text-xs">{errors.name.message}</p>}
        </div>)
        }
        <div>
          <input
            className="border border-gray-500 bg-gray-900 p-2 rounded text-white placeholder-gray-400"
            placeholder="Email"
            {...register("email", { required: "Email is required" })}
          />
          {errors.email && <p className="text-red-500 text-xs">{errors.email.message}</p>}
        </div>
        <div>
          <input
            type="password"
            className="border border-gray-500 bg-gray-900 p-2 rounded text-white placeholder-gray-400"
            placeholder="Password"
            {...register("password", { required: "Password is required" })}
          />
          {errors.password && <p className="text-red-500 text-xs">{errors.password.message}</p>}
        </div>
        <button className="bg-orange-400 p-2 rounded text-white hover:bg-orange-500" type="submit">
          {
            !registered ? "Register" : "Login"
          }
        </button>
        <p className="text-gray-400 text-sm text-center">
          {!registered ? "Already have an account? " : "Don't have an account? "}
          <button
            type="button"
            className="text-orange-400 hover:text-orange-500 underline"
            onClick={() => setRegistered(!registered)}
          >
            {!registered ? "Login" : "Register"}
          </button>
        </p>
      </form>
    </div>
  );
}
