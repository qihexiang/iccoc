import { User } from "@prisma/client";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import api from "./apiRequest";


export function useUser(options: {
  redirectTo: string;
  redirectOnLoggedIn: boolean;
}) {
  const [user, setUser] = useState<Omit<User, "password">>();
  const router = useRouter();
  useEffect(() => {
    if (user === undefined) {
      api.get("/user").then((res) => {
        if (res.status < 400 && res.status >= 200) {
          setUser(res.data);
          if (options.redirectOnLoggedIn) router.push(options.redirectTo);
        } else {
          if (!options.redirectOnLoggedIn) router.push(options.redirectTo);
        }
      });
    }
  }, [user, options.redirectOnLoggedIn, options.redirectTo, router]);
  return user;
}
