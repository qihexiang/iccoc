import {
  Box,
  FormControl,
  InputLabel,
  Table,
  TableHead,
  TableCell,
  TextField,
  TableRow,
  TableBody,
  Button,
  Modal,
  ButtonGroup,
  Typography,
} from "@mui/material";
import { LoginStatusStorage } from "@/pages/_app";
import { useContext, useEffect, useState } from "react";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import router, { useRouter } from "next/router";
import { z } from "zod";

const Abstract = z.object({
  title: z
    .string()
    .min(10, "title too short, require at least 10 characters")
    .max(255, "title too long, maxium is 255 characters."),
  content: z
    .string()
    .min(10, "abstract too short, require at least 10 characters"),
  authors: z.array(
    z.object({
      firstName: z
        .string()
        .max(255, "first name too long, maxium is 255 characters."),
      lastName: z
        .string()
        .max(255, "last name too long, maxium is 255 characters."),
      email: z.string().email("invalid email address."),
      region: z.string().max(255, "region too long, maxium is 255 characters."),
      institution: z
        .string()
        .max(255, "institution too long, maxium is 255 characters."),
    })
  ),
  speaker: z.number().int().min(0, "must set a author as speaker"),
  correspondAuthor: z.number().int().min(0, "must set a curresponding author"),
});

type AbstractType = z.infer<typeof Abstract>;

function createEmptyAbstract(): AbstractType {
  return {
    title: "",
    content: "",
    authors: [
      {
        firstName: "",
        lastName: "",
        email: "",
        region: "",
        institution: "",
      },
    ],
    speaker: 0,
    correspondAuthor: 0,
  };
}

function updateAbstract(
  current: AbstractType,
  update: Partial<AbstractType>
): AbstractType {
  return { ...current, ...update };
}

function addAuthor(
  current: AbstractType,
  author: AbstractType["authors"][number]
): AbstractType {
  return { ...current, authors: [...current.authors, author] };
}

function removeAuthor(current: AbstractType, idx: number): AbstractType {
  if (current.authors.length === 1) {
    return { ...current };
  } else {
    const updated = {
      ...current,
      authors: [
        ...current.authors.slice(0, idx),
        ...current.authors.slice(idx + 1),
      ],
    };
    if (updated.speaker === idx) {
      updated.speaker = 0;
    }
    if (updated.correspondAuthor === idx) {
      updated.correspondAuthor = 0;
    }
    return updated;
  }
}

export default function Submit() {
    // const []
  return <Box>
    <Table>
        <TableHead>
            <TableRow></TableRow>
        </TableHead>
        <TableBody>
            <TableRow></TableRow>
        </TableBody>
    </Table>
  </Box>;
}

function AbstractEditor(props: {
  currentAbstract: AbstractType | null;
  submitHandler: (edited: AbstractType) => void;
}) {
  const [edited, setEdited] = useState(
    props.currentAbstract ?? createEmptyAbstract()
  );
  const columns: GridColDef[] = [
    { field: "firstName", headerName: "First Name" },
    { field: "lastName", headerName: "Last Name" },
    { field: "email", headerName: "email" },
    { field: "region", headerName: "Region" },
    { field: "institution", headerName: "Institution" },
  ];
  return (
    <Box>
      <TextField
        value={edited.title}
        onChange={(e) =>
          setEdited(updateAbstract(edited, { title: e.target.value }))
        }
        placeholder="Title"
      ></TextField>
      <TextField
        value={edited.content}
        onChange={(e) =>
          setEdited(updateAbstract(edited, { content: e.target.value }))
        }
        placeholder="Content"
      ></TextField>
      <Typography variant="h6">Authors</Typography>
      <DataGrid rows={edited.authors} columns={columns}></DataGrid>
    </Box>
  );
}
