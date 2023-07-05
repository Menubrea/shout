import React from "react";
import { signOut, signIn, useSession } from "next-auth/react";
import { BiLogOutCircle, BiLogInCircle, BiSolidHomeAlt2 } from "react-icons/bi";
import { BsFillPlusCircleFill } from "react-icons/bs";
import { GiShouting } from "react-icons/gi";
import Image from "next/image";
import Link from "next/link";
import { api } from "@/utils/api";

const Header = () => {
  return (
    <header className="fixed left-0 top-0 m-0 h-screen w-16">
      <div className="flex h-12 w-full items-center justify-center gap-1 bg-base-300 text-accent">
        <GiShouting className="h-6 w-6" />
      </div>
      <Auth />
    </header>
  );
};

export default Header;

function Auth() {
  const [active, setActive] = React.useState<HTMLAnchorElement | null>(null);
  const { data: sessionData } = useSession();
  const userId = sessionData ? sessionData.user.id : "";
  const { data: profile } = api.users.getById.useQuery({ id: userId });
  const { chat } = profile || {};

  const handleSetActive = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const currentTarget = e.currentTarget;

    if (active) {
      active.classList.remove("border", "border-accent");
    }

    currentTarget.classList.add("border", "border-accent");

    setActive(currentTarget);
  };

  return (
    <div className="flex h-full flex-col items-center justify-between gap-1 bg-base-200 px-2">
      <nav className="mt-4 flex flex-col items-center gap-2">
        {sessionData ? (
          <Link
            onClick={(e) => handleSetActive(e)}
            className="btn-ghost btn-circle btn overflow-hidden"
            href={"/account"}
          >
            <Image
              width={48}
              height={48}
              className="h-12 w-12 rounded-full"
              src={sessionData.user?.image || ""}
              alt={sessionData.user?.name || ""}
            />
          </Link>
        ) : (
          <button
            className="btn-ghost btn-square btn-md btn"
            onClick={
              sessionData ? () => void signOut() : () => void signIn("discord")
            }
          >
            {sessionData ? (
              <BiLogOutCircle className="h-6 w-6" />
            ) : (
              <BiLogInCircle className="h-6 w-6" />
            )}
          </button>
        )}
        <Link
          onClick={(e) => handleSetActive(e)}
          className="btn-ghost btn-square btn"
          href="/"
        >
          <BiSolidHomeAlt2 className="h-6 w-6" />
        </Link>

        {sessionData && (
          <>
            <div className="divider my-0" />
            <Link
              onClick={(e) => handleSetActive(e)}
              href={"/chat"}
              className={`btn-ghost  btn-square btn `}
            >
              <BsFillPlusCircleFill className="h-6 w-6" />
            </Link>
            <div className="divider my-0" />
          </>
        )}

        <div>
          {chat?.map((c) => (
            <Link
              onClick={(e) => handleSetActive(e)}
              key={c.id}
              href={"/chat/" + c.id}
              className="btn-ghost btn-circle btn overflow-hidden"
            >
              <img
                width={16}
                height={16}
                className="object-fit aspect-square h-12 w-12 rounded-full"
                src={c.image || ""}
                alt={c.name}
              />
            </Link>
          ))}
        </div>
      </nav>
    </div>
  );
}
