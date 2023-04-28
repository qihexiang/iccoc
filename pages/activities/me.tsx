import api from "@/lib/apiRequest";
import { useUser } from "@/lib/useUser";
import {
    Button,
    ButtonGroup,
    Card,
    CardActions,
    CardContent,
    Checkbox,
    FormControlLabel,
    TextField,
    Typography,
} from "@mui/material";
import { Box } from "@mui/system";
import { Abstract, Attachment, Authors } from "@prisma/client";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";

export default function MeView() {
  const email = useUser({
    redirectTo: "/activities/login",
    redirectOnLoggedIn: false,
  });
  const router = useRouter();
  const [abstracts, setAbstracts] = useState<
    (Abstract & { authors: Authors[]; attachments: Attachment[] })[]
  >([]);
  const [refreshSignal, setRefresh] = useState(Symbol());
  const refresh = () => setRefresh(Symbol());
  useEffect(() => {
    api.get("/user/abstracts/", { withCredentials: true }).then((res) => {
      if (res.status === 200) {
        setAbstracts(res.data);
      } else {
        alert("Failed to fetch data from the server, please refresh the page.");
      }
    });
  }, [refreshSignal]);
  return (
    <Box>
      <Box sx={{ display: "flex", gap: 2 }}>
        <Typography variant="h6">{email}</Typography>
        <Button
          variant="contained"
          color="error"
          onClick={() => {
            api.post("/user/logout").finally(() => router.push("/"));
          }}
        >
          Logout
        </Button>
        <Button variant="contained" color="primary" onClick={refresh}>
          refresh
        </Button>
      </Box>
      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        {abstracts.map((item, key) => (
          <AbstractItem
            abstract={item}
            key={key}
            onUpdate={refresh}
          ></AbstractItem>
        ))}
        <AbstractItem abstract={null} onUpdate={refresh}></AbstractItem>
      </Box>
    </Box>
  );
}

function AbstractItem(props: {
  abstract:
    | (Abstract & { authors: Authors[]; attachments: Attachment[] })
    | null;
  onUpdate: () => void;
}) {
  const [edit, setEdit] = useState(false);
  if (props.abstract === null) {
    return (
      <AbstractEditor
        abstract={null}
        afterSave={() => setEdit(true)}
      ></AbstractEditor>
    );
  }
  if (!edit) {
    return (
      <AbstractDisplay
        abstract={props.abstract}
        switchToEditor={() => setEdit(true)}
        onUpdate={props.onUpdate}
      ></AbstractDisplay>
    );
  } else {
    return (
      <AbstractEditor
        abstract={props.abstract}
        afterSave={() => {
          setEdit(false);
          props.onUpdate();
        }}
      ></AbstractEditor>
    );
  }
}

function AbstractDisplay(props: {
  abstract: Abstract & { authors: Authors[]; attachments: Attachment[] };
  switchToEditor: () => void;
  onUpdate: () => void;
}) {
  const { title, content, authors } = props.abstract;
  const { switchToEditor } = props;
  return (
    <Card>
      <CardContent sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
        <Typography variant="h6">{title}</Typography>
        <Typography variant="body2">
          {authors.map((author) => author.authorName).join("/")}
        </Typography>
        <Typography variant="body1">{content}</Typography>
      </CardContent>
      <CardActions>
        <ButtonGroup variant="contained">
          <Button onClick={() => switchToEditor()}>Edit</Button>
          <Button
            onClick={() => {
              api
                .delete(`/user/abstracts/${props.abstract.id}`, {
                  withCredentials: true,
                })
                .then((res) => {
                  if (res.status === 200) {
                    props.onUpdate();
                  } else {
                    alert("Failed to delete author, retry later please");
                  }
                });
            }}
            color="error"
          >
            Delete
          </Button>
        </ButtonGroup>
      </CardActions>
    </Card>
  );
}

function AbstractEditor(props: {
  abstract:
    | (Abstract & { authors: Authors[]; attachments: Attachment[] })
    | null;
  afterSave: () => void;
}) {
  const [abstract, setAbstract] = useState({
    id: props.abstract?.id,
    title: props.abstract?.title ?? "",
    content: props.abstract?.content ?? "",
    authors: props.abstract?.authors ?? [],
    attachments: props.abstract?.attachments ?? [],
  });
  const updateAbstract = <T extends keyof typeof abstract>(
    prop: T,
    value: (typeof abstract)[T]
  ) => {
    setAbstract({ ...abstract, [prop]: value });
  };
  const { afterSave } = props;
  const uploadRef = useRef<HTMLInputElement>(null);
  const [uploadProgress, setUploadProgress] = useState<string | undefined>(undefined)
  return (
    <Card>
      <CardContent sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
        <Typography variant="h6">
          {abstract.id === undefined ? "New Abstract" : "Update"}
        </Typography>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <Typography variant="subtitle1">Title</Typography>
          <TextField
            label="Title"
            value={abstract.title}
            onChange={(e) => updateAbstract("title", e.target.value)}
          ></TextField>
          <Typography variant="subtitle1">Abstract</Typography>
          <TextField
            label="Content"
            value={abstract.content}
            multiline
            rows={4}
            onChange={(e) => updateAbstract("content", e.target.value)}
          ></TextField>
        </Box>
        {abstract.id !== undefined ? (
          <>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
              <Typography variant="subtitle1">Authors</Typography>
              {/* here abstract.id might be undefined, may be a bug of typescript */}
              {abstract.authors.map((author, key) => (
                <AuthorEditor
                  key={key}
                  author={author}
                  abstractId={abstract.id!}
                  afterSave={(authors: Authors[]) =>
                    updateAbstract("authors", authors)
                  }
                ></AuthorEditor>
              ))}
              <AuthorEditor
                author={null}
                abstractId={abstract.id}
                afterSave={(authors: Authors[]) =>
                  updateAbstract("authors", authors)
                }
              ></AuthorEditor>
            </Box>
            <Box sx={{display: "flex", flexDirection: "column", gap: 1}}>
              <Typography variant="subtitle1">Attchments</Typography>
              {abstract.attachments.map((item, key) => (
                <Box key={key} sx={{display: "flex", gap: 1}}>
                  <Typography variant="body1">
                    {item.filename} {(item.size / (1024 * 1024)).toFixed(2)} MB
                  </Typography>
                  <Button variant="contained" color="error" onClick={() => {
                    api.delete(`/user/abstracts/${abstract.id!}/attachment/${item.filename}`).then(res => {
                        if(res.status === 200) {
                            updateAbstract("attachments", res.data)
                        } else {
                            alert(res.data.message ?? "Unknown error happens.")
                        }
                    })
                  }}>Delete</Button>
                </Box>
              ))}
              <Button disabled={uploadProgress !== undefined} variant="contained" component="label">
                {uploadProgress !== undefined ? uploadProgress : "Upload"}
                <input ref={uploadRef} onChange={(e) => {
                    if(abstract.attachments.length >= 5) {
                        alert("Too many files.")
                    } if (!Boolean(uploadRef.current?.files)) {
                        alert("No file selected.")
                    } else {
                        const form = new FormData();
                        form.append("attachment", uploadRef.current!.files![0])
                        api.post(`/user/abstracts/${abstract.id!}/attachment/`, form, {
                            onUploadProgress(e) {
                                if(e.total !== undefined) {
                                    setUploadProgress(`${(e.loaded/e.total * 100).toFixed(2)}%`)                                    
                                } else {
                                    setUploadProgress(`${(e.loaded / (1024 * 1024)).toFixed(2)} MB`)
                                }
                            },
                        }).then(res => {
                            setUploadProgress(undefined)
                            if(res.status === 200) {
                                updateAbstract("attachments", res.data)
                            } else {
                                alert(res.data.message)
                            }
                        })
                    }
                    e.target.files = null
                }} hidden type="file" />
              </Button>
            </Box>
          </>
        ) : null}
      </CardContent>
      <CardActions>
        {abstract.id === undefined ? (
          <Button
            variant="contained"
            color="success"
            onClick={() => {
              api
                .post("/user/abstracts", {
                  title: abstract.title,
                  content: abstract.content,
                })
                .then((res) => {
                  if (res.status === 200) {
                    setAbstract(res.data);
                  } else {
                    alert(res.data["message"]);
                  }
                });
            }}
          >
            Next
          </Button>
        ) : (
          <Button
            variant="contained"
            color="success"
            onClick={() => {
              api
                .put(`/user/abstracts/${abstract.id!}`, {
                  title: abstract.title,
                  content: abstract.content,
                })
                .then((res) => {
                  if (res.status === 200) {
                    setAbstract({
                      id: props.abstract?.id,
                      title: props.abstract?.title ?? "",
                      content: props.abstract?.content ?? "",
                      authors: props.abstract?.authors ?? [],
                      attachments: props.abstract?.attachments ?? []
                    });
                    afterSave();
                  } else {
                    alert(res.data["message"]);
                  }
                });
            }}
          >
            Save
          </Button>
        )}
      </CardActions>
    </Card>
  );
}

function AuthorEditor(props: {
  author: Authors | null;
  abstractId: number;
  afterSave: (saved: Authors[]) => void;
}) {
  const [author, setAuthor] = useState({
    id: props.author?.id,
    abstractId: props.abstractId,
    email: props.author?.email ?? "",
    authorName: props.author?.authorName ?? "",
    region: props.author?.region ?? "",
    staff: props.author?.staff ?? "",
    speaker: props.author?.speaker ?? false,
    correspondingAuthor: props.author?.correspondingAuthor ?? false,
  });

  const updateAuthorInfo = <T extends keyof typeof author>(
    prop: T,
    value: (typeof author)[T]
  ) => {
    setAuthor({
      ...author,
      [prop]: value,
    });
  };

  return (
    <Box component={"form"} sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
      <TextField
        label="name"
        name="name"
        value={author.authorName}
        onChange={(e) => {
          updateAuthorInfo("authorName", e.target.value);
        }}
      ></TextField>
      <TextField
        label="email"
        name="email"
        value={author.email}
        onChange={(e) => {
          updateAuthorInfo("email", e.target.value);
        }}
      ></TextField>
      <TextField
        label="region"
        name="region"
        value={author.region}
        onChange={(e) => {
          updateAuthorInfo("region", e.target.value);
        }}
      ></TextField>
      <TextField
        label="staff"
        name="staff"
        value={author.staff}
        onChange={(e) => {
          updateAuthorInfo("staff", e.target.value);
        }}
      ></TextField>
      <Box>
        <FormControlLabel
          control={
            <Checkbox
              name="speaker"
              checked={author.speaker}
              onChange={(e) => {
                updateAuthorInfo("speaker", e.target.checked);
              }}
            ></Checkbox>
          }
          label="is speaker"
        ></FormControlLabel>
        <FormControlLabel
          control={
            <Checkbox
              name="corresponding"
              checked={author.correspondingAuthor}
              onChange={(e) => {
                updateAuthorInfo("correspondingAuthor", e.target.checked);
              }}
            ></Checkbox>
          }
          label="corresponding author"
        ></FormControlLabel>
      </Box>
      <ButtonGroup variant="contained">
        <Button
          color="success"
          onClick={() => {
            if (props.author === null) {
              api
                .post(
                  `/user/abstracts/${props.abstractId}/author`,
                  {
                    authorName: author.authorName,
                    email: author.email,
                    region: author.region,
                    staff: author.staff,
                    correspondingAuthor: author.correspondingAuthor,
                    speaker: author.speaker,
                  },
                  { withCredentials: true }
                )
                .then((res) => {
                  if (res.status === 200) {
                    props.afterSave(res.data);
                    setAuthor({
                      id: props.author?.id,
                      abstractId: props.abstractId,
                      email: props.author?.email ?? "",
                      authorName: props.author?.authorName ?? "",
                      region: props.author?.region ?? "",
                      staff: props.author?.staff ?? "",
                      speaker: props.author?.speaker ?? false,
                      correspondingAuthor:
                        props.author?.correspondingAuthor ?? false,
                    });
                  } else {
                    alert("Failed to create author, retry later please");
                  }
                });
            } else {
              api
                .put(
                  `/user/abstracts/${props.abstractId}/author/${author.id}`,
                  {
                    authorName: author.authorName,
                    email: author.email,
                    region: author.region,
                    staff: author.staff,
                    correspondingAuthor: author.correspondingAuthor,
                    speaker: author.speaker,
                  },
                  { withCredentials: true }
                )
                .then((res) => {
                  if (res.status === 200) {
                    props.afterSave(res.data);
                  } else {
                    alert("Failed to save author, retry later please");
                  }
                });
            }
          }}
        >
          {props.author === null ? "Add" : "Save"}
        </Button>
        <Button
          color="error"
          disabled={props.author === null}
          onClick={() => {
            api
              .delete(
                `/user/abstracts/${props.abstractId}/author/${author.id}`,
                { withCredentials: true }
              )
              .then((res) => {
                if (res.status === 200) {
                  props.afterSave(res.data);
                } else {
                  alert("Failed to delete author, retry later please");
                }
              });
          }}
        >
          Delete
        </Button>
      </ButtonGroup>
    </Box>
  );
}
