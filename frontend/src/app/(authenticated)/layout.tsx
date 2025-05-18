"use client";

import { useToast } from "@/hooks/use-toast";
import { RootState } from "@/store/store";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useSelector } from "react-redux";

export default function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { toast } = useToast();
  const router = useRouter();
  const { id } = useSelector((state: RootState) => state.user);

  useEffect(() => {
    console.log("id", id);
    if (!id) {
      console.log("No user id found");
      toast({
        title: "Authentication Error",
        description: "Please Login or Register to access this page.",
        variant: "destructive",
      });
      router.replace("/");
    }
  }, [id, toast, router]);

  if (!id) {
    return null; 
  }

  return <>{children}</>;
}
