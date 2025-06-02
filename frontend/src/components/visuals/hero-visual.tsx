import Image from "next/image";
import { Card } from "@/components/ui/card";
import { Separator } from "../ui/separator";
import Logo from "./Logo";

export function HeroVisual() {
  return (
    <Card className="relative h-full w-full overflow-hidden rounded-lg border-0 shadow-none md:border md:shadow-lg">
      <div className="absolute gap-8 inset-0 flex items-center justify-center bg-black/50 p">
        <Image src="/images/brand.png" alt="Main Logo" width={300} height={100}/>

        <Separator orientation="vertical" className="h-[5rem] bg-white"/>

        <Logo/>
      </div>
    </Card>
  );
}
