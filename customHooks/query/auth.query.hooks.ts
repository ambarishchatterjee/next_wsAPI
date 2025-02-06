import { Cookies } from "react-cookie";
import { useGlobalHooks } from "../globalHooks/gloBalHooks";
import { loginProps, registerProps } from "@/typeScript/auth.interface";
import { useMutation, UseMutationResult } from "@tanstack/react-query";
import { loginFn, registerFn } from "@/api/funcTions/auth.api";
import toast from "react-hot-toast";
import { useRouter } from "next/router";



export const loginMutation = (): UseMutationResult<loginProps, unknown> => {
  const { queryClient } = useGlobalHooks();
  const router = useRouter()
  const cookie = new Cookies();
  return useMutation<loginProps, void, unknown>({
    mutationFn: loginFn,
    onSuccess: (res) => {
      const { token, status, message, data } = res || {};
      console.log(data);
      

      if (status === 200 && token) {
        cookie.set("token", token, { path: "/", secure: true });
        localStorage.setItem("user", JSON.stringify(data));
        toast.success("Login successful! Welcome back.");
        router.push("/cms/list");
      } else {
        toast.error(message || "Login failed.");
      }

      queryClient.invalidateQueries({ queryKey: ["USER"] });
    },
    onError: (error: any) => {
      toast.error("Login failed. Please check your credentials and try again.");
      queryClient.invalidateQueries({ queryKey: ["USER"] });
    },
  });
};



export const registerMutation = (): UseMutationResult<registerProps, unknown> => {
  const { queryClient } = useGlobalHooks();
  const cookie = new Cookies();
  return useMutation<registerProps, void, unknown>({
    mutationFn: registerFn,
    onSuccess: (res) => {
      const { token, status, message, user } = res || {};

      if (status === 200 && token) {
        cookie.set("token", token, { path: "/", secure: true });
        localStorage.setItem("user", JSON.stringify(user));
        toast.success("Registration successful! Welcome aboard.");
      } else {
        toast.error(message || "Registration failed.");
      }

      queryClient.invalidateQueries({ queryKey: ["REGISTER"] });
    },
    onError: (error: any, variables, context) => {
      toast.error("Registration failed. Please try again.");
      queryClient.invalidateQueries({ queryKey: ["REGISTER"] });
    },
  });
};
