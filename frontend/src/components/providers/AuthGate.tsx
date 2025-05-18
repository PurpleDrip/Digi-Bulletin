"use client";

import { checkforcookies } from "@/api/auth";
import { setServer } from "@/store/serverSlice";
import { setUser } from "@/store/userSlice";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import {  useEffect, useState } from "react";
import { useDispatch } from "react-redux";

export default function AuthGate({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const dispatch=useDispatch();

  const [checkDone, setCheckDone] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ["checkCookies"],
    queryFn: checkforcookies,
    retry: false,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (!isLoading) {
        console.log("data", data);

        if(data?.data.success){
            dispatch(setUser(data?.data.data.user));
            dispatch(setServer(data?.data.data.server));
            router.replace("/home");
        }else{
            setCheckDone(true);
        }
    }
  }, [data, isLoading]);

  if (isLoading ) {
    return <p className="text-center mt-10">Checking authentication...</p>;
  }

  if(checkDone){
      return <>{children}</>;
  }

  return;
}
