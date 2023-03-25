import { useSession } from "next-auth/react";

export default function Home() {
  const { data: session } = useSession();

  return (
    <main className="text-xl">
      <h1>Main Page</h1>
      {session ? <div>Logged in as: {session.user.email}</div> : ""}
    </main>
  );
}
