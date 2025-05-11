import Image from "next/image";
import { Card } from "@/components/ui/card";

export function HeroVisual() {
  return (
    <Card className="relative h-full w-full overflow-hidden rounded-lg border-0 shadow-none md:border md:shadow-lg">
      <Image
        src="https://picsum.photos/1200/1200?grayscale&blur=2" // Using picsum.photos as per guidelines
        alt="Abstract background for DigiConnect"
        layout="fill"
        objectFit="cover"
        className="opacity-70"
        data-ai-hint="abstract technology"
        priority
      />
      <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/50 p-8 text-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-24 w-24 text-primary mb-6 animate-pulse"
          data-ai-hint="connectivity logo"
        >
          <path d="M10.62 3.513A7.913 7.913 0 0 0 4.3 8.051" />
          <path d="M13.38 20.487a7.913 7.913 0 0 0 6.291-4.538" />
          <path d="M3.513 13.38A7.913 7.913 0 0 0 8.051 19.7" />
          <path d="M20.487 10.62A7.913 7.913 0 0 0 15.949 4.3" />
          <path d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z" />
          <path d="M12 12a4 4 0 1 0 0 8 4 4 0 0 0 0-8Z" />
          <path d="M12 12a4 4 0 1 0-8 0 4 4 0 0 0 8 0Z" />
          <path d="M12 12a4 4 0 1 0 8 0 4 4 0 0 0-8 0Z" />
        </svg>

        <h1 className="text-5xl font-bold text-primary-foreground drop-shadow-md">
          DigiConnect
        </h1>
        <p className="mt-4 text-xl text-accent-foreground/80 drop-shadow-sm">
          Seamlessly Connect, Collaborate, and Create.
        </p>
        <p className="mt-2 text-md text-accent-foreground/70">
          Your digital gateway to a connected university experience.
        </p>
      </div>
    </Card>
  );
}
