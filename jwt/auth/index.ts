import { RegistrationInput } from "@/app/page";
import { toast } from "react-toastify";
import React from "react";
import { Axios } from '../axios'
import axios from "axios";
import { getDefaultStore } from "jotai";
import { accessTokenAtom, userAtom } from "@/store/auth";



const store = getDefaultStore()




export const handleRegister = async (formData: RegistrationInput, setRegistered: React.Dispatch<React.SetStateAction<boolean>>) => {
  try {
    await Axios.post(
      `/register`,
      {
        name: formData.name,
        email: formData.email,
        password: formData.password,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    toast.success("Registration successful!");
    setRegistered(true)
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      const status = error.response.status;
      if (status === 400) {
        toast.warning("Fields are missing");
      } else if (status === 404) {
        toast.warning("User already exists");
      } else if (status >= 500) {
        toast.warning("Backend error");
      } else {
        toast.error("Registration failed");
      }
    } else {
      toast.error(`Network error ${error}`);
    }
  }
}


export const handleLogin = async (formData: RegistrationInput, onSuccess: () => void) => {
  try {
    const res = await Axios.post(`/login`, {
      email: formData.email,
      password: formData.password
    }, {
      headers: {
        'Content-Type': "application/json"
      }
    })

    store.set(accessTokenAtom, res.data.token)

    toast.success("Logged in")
    onSuccess()
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      const status = error.response.status;
      if (status === 400) {
        toast.warning("Fields are missing");
      } else if (status === 404) {
        toast.warning("User doesnot exists");
      } else if (status === 401) {
        toast.warning("password is incorrect")
      } else if (status >= 500) {
        toast.warning("Backend error");
      } else {
        toast.error("Registration failed");
      }
    } else {
      toast.error("Network error");
    }
  }
}


export const getUser = async (onFailure: () => void) => {
  try {
    const response = await Axios.get("/user-detail")
    store.set(userAtom, response.data)
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      const status = error.response.status;
      if (status === 400) {
        toast.warning("Fields are missing");
      } else if (status === 404) {
        toast.warning("User doesnot exists");
      } else if (status === 401) {
        toast.warning("No token")
      } else if (status >= 500) {
        toast.warning("Backend error");
      } else {
        toast.error("Registration failed");
      }
    } else {
      toast.error("Network error");
    }
    onFailure()
  }

}
