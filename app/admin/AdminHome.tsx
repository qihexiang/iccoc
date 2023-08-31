"use client";

import StatusIndicator from "@/components/StatusIndicator";
import { h2, h3, P } from "@/components/TypoElement";
import useAlert from "@/components/useAlert";
import fetcher, { loading, loadingFailed } from "@/lib/fetcher";
import {
  button,
  Card,
  CardActions,
  CardContent,
  Checkdiv,
  FormControlLabel,
  TextField,
  Typography,
} from "@mui/material";
import { div, div } from "@mui/system";
import { Collaborator, ProjectStatus } from "@prisma/client";
import axios from "axios";
import { format } from "date-fns";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { InView } from "react-intersection-observer";
import useSWR from "swr";

export default function AdminHome() {
  const router = useRouter()
  return (
    <div>
      <div className="flex items-center gap-1">
        <button className="btn danger" onClick={() => axios.delete("/api/v2/admin/login").then(() => router.push("/admin/login"))}>Logout</button>
        <button className="btn info" onClick={() => router.push("/admin/registry")}>Registry a new Administrator</button>
      </div>
      <AbstractList></AbstractList>
    </div>
  );
}

function AbstractList() {
  const { data: list, error } = useSWR<number[]>(
    "/api/v2/admin/abstract",
    fetcher,
    {
      refreshInterval: 60 * 1000,
      errorRetryCount: 5,
      errorRetryInterval: 5 * 1000,
    }
  );

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
    if (displayAmount > (list?.length ?? 0)) {
      setLoadMore(false);
    }
  }, [list, displayAmount]);

  if (error) return <div>{loadingFailed}</div>;

  if (list === undefined) return <div>{loading}</div>;

  return (
    <>
      <h2>Abstracts</h2>
      <div className="flex items-center gap-1">
      {list.map((itemId) => (
        <AbstractItem abstractId={itemId} key={itemId}></AbstractItem>
      ))}
      </div>
      {displayAmount < list.length ? (
        <InView as={"div"} onChange={(inview) => setLoadMore(inview)}>
          <p>Loading more...</p>
        </InView>
      ) : null}
    </>
  );
}

function AbstractItem(props: { abstractId: number }) {
  const abstractPath = `/api/v2/admin/abstract/${props.abstractId}`;
  const [setInformation, alertCompnent] = useAlert(6000);
  const {
    data: abstract,
    error,
    mutate,
  } = useSWR<{
    name: string;
    user: {
      name: string;
      title: string;
      email: string;
      phoneNumber: string;
      institution: string;
    };
    filename: string;
    status: ProjectStatus;
    presontor: number | null;
    createdAt: string;
    updatedAt: string;
    collaborators: Collaborator[];
    rejectedWith: string | null;
  }>(abstractPath, fetcher, {
    refreshInterval: 60 * 1000,
    errorRetryCount: 5,
    errorRetryInterval: 5 * 1000,
  });

  const [rejectedWith, setRejectedWith] = useState("");

  if (error)
    return (
      <div className="rounded shadow-neutral-200 shadow-md">
        <div className="w-full">{loadingFailed}</div>
      </div>
    );

  if (abstract === undefined)
    return (
      <div className="rounded shadow-neutral-200 shadow-md">
        <div className="w-full">{loading}</div>
      </div>
    );

  return (
    <div className="rounded shadow-neutral-200 shadow-md">
      <div className="w-full">
        {alertCompnent}
        <div className="flex items-center gap-1">
          <StatusIndicator status={abstract.status}></StatusIndicator>
          <Typography variant="h5">{abstract.name}</Typography>
        </div>
        <p>
          Created At: {format(new Date(abstract.createdAt), "yyyy-MM-dd hh:mm:ss")} | Last
          updated: {format(new Date(abstract.updatedAt), "yyyy-MM-dd hh:mm:ss")}
        </p>
        <h3>Authors</h3>
        <div className="flex items-center gap-1">
          <CollaboratorItem
            name={`${abstract.user.name} ${abstract.user.institution} ${abstract.user.title}`}
            email={`${abstract.user.email}(${abstract.user.phoneNumber})`}
            attend={true}
            presentor={abstract.presontor === null}
          ></CollaboratorItem>
          {abstract.collaborators.map((item, idx) => (
            <CollaboratorItem
              key={idx}
              {...item}
              presentor={abstract.presontor === item.id}
            ></CollaboratorItem>
          ))}
        </div>
      </div>
      <CardActions
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <button
          href={`${abstractPath}/attachment`}
          download={abstract.filename}
        >
          Download abstract
        </button>
        <button
          color="success"
          disabled={abstract.status !== ProjectStatus.SUBMITTED}
          onClick={() => {
            axios
              .put(abstractPath, {
                status: ProjectStatus.ACCEPTED,
                rejectedWith: null,
              })
              .catch((_) =>
                setInformation({
                  color: "error",
                  message: "Failed to accept data",
                })
              )
              .finally(() => mutate());
          }}
        >
          Accept
        </button>
        <div
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <TextField
            fullWidth
            placeholder={
              abstract.rejectedWith ?? "Must give a reason to reject"
            }
            value={rejectedWith}
            onChange={(e) => setRejectedWith(e.target.value)}
          ></TextField>
          <button
            color="error"
            disabled={
              abstract.status !== ProjectStatus.SUBMITTED || rejectedWith === ""
            }
            onClick={() => {
              axios
                .put(abstractPath, {
                  status: ProjectStatus.REJECTED,
                  rejectedWith,
                })
                .catch((_) =>
                  setInformation({
                    color: "error",
                    message: "Failed to set status, please retry later",
                  })
                )
                .finally(() => {
                  setRejectedWith("");
                  mutate();
                });
            }}
          >
            Reject
          </button>
        </div>
        <button
          color="primary"
          disabled={
            abstract.status === ProjectStatus.SUBMITTED ||
            abstract.status === ProjectStatus.SAVED
          }
          onClick={() => {
            axios
              .put(abstractPath, {
                status: ProjectStatus.SUBMITTED,
                rejectedWith: null,
              })
              .catch((_) =>
                setInformation({ color: "error", message: "Failed to cancel" })
              )
              .finally(() => mutate());
          }}
        >
          Cancel
        </button>
      </CardActions>
    </div>
  );
}

function CollaboratorItem(props: {
  name: string;
  email: string;
  attend: boolean;
  presentor: boolean;
}) {
  return (
    <div borderBottom={"solid grey 1px"}>
      <p>{props.name}</p>
      <p>{props.email}</p>
      <div>
        <FormControlLabel
          control={<Checkdiv checked={props.attend}></Checkdiv>}
          label="Attend"
        ></FormControlLabel>
        <FormControlLabel
          control={<Checkdiv checked={props.presentor}></Checkdiv>}
          label="Presentor"
        ></FormControlLabel>
      </div>
    </div>
  );
}
