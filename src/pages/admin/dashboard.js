import { signIn, signOut, useSession } from "next-auth/react";
import withAuthorization from "../../components/withAuthorization";

function DashboardPage() {
  const { data: session } = useSession({ required: true });

  const handleSignOut = () => {
    signOut({
      callbackUrl: "/login",
      redirect: true,
    });
  };

  return (
    <>
      <div className="">Dashboard Page</div>
      <div className="">Logged in as: {session.user.email}</div>
      <button onClick={handleSignOut}>Sign out</button>
    </>
  );
}

export default withAuthorization(DashboardPage, ["admin"]);
