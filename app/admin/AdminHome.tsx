"use client";

import StatusIndicator from "@/components/StatusIndicator";
import { H2, H3, P } from "@/components/TypoElement";
import useAlert from "@/components/useAlert";
import fetcher, { loading, loadingFailed } from "@/lib/fetcher";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  Checkbox,
  FormControlLabel,
  TextField,
  Typography,
} from "@mui/material";
import { Box, Container } from "@mui/system";
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
    <Container>
      <Box display="flex" gap={1}>
        <Button variant="contained" color="error" onClick={() => axios.delete("/api/v2/admin/login").then(() => router.push("/admin/login"))}>Logout</Button>
        <Button variant="contained" color="info" onClick={() => router.push("/admin/registry")}>Registry a new Administrator</Button>
      </Box>
      <AbstractList></AbstractList>
    </Container>
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

  if (error) return <Container>{loadingFailed}</Container>;

  if (list === undefined) return <Container>{loading}</Container>;

  return (
    <>
      <H2>Abstracts</H2>
      <Box display="flex" flexDirection="column" gap={1}>
      {list.map((itemId) => (
        <AbstractItem abstractId={itemId} key={itemId}></AbstractItem>
      ))}
      </Box>
      {displayAmount < list.length ? (
        <InView as={"div"} onChange={(inview) => setLoadMore(inview)}>
          <P>Loading more...</P>
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
      <Card>
        <CardContent>{loadingFailed}</CardContent>
      </Card>
    );

  if (abstract === undefined)
    return (
      <Card>
        <CardContent>{loading}</CardContent>
      </Card>
    );

  return (
    <Card>
      <CardContent>
        {alertCompnent}
        <Box display="flex" gap={1} alignItems="center">
          <StatusIndicator status={abstract.status}></StatusIndicator>
          <Typography variant="h5">{abstract.name}</Typography>
        </Box>
        <P>
          Created At: {format(new Date(abstract.createdAt), "yyyy-MM-dd hh:mm:ss")} | Last
          updated: {format(new Date(abstract.updatedAt), "yyyy-MM-dd hh:mm:ss")}
        </P>
        <H3>Authors</H3>
        <Box display="flex" flexDirection="column" gap={1}>
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
        </Box>
      </CardContent>
      <CardActions
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Button
          href={`${abstractPath}/attachment`}
          download={abstract.filename}
        >
          Download abstract
        </Button>
        <Button
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
        </Button>
        <Box
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
          <Button
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
          </Button>
        </Box>
        <Button
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
        </Button>
      </CardActions>
    </Card>
  );
}

function CollaboratorItem(props: {
  name: string;
  email: string;
  attend: boolean;
  presentor: boolean;
}) {
  return (
    <Box borderBottom={"solid grey 1px"}>
      <P>{props.name}</P>
      <P>{props.email}</P>
      <Box>
        <FormControlLabel
          control={<Checkbox checked={props.attend}></Checkbox>}
          label="Attend"
        ></FormControlLabel>
        <FormControlLabel
          control={<Checkbox checked={props.presentor}></Checkbox>}
          label="Presentor"
        ></FormControlLabel>
      </Box>
    </Box>
  );
}
