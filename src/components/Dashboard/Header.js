import { signOut, useSession } from "next-auth/react";
import Image from "next/image";

export default function Header() {
  const { data: session } = useSession({ required: true });

  const handleSignOut = () => {
    signOut({
      callbackUrl: "/",
      redirect: true,
    });
  };

  return (
    <header className="fixed top-0 left-0 px-5 right-0 h-20 bg-slate-900 text-gray-100 flex items-center justify-between z-10">
      <div className="flex flex-col md:flex-row items-end md:space-x-4">
        <Image
          src="/logo/logo_white.png"
          width={250}
          height={40}
          alt="logo"
          className="hidden md:block object-cover"
        />
        <h1 className="text-2xl font-extralight italic mb-0.5">Dashboard</h1>
      </div>
      <div className="flex items-center md:items-end h-full md:mb-6 space-x-4 font-extralight">
        <div className="">Welcome, {session.user.name}</div>
        <button
          onClick={handleSignOut}
          className="hidden md:block border border-gray-100 rounded px-5 py-1.5"
        >
          Sign out
        </button>
      </div>
    </header>
  );
}
