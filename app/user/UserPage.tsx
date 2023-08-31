"use client";

import StatusIndicator from "@/components/StatusIndicator";
import { h3, P } from "@/components/TypoElement";
import fetcher, { loading, loadingFailed } from "@/lib/fetcher";
import {
  button,
  Card,
  CardContent,
  Checkdiv,
  FormControlLabel,
  TextField,
  Typography,
} from "@mui/material";
import { div, div } from "@mui/system";
import { Collaborator, ProjectStatus } from "@prisma/client";
import useSWR, { useSWRConfig } from "swr";
import { createContext, useContext } from "react";
import ClickInputSave from "@/components/ClickInputSave";
import axios from "axios";
import useAlert from "@/components/useAlert";
import { Save, Edit, Cancel } from "@mui/icons-material";

const UserPageSWRCtx = createContext<{
  mutate: (key: string) => void;
}>({ mutate: (_) => {} });

const useMutate = () => {
  const { mutate } = useContext(UserPageSWRCtx);
  return mutate;
};

export default function UserPage() {
  const { mutate } = useSWRConfig();
  const { data: user, error } = useSWR<{
    name: string;
    email: string;
    phoneNumber: string;
    institution: string;
    title: string;
  }>("/api/v2/user", fetcher, {
    refreshInterval: 5 * 60 * 1000,
    errorRetryCount: 5,
    errorRetryInterval: 5 * 1000,
  });

  if (error) return <div>{loadingFailed}</div>;

  if (user === undefined) return <div>{loading}</div>;

  return (
    <UserPageSWRCtx.Provider value={{ mutate }}>
      <div>
        <div display={"flex"} flexWrap="wrap" alignItems={"center"} gap={1}>
          <div>
            <Typography variant="h6">Welcome, {user.name}</Typography>
            <Typography variant="body1">{user.email}</Typography>
          </div>
          <button variant="contained">Modify personal information</button>
          <button variant="contained">Add travel information</button>
          <button variant="contained">Hotel booking</button>
        </div>
        <AbstractList></AbstractList>
      </div>
    </UserPageSWRCtx.Provider>
  );
}

function AbstractList() {
  const { data: list, error } = useSWR<number[]>(
    "/api/v2/user/abstracts",
    fetcher,
    {
      refreshInterval: 5 * 60 * 1000,
      errorRetryCount: 5,
      errorRetryInterval: 5 * 1000,
    }
  );

  if (error) return loadingFailed;

  if (list === undefined) return loading;

  return (
    <div display={"flex"} flexDirection={"column"} gap={1}>
      {list.map((itemId) => (
        <AbstractItem itemId={itemId} key={itemId}></AbstractItem>
      ))}
    </div>
  );
}

function AbstractItem(props: { itemId: number }) {
  const { data: abstract, error } = useSWR<{
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
  }>(`/api/v2/user/abstracts/${props.itemId}`, fetcher, {
    refreshInterval: 5 * 60 * 1000,
    errorRetryCount: 5,
    errorRetryInterval: 5 * 1000,
  });

  if (error) return loadingFailed;

  if (abstract === undefined) return loading;

  return (
    <Card>
      <CardContent>
        <div display="flex" gap={1} alignItems="center">
          <StatusIndicator status={abstract.status}></StatusIndicator>
          <Typography variant="h5" display="flex" alignItems="center">
            <AbstractModifiable
              itemId={props.itemId}
              currentValue={abstract.name}
              propName="name"
            ></AbstractModifiable>
          </Typography>
        </div>
        <p>
          Created At: {new Date(abstract.createdAt).toLocaleDateString()} | Last
          updated: {new Date(abstract.updatedAt).toLocaleDateString()}
        </p>
        <h3>Authors</h3>
        <div display="flex" flexDirection="column" gap={1}>
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
      </CardContent>
    </Card>
  );
}

function AbstractModifiable(props: {
  itemId: number;
  container?: (value: string) => JSX.Element | string;
  currentValue: string;
  propName: string;
}) {
  const mutate = useMutate();
  const { itemId, currentValue, propName, container } = props;
  const [setInformation, alertElement] = useAlert(6000);
  return (
    <ClickInputSave
      initValue={currentValue}
      container={container ?? ((value) => value)}
      inputdiv={(value, onChange) => (
        <>
          {alertElement}
          <TextField
            value={value}
            onChange={(e) => onChange(e.target.value)}
          ></TextField>
        </>
      )}
      onSave={(value) =>
        axios
          .put(`/api/v2/user/abstracts/${itemId}`, { [propName]: value })
          .then((_) => {
            setInformation({ color: "success", message: "Update successful" });
            return true;
          })
          .catch((_) => {
            setInformation({
              color: "error",
              message: "Failed to update information, please retry later",
            });
            return false;
          })
          .finally(() => mutate(`/api/v2/user/abstracts/${itemId}`))
      }
      clickBtn={(onClick) => (
        <>
          {alertElement}
          <button color="info" variant="text" onClick={onClick}>
            <Edit></Edit>
          </button>
        </>
      )}
      saveBtn={(onClick) => (
        <button color="success" variant="text" onClick={onClick}>
          <Save></Save>
        </button>
      )}
      cancelBtn={(onClick) => (
        <button color="warning" variant="text" onClick={onClick}>
          <Cancel></Cancel>
        </button>
      )}
    ></ClickInputSave>
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
