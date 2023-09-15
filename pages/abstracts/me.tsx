import Contact from "@/components/Contact";
import StatusIndicator from "@/components/StatusIndicator";
import { H2, P } from "@/components/TypoElement";
import useAlert from "@/components/useAlert";
import api from "@/lib/apiRequest";
import { useUser } from "@/lib/useUser";
import { Upload } from "@mui/icons-material";
import {
  Box,
  Button,
  ButtonGroup,
  Card,
  CardActions,
  CardContent,
  Checkbox,
  Chip,
  FormControl,
  FormControlLabel,
  InputLabel,
  MenuItem,
  Select,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import {
  Collaborator,
  Project,
  ProjectStatus,
  ProjectType,
  User,
} from "@prisma/client";
import Head from "next/head";
import { useRouter } from "next/router";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

type UserProjectData = {
  projects: (Project & { collaborators: Collaborator[] })[];
  collaborators: Collaborator[];
};

const UserProjectCtx = createContext<
  UserProjectData & {
    refresh: (prop?: keyof UserProjectData) => void;
  }
>({
  projects: [],
  collaborators: [],
  refresh: (prop) => {},
});

export default function MeView() {
  const user = useUser({
    redirectTo: "/abstracts/login",
    redirectOnLoggedIn: false,
  });

  const [setAlertInfo, alertElement] = useAlert(6000);

  const [data, setData] = useState<{
    projects: (Project & { collaborators: Collaborator[] })[];
    collaborators: Collaborator[];
  }>({
    projects: [],
    collaborators: [],
  });

  const refresh = useCallback(
    (prop?: keyof UserProjectData) => {
      if (prop === "collaborators") {
        api
          .get(`/user/collaborator`)
          .catch(() => ({ status: 500, data: "Network Error" }))
          .then((res) => {
            if (res.status < 400) {
              setData((data) => ({ ...data, collaborators: res.data }));
            } else {
              setAlertInfo({
                color: "error",
                message: "Failed to get data, please refresh and retry",
              });
            }
          });
      }
      if (prop === "projects") {
        api
          .get("/user/project")
          .catch(() => ({ status: 500, data: "Network Error" }))
          .then((res) => {
            if (res.status < 400) {
              setData((data) => ({ ...data, projects: res.data }));
            } else {
              setAlertInfo({
                color: "error",
                message: "Failed to get data, please refresh and retry",
              });
            }
          });
      }
      if (prop === undefined) {
        Promise.all([api.get("/user/project"), api.get("/user/collaborator")])
          .catch(() => [
            { status: 500, data: "Network Error" },
            { status: 500, data: "Network Error" },
          ])
          .then(([pRes, cRes]) => {
            if (pRes.status < 400 && cRes.status < 400) {
              setData({ projects: pRes.data, collaborators: cRes.data });
            } else {
              setAlertInfo({
                color: "error",
                message: "Failed to get data, please refresh and retry",
              });
            }
          });
      }
    },
    [setAlertInfo]
  );

  useEffect(() => {
    refresh();
  }, [refresh]);

  if (user === undefined) {
    return null;
  }

  return (
    <>
      <Head>
        <title>Personal center - ICCOC2023</title>
      </Head>
      <Box display={"flex"} flexDirection={"column"} gap={1}>
        <Contact></Contact>
        {user !== undefined ? (
          <PersonalCenterHeader
            email={user.email}
            name={user.name}
          ></PersonalCenterHeader>
        ) : null}
        {alertElement}
        <UserProjectCtx.Provider
          value={{
            ...data,
            refresh,
          }}
        >
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Type</TableCell>
                <TableCell>Title</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Presentor</TableCell>
                <TableCell>Operations</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.projects.map((p, idx) => (
                <ProjectItem
                  key={idx}
                  project={p}
                  user={user}
                  afterSave={refresh}
                ></ProjectItem>
              ))}
              <ProjectItem
                project={null}
                user={user}
                afterSave={refresh}
              ></ProjectItem>
            </TableBody>
          </Table>
        </UserProjectCtx.Provider>
      </Box>
    </>
  );
}

function PersonalCenterHeader(props: { email: string; name: string }) {
  const router = useRouter();
  const { email, name } = props;
  return (
    <Box
      sx={{ display: "flex", gap: 2, flexWrap: "wrap", alignItems: "center" }}
    >
      <Box>
        <Typography variant="h6">Welcome, {name}</Typography>
        <Typography variant="overline">{email}</Typography>
      </Box>
      <Button
        variant="contained"
        color="info"
        onClick={() => router.push("/abstracts/personal")}
      >
        Personal Information
      </Button>
      <Button
        variant="contained"
        color="info"
        onClick={() => router.push("/abstracts/travel")}
      >
        Travel Information
      </Button>
      <Button
        variant="contained"
        color="info"
        onClick={() => router.push("/abstracts/hotelbooking")}
      >
        Hotel Booking Support
      </Button>{" "}
      <Button
        variant="contained"
        color="error"
        onClick={() => {
          api.post("/user/logout").finally(() => router.push("/"));
        }}
      >
        Logout
      </Button>
    </Box>
  );
}

function ProjectItem(props: {
  project: (Project & { collaborators: Collaborator[] }) | null;
  user: Omit<User, "password">;
  afterSave: () => void;
}) {
  const { project, afterSave } = props;
  const [editState, setEditState] = useState(false);
  const { collaborators } = useContext(UserProjectCtx);
  const [setAlertInfo, alertElement] = useAlert(6000);
  if (editState || project === null) {
    return (
      <TableRow>
        <TableCell colSpan={5}>
          <ProjectEditor
            project={project}
            user={props.user}
            afterSave={() => {
              setEditState(false);
              afterSave();
            }}
          ></ProjectEditor>
        </TableCell>
      </TableRow>
    );
  } else {
    const presontor = collaborators.find((c) => c.id === project.presontor);
    return (
      <TableRow>
        <TableCell>
          <Chip
            color={project.type === "POSTER" ? "secondary" : "primary"}
            label={project.type}
          ></Chip>
        </TableCell>
        <TableCell>{project.name}</TableCell>
        <TableCell>
          <StatusIndicator status={project.status}></StatusIndicator>
          {project.status === ProjectStatus.REJECTED ? (
            <P>{project.rejectedWith}</P>
          ) : null}
        </TableCell>
        <TableCell>
          {presontor === undefined
            ? `${props.user.name} (${props.user.email})`
            : `${presontor.name} (${presontor.email})`}
        </TableCell>
        <TableCell>
          {project.status === ProjectStatus.SAVED ? (
            <ButtonGroup variant="contained">
              <Button onClick={() => setEditState(true)} color="primary">
                Edit
              </Button>
              <Button
                color="success"
                onClick={() => {
                  api
                    .post(`/user/project/${project.id}/status`)
                    .catch(() => ({ status: 500, data: "Network Error" }))
                    .then((res) => {
                      if (res.status < 400) {
                        setAlertInfo({
                          color: "success",
                          message: "Submitted!",
                        });
                        props.afterSave();
                      } else {
                        setAlertInfo({
                          color: "error",
                          message: "Failed to submit. Please retry later.",
                        });
                      }
                    });
                }}
              >
                Submit
              </Button>
              <Button
                color="error"
                onClick={() => {
                  api
                    .delete(`/user/project/${project.id}`)
                    .catch(() => ({ status: 500, data: "Network Error" }))
                    .then((res) => {
                      if (res.status < 400) {
                        setAlertInfo({ color: "success", message: "Deleted" });
                        props.afterSave();
                      } else {
                        setAlertInfo({
                          color: "error",
                          message: "Failed to delete. Please retry later.",
                        });
                      }
                    });
                }}
              >
                Remove
              </Button>
            </ButtonGroup>
          ) : null}
          {project.status === ProjectStatus.SUBMITTED ||
          project.status === ProjectStatus.REJECTED ? (
            <Button
              variant="contained"
              color="info"
              onClick={() => {
                api
                  .delete(`/user/project/${project.id}/status`)
                  .catch(() => ({ status: 500, data: "Network Error" }))
                  .then((res) => {
                    if (res.status < 400) {
                      setAlertInfo({ color: "success", message: "Withdrawed" });
                      props.afterSave();
                    } else {
                      setAlertInfo({
                        color: "error",
                        message: "Failed to withdraw. Please retry later.",
                      });
                    }
                  });
              }}
            >
              Withdraw
            </Button>
          ) : null}
        </TableCell>
      </TableRow>
    );
  }
}

function ProjectEditor(props: {
  project: (Project & { collaborators: Collaborator[] }) | null;
  user: Omit<User, "password">;
  afterSave: () => void;
}) {
  const [setAlertInfo, alertElement] = useAlert(6000);
  const router = useRouter();
  const [project, setProject] = useState(props.project);
  const [waiting, setWaiting] = useState<string | undefined>(undefined);
  const { collaborators } = useContext(UserProjectCtx);

  if (project === null) {
    return (
      <ProjectCreator
        afterSave={(project) => {
          setProject(project);
        }}
      ></ProjectCreator>
    );
  } else {
    const projectId = project.id;

    const updateProject = (patch: Partial<typeof project>) => {
      setProject({ ...project, ...patch });
    };

    const upload = () =>
      api
        .put(`/user/project/${projectId}/basic`, {
          name: project.name,
          type: project.type,
          presontor: project.presontor,
        })
        .catch(() => ({ status: 500, data: "Network Error" }));

    return (
      <Box display={"flex"} flexDirection={"column"} marginTop={2}>
        {alertElement}
        <Box display={"flex"} flexDirection={"column"} gap={1}>
          <Typography variant="h5">Update abstract</Typography>
          <FormControl>
            <InputLabel>Type</InputLabel>
            <Select
              label={"Type"}
              value={project.type}
              onChange={(e) =>
                updateProject({ type: e.target.value as ProjectType })
              }
            >
              <MenuItem value={ProjectType.POSTER}>Poster</MenuItem>
              <MenuItem value={ProjectType.TALK}>Talk</MenuItem>
            </Select>
          </FormControl>
          <TextField
            label={"Title"}
            value={project.name}
            onChange={(e) => updateProject({ name: e.target.value })}
          ></TextField>
          <Box display={"flex"} gap={1} flexWrap={"wrap"}>
            <Box display="flex" gap={1} alignItems="center">
              <Button
                href={`/api/user/project/${project.id}/attachment`}
                download={project.filename}
              >
                {project.filename}
              </Button>
              <Button
                disabled={waiting !== undefined}
                variant="contained"
                component="label"
              >
                <Upload></Upload>
                {waiting === undefined
                  ? `upload file to replace ${project.filename}`
                  : waiting}
                <input
                  onChange={(e) => {
                    const form = new FormData();
                    if (e.target.files === null) {
                      return;
                    }
                    form.append("updated", e.target.files[0]);
                    api
                      .put(`/user/project/${projectId}/attachment`, form, {
                        onUploadProgress(e) {
                          if (e.total !== undefined) {
                            setWaiting(
                              `${((e.loaded / e.total) * 100).toFixed(2)}%`
                            );
                          } else {
                            setWaiting(
                              `${(e.loaded / 1024 / 1024).toFixed(2)}MB`
                            );
                          }
                        },
                      })
                      .catch(() => ({ status: 500, data: "Network Error" }))
                      .then((res) => {
                        if (res.status < 400) {
                          updateProject({
                            filename: e.target.files![0].name,
                          });
                        } else {
                          setAlertInfo({
                            color: "error",
                            message:
                              "Failed to update the file. May it's larger than 32MB?",
                          });
                        }
                      })
                      .finally(() => setWaiting(undefined));
                  }}
                  hidden
                  type="file"
                />
              </Button>
              <Button
                color="info"
                href="/Template.docx"
                download={"Template.docx"}
              >
                Download Template
              </Button>
            </Box>
          </Box>
          <Box display={"flex"} gap={1} flexWrap={"wrap"}>
            <TextField
              label={"Full name"}
              value={props.user.name}
              disabled
            ></TextField>
            <TextField
              label={"Email address"}
              value={props.user.email}
              disabled
            ></TextField>
            <FormControlLabel
              label="Attend"
              control={<Checkbox checked={true} disabled></Checkbox>}
            ></FormControlLabel>
            <Button
              variant="contained"
              color="info"
              onClick={() => router.push("/abstracts/personal")}
            >
              Modify
            </Button>
          </Box>
          {project.collaborators.map((c, idx) => (
            <CollaboratorEditor
              key={idx}
              projectId={project.id}
              email={c.email}
              afterSave={(updated) => setProject(updated)}
            ></CollaboratorEditor>
          ))}
          <Typography variant="overline">Add another collaborator</Typography>
          <CollaboratorEditor
            projectId={project.id}
            afterSave={(project) => {
              setProject(project);
            }}
          ></CollaboratorEditor>
          <FormControl>
            <InputLabel>Presontor</InputLabel>
            <Select
              label={"Presontor"}
              value={project.presontor ?? -1}
              onChange={(e) => {
                if (
                  e.target.value === -1 ||
                  !collaborators
                    .map((c) => c.id)
                    .includes(e.target.value as number)
                ) {
                  updateProject({ presontor: null });
                } else {
                  updateProject({ presontor: e.target.value as number });
                }
              }}
            >
              <MenuItem value={-1}>
                {props.user.name} - {props.user.email}
              </MenuItem>
              {project.collaborators.map((c, idx) => (
                <MenuItem key={idx} value={c.id}>
                  {c.name} - {c.email}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
        <Box display={"flex"} gap={1} marginTop={1} alignItems={"center"}>
          <Button
            variant="contained"
            color="success"
            onClick={() => {
              upload().then((res) => {
                if (res.status < 400) {
                  setProject(null);
                  props.afterSave();
                } else {
                  setAlertInfo({
                    color: "error",
                    message: "Faild to update data.",
                  });
                }
              });
            }}
          >
            Save
          </Button>
          <Button
            variant="contained"
            color="success"
            onClick={() => {
              upload().then(async (res) => {
                if (res.status < 400) {
                  await api.post(`/user/project/${project.id}/status`);
                  setProject(null);
                  props.afterSave();
                } else {
                  setAlertInfo({
                    color: "error",
                    message: "Faild to update data.",
                  });
                }
              });
            }}
          >
            Save & Submit
          </Button>
        </Box>
      </Box>
    );
  }
}

function ProjectCreator(props: {
  afterSave: (project: Project & { collaborators: Collaborator[] }) => void;
}) {
  const [setAlertInfo, alertElement] = useAlert(6000);

  const [basicInfo, setBasicInfo] = useState({
    name: "",
    type: ProjectType.TALK as ProjectType,
  });

  const [file, setFile] = useState<File>();

  const updateBasicInfo = (patch: Partial<typeof basicInfo>) => {
    setBasicInfo({ ...basicInfo, ...patch });
  };

  const uploadFn = () => {
    if (basicInfo.name === "") {
      setAlertInfo({ color: "error", message: "Must input title." });
      throw null;
    }
    if (file === undefined) {
      setAlertInfo({
        color: "error",
        message: "Please select an attachment file.",
      });
      throw null;
    }
    const form = new FormData();
    form.append("name", basicInfo.name);
    form.append("type", basicInfo.type);
    form.append("upload", file);
    return api
      .post("/user/project", form)
      .catch(() => ({ status: 500, data: "Network Error" }));
  };

  return (
    <Box display={"flex"} flexDirection={"column"} gap={1}>
        <Typography variant="h5">Submit a new abstract</Typography>
        {alertElement}
        <Box display={"flex"} flexDirection={"column"} gap={2}>
          <FormControl>
            <InputLabel>Type</InputLabel>
            <Select
              label={"Type"}
              value={basicInfo.type}
              onChange={(e) =>
                updateBasicInfo({ type: e.target.value as ProjectType })
              }
            >
              <MenuItem value={ProjectType.POSTER}>Poster</MenuItem>
              <MenuItem value={ProjectType.TALK}>Talk</MenuItem>
            </Select>
          </FormControl>
          <TextField
            fullWidth
            label={"Title"}
            value={basicInfo.name}
            onChange={(e) => updateBasicInfo({ name: e.target.value })}
          ></TextField>
          <Box display={basicInfo.name === "" ? "none" : "flex"} gap={1}>
            <Button
              disabled={basicInfo.name === ""}
              variant="contained"
              component="label"
            >
              <Upload></Upload>
              {file === undefined
                ? "Choose a file (less than 32MB) to upload as abstract"
                : `Choose a file (less than 32MB) to replace ${file.name}`}
              <input
                onChange={(e) => {
                  setFile(e.target.files?.item(0) ?? undefined);
                }}
                hidden
                type="file"
              />
            </Button>
            <Button
              color="info"
              href="/Template.docx"
              download={"Template.docx"}
            >
              Download Template
            </Button>
          </Box>
        </Box>
      <Box display={"flex"} gap={1}>
        <Button
          variant="contained"
          color="success"
          onClick={() => {
            uploadFn().then((res) => {
              if (res.status < 400) {
                props.afterSave(res.data);
              } else {
                setAlertInfo({
                  color: "error",
                  message:
                    "Faild to update data. May the attachment is too large?",
                });
              }
            });
          }}
        >
          Next
        </Button>
      </Box>
    </Box>
  );
}

function CollaboratorEditor(props: {
  email?: string;
  projectId?: number;
  afterSave: (updated: Project & { collaborators: Collaborator[] }) => void;
}) {
  const [setAlertInfo, alertElement] = useAlert(6000);
  const { collaborators, refresh } = useContext(UserProjectCtx);
  const [collaborator, setCollaborator] = useState(
    collaborators.find((c) => c.email === props.email) ?? {
      email: "",
      name: "",
      attend: false,
    }
  );

  const updateCollaborator = (patch: Partial<typeof collaborator>) => {
    setCollaborator({ ...collaborator, ...patch });
  };

  useEffect(() => {
    const matched = collaborators.find((c) => c.email === collaborator.email);
    if (matched !== undefined) {
      setCollaborator(matched);
    }
  }, [collaborator.email, collaborators]);

  useEffect(() => {
    setCollaborator(
      collaborators.find((c) => c.email === props.email) ?? {
        email: "",
        name: "",
        attend: false,
      }
    );
  }, [props.email, collaborators]);

  const createNewCollaborator = () => {
    const { email, name, attend } = collaborator;
    return api
      .post(`/user/project/${props.projectId}/collaborator`, {
        email,
        name,
        attend,
      })
      .catch(() => ({ status: 500, data: "Network Error" }));
  };

  const updateExistedCollaborator = (cid: number) => {
    const { email, name, attend } = collaborator;
    return api
      .put(`/user/project/${props.projectId}/collaborator/${cid}`, {
        email,
        name,
        attend,
      })
      .catch(() => ({ status: 500, data: "Network Error" }));
  };

  const deleteExistedCollaborator = (cid: number) => {
    return api
      .delete(`/user/project/${props.projectId}/collaborator/${cid}`)
      .catch(() => ({ status: 500, data: "Network Error" }));
  };

  return (
    <>
      {alertElement}
      <Box display={"flex"} gap={1} flexWrap={"wrap"}>
        <TextField
          label={"Full name"}
          value={collaborator.name}
          onChange={(e) => {
            updateCollaborator({ name: e.target.value });
          }}
        ></TextField>
        <TextField
          label={"Email address"}
          value={collaborator.email}
          onChange={(e) => updateCollaborator({ email: e.target.value })}
        ></TextField>
        <FormControlLabel
          label="Attend"
          control={
            <Checkbox
              checked={collaborator.attend}
              onChange={(e) => updateCollaborator({ attend: e.target.checked })}
            ></Checkbox>
          }
        ></FormControlLabel>
        <Button
          variant="contained"
          color="success"
          onClick={async () => {
            if (!("id" in collaborator)) {
              const res = await createNewCollaborator();
              if (res.status < 400) {
                refresh("collaborators");
                props.afterSave(res.data);
              } else {
                setAlertInfo({
                  color: "error",
                  message:
                    "Failed to create collaborator. Please check and retry later.",
                });
              }
            } else {
              const res = await updateExistedCollaborator(collaborator.id);
              if (res.status < 400) {
                refresh("collaborators");
                props.afterSave(res.data);
              } else {
                setAlertInfo({
                  color: "error",
                  message:
                    "Failed to update collaborator. Please check and retry later.",
                });
              }
            }
            setCollaborator({
              email: "",
              name: "",
              attend: false,
            });
          }}
        >
          Save
        </Button>
        {props.email !== undefined && "id" in collaborator ? (
          <Button
            variant="contained"
            color="error"
            onClick={async () => {
              const res = await deleteExistedCollaborator(collaborator.id);
              if (res.status < 400) {
                props.afterSave(res.data);
              } else {
                setAlertInfo({
                  color: "error",
                  message:
                    "Failed to remove the collaborator. Please refresh the page and retry.",
                });
              }
            }}
          >
            Delete
          </Button>
        ) : null}
      </Box>
    </>
  );
}
