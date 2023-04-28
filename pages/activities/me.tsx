import { useUser } from "@/lib/useUser";
import { Button, ButtonGroup, Card, CardActionArea, CardActions, CardContent, Checkbox, FormControlLabel, Paper, TextField, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { Abstract, Attachment, Authors } from "@prisma/client";
import { useEffect, useState } from "react";
import axios from "axios"
import { useRouter } from "next/router";

export default function MeView() {
    const email = useUser({ redirectTo: "/activities/login", redirectOnLoggedIn: false });
    const router = useRouter();
    const [abstracts, setAbstracts] = useState<(Abstract & { authors: Authors[], attachments: Attachment[] })[]>([]);
    const [refreshSignal, setRefresh] = useState(Symbol());
    const refresh = () => setRefresh(Symbol())
    useEffect(() => {
        axios.get("/api/user/abstracts/", { withCredentials: true }).then(res => {
            if (res.status === 200) {
                setAbstracts(res.data);
            } else {
                alert("Failed to fetch data from the server, please refresh the page.")
            }
        })
    }, [refreshSignal])
    return <Box>
        <Box sx={{ display: "flex", gap: 2 }}>
            <Typography variant="h6">{email}</Typography>
            <Button variant="contained" color="error" onClick={() => {
                axios.post("/api/user/logout")
                    .finally(() => router.push("/"))
            }}>Logout</Button>
            <Button variant="contained" color="primary" onClick={refresh}>refresh</Button>
        </Box>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {abstracts.map((item, key) => <AbstractItem abstract={item} key={key} afterSave={refresh}></AbstractItem>)}
            <AbstractItem abstract={null} afterSave={refresh}></AbstractItem>
        </Box>
    </Box>
}

function AbstractItem(props: { abstract: (Abstract & { authors: Authors[], attachments: Attachment[] }) | null, afterSave: () => void }) {
    const [edit, setEdit] = useState(false);
    if (props.abstract === null) {
        return <AbstractEditor abstract={null} afterSave={() => setEdit(true)}></AbstractEditor>
    }
    if (!edit) {
        return <AbstractDisplay abstract={props.abstract} switchToEditor={() => setEdit(true)}></AbstractDisplay>
    } else {
        return <AbstractEditor abstract={props.abstract} afterSave={() => { setEdit(false); props.afterSave() }}></AbstractEditor>
    }
}

function AbstractDisplay(props: { abstract: Abstract & { authors: Authors[], attachments: Attachment[] }, switchToEditor: () => void }) {
    const { title, content, authors } = props.abstract;
    const { switchToEditor } = props;
    return <Card>
        <CardContent>
            <Typography variant="h6">{title}</Typography>
            <Typography variant="body1">{content}</Typography>
            <Typography variant="body2">{authors.map(author => author.authorName).join("/")}</Typography>
        </CardContent>
        <CardActions>
            <Button onClick={() => switchToEditor()}>Edit</Button>
        </CardActions>
    </Card>
}

function AbstractEditor(props: { abstract: (Abstract & { authors: Authors[], attachments: Attachment[] }) | null, afterSave: () => void }) {
    const [abstract, setAbstract] = useState({
        id: props.abstract?.id,
        title: props.abstract?.title ?? "",
        content: props.abstract?.content ?? "",
        authors: props.abstract?.authors ?? [],
        attachments: props.abstract?.attachments ?? [],
    });
    const updateAbstract = <T extends keyof typeof abstract>(prop: T, value: (typeof abstract)[T]) => {
        setAbstract({ ...abstract, [prop]: value })
    }
    const { afterSave } = props;
    return <Card>
        <CardContent sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
            <Typography variant="h6">{abstract.id === undefined ? "New Abstract" : "Update"}</Typography>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <TextField label="Title" value={abstract.title} onChange={(e) => updateAbstract("title", e.target.value)}></TextField>
                <TextField label="Content" value={abstract.content} multiline rows={4} onChange={(e) => updateAbstract("content", e.target.value)}></TextField>
            </Box>
            {abstract.id !== undefined ? <>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                    {/* here abstract.id might be undefined, may be a bug of typescript */}
                    {abstract.authors.map((author, key) => <AuthorEditor key={key} author={author} abstractId={abstract.id!} afterSave={(authors: Authors[]) => updateAbstract("authors", authors)}></AuthorEditor>)}
                    <AuthorEditor author={null} abstractId={abstract.id} afterSave={(authors: Authors[]) => updateAbstract("authors", authors)}></AuthorEditor>
                </Box>
                <Box>
                    {abstract.attachments.map((item, key) => <Box key={key}>
                        <Typography variant="body1">{item.filename} {item.size}</Typography>
                        <Button>Delete</Button>
                    </Box>)}
                    <Button variant="contained" component="label">
                        Upload
                        <input hidden type="file" />
                    </Button>
                </Box>
            </> : null}
        </CardContent>
        <CardActions>
            {abstract.id === undefined ?
                <Button variant="contained" color="success" onClick={() => {
                    axios.post("/api/user/abstracts", {
                        title: abstract.title, content: abstract.content
                    }).then(res => {
                        if (res.status === 200) {
                            setAbstract(res.data)
                        } else {
                            alert(res.data["message"])
                        }
                    })
                }}>Next</Button> : <Button variant="contained" color="success" onClick={() => { }}>Save</Button>}
        </CardActions>
    </Card>
}

function AuthorEditor(props: { author: Authors | null, abstractId: number, afterSave: (saved: Authors[]) => void }) {
    const [author, setAuthor] = useState({
        id: props.author?.id,
        abstractId: props.abstractId,
        email: props.author?.email,
        authorName: props.author?.authorName ?? "",
        region: props.author?.region ?? "",
        staff: props.author?.staff ?? "",
        speaker: props.author?.speaker ?? false,
        correspondingAuthor: props.author?.correspondingAuthor ?? false
    })

    const updateAuthorInfo = <T extends keyof typeof author>(prop: T, value: (typeof author)[T]) => {
        setAuthor({
            ...author, [prop]: value
        })
    }

    return <Box component={"form"} sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
        <TextField label="name" name="name" value={author.authorName} onChange={(e) => { updateAuthorInfo("authorName", e.target.value) }}></TextField>
        <TextField label="email" name="email" value={author.email} onChange={(e) => { updateAuthorInfo("email", e.target.value) }}></TextField>
        <TextField label="region" name="region" value={author.region} onChange={(e) => { updateAuthorInfo("region", e.target.value) }}></TextField>
        <TextField label="staff" name="staff" value={author.staff} onChange={(e) => { updateAuthorInfo("staff", e.target.value) }}></TextField>
        <Box>
            <FormControlLabel control={<Checkbox name="speaker" checked={author.speaker} onChange={(e) => { updateAuthorInfo("speaker", e.target.checked) }}></Checkbox>} label="is speaker"></FormControlLabel>
            <FormControlLabel control={<Checkbox name="corresponding" checked={author.correspondingAuthor} onChange={(e) => { updateAuthorInfo("correspondingAuthor", e.target.checked) }}></Checkbox>} label="corresponding author"></FormControlLabel>
        </Box>
        <ButtonGroup>
            <Button onClick={() => {
                if (author.id === undefined) {
                    axios.post(`/api/user/abstracts/${props.abstractId}/author`, {
                        authorName: author.authorName, email: author.email, region: author.region, staff: author.staff, correspondingAuthor: author.correspondingAuthor,
                        speaker: author.speaker,
                    }, { withCredentials: true }).then(res => {
                        if (res.status === 200) {
                            props.afterSave(res.data);
                        } else {
                            alert("Failed to create author, retry later please")
                        }
                    })
                } else {
                    axios.put(`/api/user/abstracts/${props.abstractId}/author/${author.id}`, {
                        authorName: author.authorName, email: author.email, region: author.region, staff: author.staff, correspondingAuthor: author.correspondingAuthor,
                        speaker: author.speaker,
                    }, { withCredentials: true }).then(res => {
                        if (res.status === 200) {
                            props.afterSave(res.data);
                        } else {
                            alert("Failed to save author, retry later please")
                        }
                    })
                }
            }}>Save</Button>
            <Button onClick={() => {
                axios.delete(`/api/user/abstracts/${props.abstractId}/author/${author.id}`, { withCredentials: true })
                    .then(res => {
                        if (res.status === 200) {
                            props.afterSave(res.data);
                        } else {
                            alert("Failed to delete author, retry later please")
                        }
                    })
            }}>Delete</Button>
        </ButtonGroup>
    </Box>
}