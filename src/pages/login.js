// /pages/login.js
import { signIn, signOut, useSession } from "next-auth/react";
import { client } from "../../lib/sanity.client";

export default function LoginPage() {
  const { data: session } = useSession();
  console.log(session);

  const handleSignIn = () => {
    signIn("google", {
      callbackUrl: "/admin/dashboard",
      redirect: true,
    });
  };

  const getAllDocuments = async () => {
    const query = `*`;

    try {
      const documents = await client.fetch(query);
      console.log("documents", documents);
    } catch (error) {
      console.error("errrrror", error);
    }
  };

  if (session) {
    return (
      <>
        <h1>Logged in as {session.user.email}</h1>

        <button onClick={() => signOut()}>Sign out</button>
        <button onClick={() => getAllDocuments()}>Get All Documents</button>
      </>
    );
  }
  return (
    <div>
      <div>Please sign in</div>
      <button onClick={handleSignIn}>Sign in</button>
    </div>
  );
}
