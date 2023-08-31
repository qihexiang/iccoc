"use client";

import { GET } from "@/app/api/v2/admin/user/[id]/route";
import APIv2Type from "@/lib/APIv2Type";
import fetcher from "@/lib/fetcher";
import { Box } from "@mui/system";
import axios from "axios";
import { useEffect, useState } from "react";
import { InView } from "react-intersection-observer";
import useSWR from "swr";

export default function UserManage(props: { users: { id: number }[] }) {
  const { users: userIds } = props;
  const [displayAmount, setDisplayAmount] = useState(20);
  const [loadMore, setLoadMore] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      if (loadMore) {
        setDisplayAmount((amount) => amount + 20);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [loadMore]);

  useEffect(() => {
    if (displayAmount > (userIds?.length ?? 0)) {
      setLoadMore(false);
    }
  }, [userIds, displayAmount]);

  return (
    <div>
      {userIds.slice(0, displayAmount).map(({ id }) => (
        <UserItem key={id} id={id}></UserItem>
      ))}
      {displayAmount < userIds.length ? (
        <InView as={"div"} onChange={(inview) => setLoadMore(inview)}>
          <p>Loading more...</p>
        </InView>
      ) : null}
    </div>
  );
}

type FetchedType = APIv2Type<typeof GET>;

function UserItem(props: { id: number }) {
  const { id } = props;
  const {
    data: user,
    error,
    mutate,
  } = useSWR<FetchedType>(`/api/v2/admin/user/${id}`, fetcher, {
    refreshInterval: 60 * 1000,
    errorRetryCount: 5,
    errorRetryInterval: 5 * 1000,
  });

  const [newPassword, setNewPassword] = useState("");

  if (error || user === null) return <Box>Loading failed</Box>;
  if (user === undefined) return <Box>Loading...</Box>;

  return (
    <div>
      <hr></hr>
      <p>
        {user.email} | {user.name} | {user.title} | {user.institution} |{" "}
        {user.userType}
      </p>
      <input
        type="password"
        placeholder="reset password for user"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
      ></input>
      <button
        onClick={() => {
          axios
            .put(`/api/v2/admin/user/${id}/passwd`, { newPassword })
            .then((res) => {
              alert("Success");
              setNewPassword("");
            })
            .catch((res) => {
              alert("Failed, retry later");
            })
            .finally(mutate);
        }}
      >
        Reset Password
      </button>
    </div>
  );
}
