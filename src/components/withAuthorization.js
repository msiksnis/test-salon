import { signIn, signOut, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { client } from "../../lib/sanity.client";

async function fetchUserRoles() {
  const query = `*[_type == "userRole"]{email,
  "role": role->name}`;
  const userRoles = await client.fetch(query);
  return userRoles;
}

export default function withAuthorization(WrappedComponent, allowedRoles) {
  const WithAuthorizationWrapper = (props) => {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [userRole, setUserRole] = useState("guest");
    const [message, setMessage] = useState(null);

    useEffect(() => {
      if (status === "authenticated") {
        fetchUserRoles().then((usersRoles) => {
          console.log("Fetched User Roles:", usersRoles);
          const userRoleObj = usersRoles.find(
            (user) => user.email === session.user.email
          );
          const currentRole = userRoleObj ? userRoleObj.role : "guest";
          console.log("Current Role:", currentRole);
          setUserRole(currentRole);
          console.log("Allowed Roles:", allowedRoles);

          if (!allowedRoles.includes(currentRole)) {
            setMessage(
              <>
                <div className="text-2xl text-slate-900 flex justify-center items-center ">
                  Sorry, this part of the application is only for the admin.
                </div>
              </>
            );
          }
        });
      }
    }, [session, status, router]);

    const handleBackToHomePage = () => {
      signOut({
        callbackUrl: "/",
        redirect: true,
      });
    };

    const handleSignIn = () => {
      signIn({ callbackUrl: "/admin/dashboard" });
    };

    return (
      <div className="">
        {status === "unauthenticated" && (
          <div className="flex flex-col justify-center items-center min-h-screen">
            <div>Please Sign In</div>
            <button
              onClick={handleSignIn}
              className="bg-slate-900 px-10 mt-4 py-2 rounded shadow text-white"
            >
              Sign in
            </button>
          </div>
        )}
        {message && (
          <div className="flex flex-col justify-center items-center min-h-screen">
            {message}
            <div className="flex justify-center items-center mt-4 space-x-4">
              <button
                onClick={handleBackToHomePage}
                className="bg-slate-900 px-10 py-2 rounded shadow text-white"
              >
                Back to Home Page
              </button>
              <button
                onClick={handleSignIn}
                className="bg-slate-900 px-10 py-2 rounded shadow text-white"
              >
                Sign In as Admin
              </button>
            </div>
          </div>
        )}
        {status === "authenticated" &&
          (allowedRoles.includes(userRole) ? (
            <WrappedComponent {...props} />
          ) : (
            ""
          ))}
      </div>
    );
  };

  return WithAuthorizationWrapper;
}
