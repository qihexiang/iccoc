import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import api from "./apiRequest";
enum Status {
  Pending,
  LoggedIn,
  NonLogged,
}

export function useUser(options: {
  redirectTo: string;
  redirectOnLoggedIn: boolean;
}) {
  const [[email, status], setEmail] = useState(["", Status.Pending]);
  const router = useRouter();
  if (status !== Status.Pending) {
    if ((status === Status.LoggedIn) === options.redirectOnLoggedIn) {
      router.push(options.redirectTo);
    }
  }
  useEffect(() => {
    api
      .get("/user")
      .then((res) => {
        if (res.status === 200 || res.status === 304) {
          setEmail([res.data.user.email, Status.LoggedIn]);
        } else {
          setEmail(["", Status.NonLogged]);
        }
      })
      .catch(() => {
        setEmail(["", Status.NonLogged]);
      });
  }, []);
  return email;
}
