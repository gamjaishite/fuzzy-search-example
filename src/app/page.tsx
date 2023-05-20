import { Button, buttonVariants } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="text-6xl flex flex-col gap-4 justify-center min-h-screen items-center">
      <Image
        src="/bg-gradient.svg"
        fill={true}
        alt="Background"
        className="-z-10"
      />
      <h1 className="font-bold text-primary">Zuta Blog</h1>

      <Link href="/blog" className={buttonVariants({ variant: "secondary" })}>
        Telusuri
      </Link>
    </div>
  );
}
