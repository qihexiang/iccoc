import { useUser } from "@/lib/useUser";
import { Button, ButtonGroup, Card, CardActionArea, CardActions, CardContent, Checkbox, Paper, TextField, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { Abstract, Attachment, Authors } from "@prisma/client";
import { useEffect, useState } from "react";
import axios from "axios"
import { useRouter } from "next/router";

export default function MeView() {
    const email = useUser({ redirectTo: "/login", redirectOnLoggedIn: false });
    const router = useRouter();
    const [abstracts, setAbstracts] = useState<(Abstract & { authors: Authors[], attachments: Attachment[] })[]>([]);
    useEffect(() => { })
    return <Box>
        <Typography variant="h4">{email}</Typography><Button onClick={() => {
            axios.post("/api/user/logout")
                .finally(() => router.push("/"))
        }}>Logout</Button>
        <Box>
            {abstracts.map((item, key) => <AbstractItem abstract={item} key={key}></AbstractItem>)}
        </Box>
    </Box>
}

function AbstractItem(props: { abstract: Abstract & { authors: Authors[], attachments: Attachment[] } }) {
    const [edit, setEdit] = useState(false);
    if (!edit) {
        return <AbstractDisplay abstract={props.abstract} switchToEditor={() => setEdit(true)}></AbstractDisplay>
    } else {
        return <AbstractEditor abstract={props.abstract} afterSave={() => setEdit(false)}></AbstractEditor>
    }
}

function AbstractDisplay(props: { abstract: Abstract & { authors: Authors[], attachments: Attachment[] }, switchToEditor: () => void }) {
    const { title, content, authors } = props.abstract;
    const { switchToEditor } = props;
    return <Card>
        <CardContent>
            <Typography variant="h4">{title}</Typography>
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
    const { afterSave } = props;
    return <Card>
        <CardContent>
            <TextField value={abstract.title} onChange={(e) => setAbstract({ ...abstract, title: e.target.value })}></TextField>
            <TextField value={abstract.content} onChange={(e) => setAbstract({ ...abstract, content: e.target.value })}></TextField>
            {abstract.id !== undefined ? <>
                <Box>{abstract.authors.map((author, key) => <AuthorEditor key={key} author={author} afterSave={() => { throw new Error("not implemented") }}></AuthorEditor>)}
                    <AuthorEditor author={null} afterSave={() => { }}></AuthorEditor>
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
            <Button onClick={() => {

            }}>Save</Button>
        </CardActions>
    </Card>
}

function AuthorEditor(props: { author: Authors | null, afterSave: () => void }) {
    const id = props.author?.id;
    const abstractId = props.author?.abstractId;
    const [author, setAuthor] = useState({
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

    return <Box component={"form"}>
        <TextField name="name" value={author.authorName} onChange={(e) => { updateAuthorInfo("authorName", e.target.value) }}></TextField>
        <TextField name="region" value={author.region} onChange={(e) => { updateAuthorInfo("region", e.target.value) }}></TextField>
        <TextField name="staff" value={author.staff} onChange={(e) => { updateAuthorInfo("staff", e.target.value) }}></TextField>
        <Checkbox name="speaker" checked={author.speaker} onChange={(e) => { updateAuthorInfo("speaker", e.target.checked) }}></Checkbox>
        <Checkbox name="corresponding" checked={author.correspondingAuthor} onChange={(e) => { updateAuthorInfo("correspondingAuthor", e.target.checked) }}></Checkbox>
        <ButtonGroup>
            <Button>Save</Button>
            <Button>Delete</Button>
        </ButtonGroup>
    </Box>
}