import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LinkIcon, LogOut } from "lucide-react";
import { UrlState } from "@/context";
import useFetch from "@/hooks/useFetch";
import { logout } from "../../db/apiAuth";
import { BarLoader } from "react-spinners";

const Header = () => {
  const navigate = useNavigate();
  const { user, fetchUser } = UrlState();
  const { loading, funct: fnLogout } = useFetch(logout);
  return (
    <>
      <nav className="flex justify-between items-center">
        <Link to="/">
          <img src="/logo.png" alt="url-shortner-logo" className="h-12 w-12" />
        </Link>

        <div>
          {!user ? (
            <Button onClick={(auth) => navigate("/auth")}>Login</Button>
          ) : (
            <DropdownMenu>
              <DropdownMenuTrigger className="w-10 rounded-full overflow-hidden">
                <Avatar>
                  <AvatarImage
                    src={user?.user_metadata?.profile_pic}
                    className="object-cover"
                  />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>
                  {user?.user_metadata?.name}
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <LinkIcon className=" h-4 w-4" />
                  My Links
                </DropdownMenuItem>
                <DropdownMenuItem className="text-red-500">
                  <LogOut className=" h-4 w-4" />
                  <span
                    onClick={() => {
                      fnLogout().then(() => {
                        fetchUser();
                        navigate("/");
                      });
                    }}
                  >
                    Logout
                  </span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </nav>
      {loading && (
        <BarLoader width={"100%"} className="mb-2 mt-4" color="#36d7b7" />
      )}
    </>
  );
};

export default Header;
