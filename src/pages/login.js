import { useSession, signIn, signOut } from "next-auth/react";
import Image from "next/image";

export default function LoginPage() {
  const { data: session } = useSession();

  const handleSignIn = () => {
    signIn("google", {
      callbackUrl: "/admin/dashboard",
      redirect: true,
    });
  };

  if (session) {
    return (
      <>
        <h1>Logged in as {session.user.email}</h1>
        <Image
          src={session.user.image}
          width={50}
          height={50}
          className="rounded-full"
        />
        <button onClick={() => signOut()}>Sign out</button>
      </>
    );
  }
  return (
    <div>
      <div>Please sign in</div>
      <button onClick={handleSignIn}>Sign in</button>
      {/* <button onClick={() => signIn()}>Sign in</button> */}
    </div>
  );
}
