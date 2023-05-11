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
  TextField,
  Typography
} from "@mui/material";
import {
  Collaborator,
  Project,
  ProjectStatus,
  ProjectType,
  User,
  UserType,
} from "@prisma/client";
import Head from "next/head";
import { useRouter } from "next/router";
import { createContext, useContext, useEffect, useRef, useState } from "react";

type UserProjectData = {
  projects: (Project & { collaborators: Collaborator[] })[];
  collaborators: Collaborator[];
};

const UserProjectCtx = createContext<UserProjectData & {
  refresh: (prop?: keyof UserProjectData) => void
}>({
  projects: [], collaborators: [], refresh: (prop) => { }
})

export default function MeView() {
  const user = useUser({
    redirectTo: "/abstracts/login",
    redirectOnLoggedIn: false,
  });

  const [data, setData] = useState<{
    projects: (Project & { collaborators: Collaborator[] })[];
    collaborators: Collaborator[];
  }>({
    projects: [],
    collaborators: [],
  });

  const refresh = (prop?: keyof UserProjectData) => {
    if (prop === "collaborators") {
      api.get(`/user/collaborator`)
        .then(res => {
          if (res.status < 400) {
            setData({ ...data, collaborators: res.data })
          } else {
            alert("Failed to get data, please refresh and retry")
          }
        })
    }
    if (prop === "projects") {
      api.get("/user/project").then(res => {
        if (res.status < 400) {
          setData({ ...data, projects: res.data })
        } else {
          alert("Failed to get data, please refresh and retry")
        }
      })
    }
    if (prop === undefined) {
      Promise.all([api.get("/user/project"), api.get("/user/collaborator")]).then(
        ([pRes, cRes]) => {
          if (pRes.status < 400 && cRes.status < 400) {
            setData({ projects: pRes.data, collaborators: cRes.data });
          } else {
            alert("Failed to fetch data, please refresh the page and retry.");
          }
        }
      );
    }
  }

  useEffect(() => {
    refresh()
  }, [])

  if (user === undefined) {
    return null
  }

  return (
    <>
      <Head>
        <title>Personal center - ICCOC2023</title>
      </Head>
      <Box display={"flex"} flexDirection={"column"} gap={1}>
        {user !== undefined ? (
          <PersonalCenterHeader
            email={user.email}
            name={user.name}
          ></PersonalCenterHeader>
        ) : null}
        <UserProjectCtx.Provider value={{
          ...data, refresh
        }}>
          {data.projects.map((p, idx) => (
            <ProjectItem
              key={idx}
              project={p}
              user={user}
              afterSave={refresh}
            ></ProjectItem>
          ))}
          <Typography variant="subtitle2">Add another abstract?</Typography>
          <ProjectItem
            project={null}
            user={user}
            afterSave={refresh}
          ></ProjectItem>
        </UserProjectCtx.Provider >
      </Box>
    </>
  );
}

function PersonalCenterHeader(props: {
  email: string;
  name: string;
}) {
  const router = useRouter();
  const { email, name } = props;
  return (
    <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
      <Box>
        <Typography variant="h6">Welcome, {name}</Typography>
        <Typography variant="overline">{email}</Typography>
      </Box>

      <Button
        variant="contained"
        color="error"
        onClick={() => {
          api.post("/user/logout").finally(() => router.push("/"));
        }}
      >
        Logout
      </Button>
      <Button
        variant="contained"
        color="warning"
        onClick={() => router.push("/abstracts/passwd")}
      >
        Reset password
      </Button>
    </Box>
  );
}

function ProjectItem(props: {
  project: (Project & { collaborators: Collaborator[] }) | null;
  user: Omit<User, "password">,
  afterSave: () => void;
}) {
  const { project, afterSave } = props;
  const [editState, setEditState] = useState(false);
  const { collaborators } = useContext(UserProjectCtx);
  if (editState || project === null) {
    return (
      <ProjectEditor
        project={project}
        user={props.user}
        afterSave={() => {
          setEditState(false);
          afterSave();
        }}
      ></ProjectEditor>
    );
  } else {
    const presontor = collaborators.find(c => c.id === project.presontor);
    return (
      <Card>
        <CardContent>
          <Box display={"flex"} gap={1}>
            <StatusIndicator status={project.status}></StatusIndicator>
            <Typography variant="h6">{project.name}</Typography>
          </Box>
          <Typography variant="subtitle1">{
            presontor === undefined ? `${props.user.name} (${props.user.email})` : `${presontor.name} (${presontor.email})`
          }</Typography>
        </CardContent>
        <CardActions>
          {project.status === ProjectStatus.SAVED ? (
            <ButtonGroup variant="contained">
              <Button onClick={() => setEditState(true)} color="primary">
                Edit
              </Button>
              <Button color="success" onClick={() => {
                api.post(`/user/project/${project.id}/status`)
                  .then(res => {
                    if (res.status < 400) {
                      alert("Submitted!")
                      props.afterSave()
                    } else {
                      alert("Failed to submit. Please retry later.")
                    }
                  })
              }}>Submit</Button>
              <Button color="error" onClick={() => {
                api.delete(`/user/project/${project.id}`)
                  .then(res => {
                    if (res.status < 400) {
                      alert("Deleted")
                      props.afterSave()
                    } else {
                      alert("Failed to delete. Please retry later.")
                    }
                  })
              }}>Remove</Button>
            </ButtonGroup>
          ) : null}
          {project.status === ProjectStatus.SUBMITTED ? (
            <Button variant="contained" color="info" onClick={() => {
              api.delete(`/user/project/${project.id}/status`)
                .then(res => {
                  if (res.status < 400) {
                    alert("Withdrawed")
                    props.afterSave()
                  } else {
                    alert("Failed to withdraw. Please retry later.")
                  }
                })
            }}>Withdraw</Button>
          ) : null}
        </CardActions>
      </Card>
    );
  }
}

function StatusIndicator(props: { status: ProjectStatus }) {
  const { status } = props;
  if (status === ProjectStatus.SAVED) {
    return <Chip label="Saved" color="info"></Chip>;
  }
  if (status === ProjectStatus.SUBMITTED) {
    return <Chip label="Submitted" color="primary"></Chip>;
  }
  if (status === ProjectStatus.ACCEPTED) {
    return <Chip label="Accepted" color="success"></Chip>;
  }
  return <Chip label="Rejected" color="error"></Chip>;
}

function ProjectEditor(props: {
  project: (Project & { collaborators: Collaborator[] }) | null;
  user: Omit<User, "password">,
  afterSave: () => void;
}) {
  const [project, setProject] = useState(props.project);
  const uploadRef = useRef<HTMLInputElement>(null);
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
      api.put(`/user/project/${projectId}/basic`, {
        name: project.name,
        type: project.type,
        presontor: project.presontor
      });

    return (
      <Card>
        <CardContent>
          <Box display={"flex"} flexDirection={"column"} gap={2}>
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
              fullWidth
              label={"Title"}
              value={project.name}
              onChange={(e) => updateProject({ name: e.target.value })}
            ></TextField>
            <Button
              disabled={waiting !== undefined}
              variant="contained"
              component="label"
            >
              <Upload></Upload>{waiting === undefined ? `upload file to replace ${project.filename}` : waiting}
              <input
                ref={uploadRef}
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
                            `${(e.loaded / e.total / 100).toFixed(2)}%`
                          );
                        } else {
                          setWaiting(
                            `${(e.loaded / 1024 / 1024).toFixed(2)}MB`
                          );
                        }
                      },
                    })
                    .then((res) => {
                      if (res.status < 400) {
                        updateProject({ filename: e.target.files![0].name });
                      } else {
                        alert("Failed to update the file.");
                      }
                    })
                    .finally(() => setWaiting(undefined));
                }}
                hidden
                type="file"
              />
            </Button>
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
                control={
                  <Checkbox
                    checked={true}
                    disabled
                  ></Checkbox>
                }
              ></FormControlLabel>
              <Button variant="contained" color="info">Modify</Button>
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
                setProject(project)
              }}
            ></CollaboratorEditor>
            <FormControl>
              <InputLabel>Presontor</InputLabel>
              <Select label={"Presontor"} value={project.presontor ?? -1} onChange={(e) => {
                if (e.target.value === -1 || !collaborators.map(c => c.id).includes(e.target.value as number)) {
                  updateProject({ presontor: null })
                } else {
                  updateProject({ presontor: e.target.value as number })
                }
              }}>
                <MenuItem value={-1}>{props.user.name} - {props.user.email}</MenuItem>
                {
                  project.collaborators.map((c, idx) => <MenuItem key={idx} value={c.id}>{c.name} - {c.email}</MenuItem>)
                }
              </Select>
            </FormControl>
          </Box>
        </CardContent>
        <CardActions>
          <Button
            variant="contained"
            color="success"
            onClick={() => {
              upload().then((res) => {
                if (res.status < 400) {
                  setProject(null)
                  props.afterSave();
                } else {
                  alert("Faild to update data.");
                }
              });
            }}
          >
            Save
          </Button>
        </CardActions>
      </Card>
    );
  }
}

function ProjectCreator(props: {
  afterSave: (
    project: Project & { collaborators: Collaborator[] }
  ) => void;
}) {
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
      alert("Must input title.");
      throw null;
    }
    if (
      file === undefined
    ) {
      alert("File not selected.");
      throw null;
    }
    const form = new FormData();
    form.append("name", basicInfo.name);
    form.append("type", basicInfo.type);
    form.append("upload", file);
    return api.post("/user/project", form);
  };

  return (
    <Card>
      <CardContent>
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
          <Button
            disabled={basicInfo.name === ""}
            variant="contained"
            component="label"
          >
            <Upload></Upload>{file === undefined ? "Upload file" : `Replace ${file.name}`}
            <input
              onChange={(e) => { setFile(e.target.files?.item(0) ?? undefined) }}
              hidden
              type="file"
            />
          </Button>
        </Box>
      </CardContent>
      <CardActions>
        <Button
          variant="contained"
          color="success"
          onClick={() => {
            uploadFn().then((res) => {
              if (res.status < 400) {
                props.afterSave(res.data);
              } else {
                alert("Faild to update data.");
              }
            });
          }}
        >
          Next
        </Button>
      </CardActions>
    </Card>
  );
}

function CollaboratorEditor(props: {
  email?: string;
  projectId?: number;
  afterSave: (updated: Project & { collaborators: Collaborator[] }) => void;
}) {
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
    const matched = collaborators.find(
      (c) => c.email === collaborator.email
    );
    if (matched !== undefined) {
      setCollaborator(matched);
    }
  }, [collaborator.email, collaborators]);

  useEffect(() => {
    setCollaborator(collaborators.find((c) => c.email === props.email) ?? {
      email: "",
      name: "",
      attend: false,
    })
  }, [props.email, collaborators])

  const createNewCollaborator = () => {
    const { email, name, attend } = collaborator;
    return api.post(`/user/project/${props.projectId}/collaborator`, {
      email,
      name,
      attend,
    });
  };

  const updateExistedCollaborator = (cid: number) => {
    const { email, name, attend } = collaborator;
    return api.put(`/user/project/${props.projectId}/collaborator/${cid}`, {
      email,
      name,
      attend,
    });
  };

  const deleteExistedCollaborator = (cid: number) => {
    return api.delete(`/user/project/${props.projectId}/collaborator/${cid}`);
  };

  return (
    <Box display={"flex"} gap={1} flexWrap={"wrap"}>
      <TextField
        label={"Full name"}
        value={collaborator.name}
        onChange={(e) => {
          updateCollaborator({ name: e.target.value })
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
              alert(
                "Failed to create collaborator. Please check and retry later."
              );
            }
          } else {
            const res = await updateExistedCollaborator(collaborator.id);
            if (res.status < 400) {
              refresh("collaborators")
              props.afterSave(res.data);
            } else {
              alert(
                "Failed to update collaborator. Please check and retry later."
              );
            }
          }
          setCollaborator({
            email: "", name: "", attend: false
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
              alert(
                "Failed to remove the collaborator. Please refresh the page and retry."
              );
            }
          }}
        >
          Delete
        </Button>
      ) : null}
    </Box>
  );
}
