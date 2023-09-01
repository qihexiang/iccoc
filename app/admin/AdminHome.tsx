"use client";

import useAlert from "@/components/useAlert";
import APIv2Type from "@/lib/APIv2Type";
import fetcher, { loading, loadingFailed } from "@/lib/fetcher";
import { useLoadMore } from "@/lib/useLoadMore";
import { Box } from "@mui/system";
import { Collaborator, ProjectStatus } from "@prisma/client";
import axios from "axios";
import { format } from "date-fns";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import useSWR from "swr";
import { GET as GetUser } from "../api/v2/admin/user/[id]/route";
import { GET as GetUsers } from "../api/v2/admin/user/route";
import StatusIndicator from "./StatusIndicator";
import "./tables.css";
import hotelbooking from "@/pages/api/user/hotelbooking";

export default function AdminHome() {
  const router = useRouter()
  return (
    <>
      <div className="flex gap-1">
        <button onClick={() => axios.delete("/api/v2/admin/login").then(() => router.push("/admin"))} className="btn danger">Logout</button>
        <button onClick={() => router.push("/admin/registry")} className="btn info">Add new administrator</button>
      </div>
      <UserList></UserList>
    </>
  );
}

function UserList() {
  const { data: userIds, error } = useSWR<APIv2Type<typeof GetUsers>>("/api/v2/admin/user", fetcher);
  const [displayAmount, loadMoreComponent] = useLoadMore(userIds)

  if (error) return <div><pre>{error}</pre></div>
  if (userIds === undefined) return <div>Loading...</div>

  return <div className="flex flex-col gap-1 typoblock">
    {userIds.slice(0, displayAmount).map(({ id }) => <UserItem key={id} id={id}></UserItem>)}
    {loadMoreComponent}
  </div>
}

function UserItem(props: { id: number }) {
  const { id } = props;
  const {
    data: user,
    error,
    mutate,
  } = useSWR<APIv2Type<typeof GetUser>>(`/api/v2/admin/user/${id}`, fetcher, {
    refreshInterval: 60 * 1000,
    errorRetryCount: 5,
    errorRetryInterval: 5 * 1000,
  });

  const [newPassword, setNewPassword] = useState("");

  if (error || user === null) return <Box>Loading failed</Box>;
  if (user === undefined) return <Box>Loading...</Box>;

  return (
    <div className="p-2 flex flex-col gap-1 rounded shadow-md shadow-neutral-200">
      <h3>{user.name}</h3>
      <p className="text-neutral-400 text-sm">
        {user.email} | {user.title} | {user.institution} | {user.userType}
      </p>
      <div className="flex items-center gap-1">
        <input
          type="password"
          placeholder="reset password for user"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        ></input>
        <button
          className="btn danger"
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
      <h4>Travel</h4>
      {user.travel !== null ?
        <div>
          <table>
            <thead>
              <tr>
                <th>Arrive</th>
                <th>Leave</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{format(new Date(user.travel.arrivalDate), "yyyy-MM-dd")}</td>
                <td>{format(new Date(user.travel.departureDate), "yyyy-MM-dd")}</td>
              </tr>
              <tr><td>{user.travel.arrivalNo}</td><td>{user.travel.departureNo}</td></tr>
            </tbody>
          </table>
          <div className="flex items-center gap-1"><input type="checkbox" checked={user.travel.attendVisit}></input><p>Attend visit on Oct23</p></div>
        </div>
        : null}
      <h4>Hotel</h4>
      {
        user.hotelBooking !== null ? <div>
          <div className="flex items-center gap-1"><input type="checkbox" checked={user.hotelBooking.bookBySelf}></input><p>Book by self</p></div>
          <div>
            Check-in: {format(new Date(user.hotelBooking.checkinDate), "yyyy-MM-dd")}
          </div>
          <div>
            Check-out: {format(new Date(user.hotelBooking.checkoutDate), "yyyy-MM-dd")}
          </div>
          <div>
            Selected hotel: {user.hotelBooking.location}
          </div>
          <div>
            Standard Rooms: {user.hotelBooking.standardRooms}
          </div>
          <div>
            King Rooms: {user.hotelBooking.kingRooms}
          </div>
        </div> : null
      }
      <h4>Collabortors</h4>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Attend</th>
          </tr>
        </thead>
        <tbody>
          {
            user.collaborators.filter(({ _count }) => _count.projects >= 1).map(({ name, email, attend }, idx) => <tr key={idx}>
              <td>{name}</td>
              <td>{email}</td>
              <td><input type="checkbox" checked={attend}></input></td>
            </tr>)
          }
        </tbody>
      </table>
      <h4>Abstracts</h4>
      <div>
        {
          user.projects.map(({ id }) => <AbstractItem key={id} abstractId={id}></AbstractItem>)
        }
      </div>
    </div>
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
      <div className="shadow-md shadow-neutral-200 rounded p-2">
        {loadingFailed}
      </div>
    );

  if (abstract === undefined)
    return (
      <div className="shadow-md shadow-neutral-200 rounded p-2">
        {loading}
      </div>
    );

  return (
    <div className="shadow-md shadow-neutral-200 rounded p-2">
      {alertCompnent}
      <div className="flex items-center gap-1">
        <StatusIndicator status={abstract.status}></StatusIndicator>
        <h3>{abstract.name}</h3>
      </div>
      <p>
        Created At: {format(new Date(abstract.createdAt), "yyyy-MM-dd hh:mm:ss")} | Last
        updated: {format(new Date(abstract.updatedAt), "yyyy-MM-dd hh:mm:ss")}
      </p>
      <h5>Authors</h5>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Presontor</th>
          </tr>
        </thead>
        <tbody>
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
        </tbody>
      </table>

      <div className="flex justify-between items-center">
        <a
          className="link"
          href={`${abstractPath}/attachment`}
          target={"_blank"}
          download={abstract.filename}
        >
          Download abstract
        </a>
        <button
          className="btn safe"
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
        <div className="flex gap-1 items-center mt-2">
          <input
            placeholder={
              abstract.rejectedWith ?? "Must give a reason to reject"
            }
            value={rejectedWith}
            onChange={(e) => setRejectedWith(e.target.value)}
          ></input>
          <button
            className="btn danger"
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
          className="btn primary"
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
      </div>
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
    <tr>
      <td>{props.name}</td>
      <td>{props.email}</td>
      <td><input type="checkbox" checked={props.presentor}></input></td>
    </tr>
  );
}
