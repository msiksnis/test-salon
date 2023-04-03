import { signIn, signOut, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { sanityClientWithToken as client } from "../../utils/sanityAuth";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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

    useEffect(() => {
      if (session && session.user.email) {
        fetchUserRoles().then((usersRoles) => {
          const userRoleObj = usersRoles.find(
            (user) => user.email === session.user.email
          );
          const currentRole = userRoleObj ? userRoleObj.role : "guest";
          setUserRole(currentRole);

          if (!allowedRoles.includes(currentRole)) {
            setTimeout(() => {
              toast.error("Sorry, this is not an Admin email", {
                position: toast.POSITION.TOP_CENTER,
                autoClose: 3000,
              });
              setTimeout(() => {
                signOut();
              }, 3000);
            }, 100);
          }
        });
      }
    }, [session, router]);

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
        <ToastContainer draggable pauseOnHover theme="dark" />
        {status === "unauthenticated" && (
          <div className="flex flex-col justify-center items-center min-h-screen">
            <div>This part of the application is only for the admin.</div>
            <button
              onClick={handleSignIn}
              className="bg-slate-900 px-10 mt-4 py-2 rounded shadow text-white"
            >
              Sign In as Admin
            </button>
          </div>
        )}

        {status === "authenticated" &&
          (allowedRoles.includes(userRole) ? (
            <>
              <WrappedComponent session={session} {...props} />
            </>
          ) : (
            ""
          ))}
      </div>
    );
  };

  return WithAuthorizationWrapper;
}
