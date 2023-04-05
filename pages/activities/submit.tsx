import { Delete, Edit, Save } from "@mui/icons-material";
import {
  Checkbox,
  Box,
  Button,
  ButtonGroup,
  Modal,
  Select,
  Table,
  TableBody,
  TableCell,
  TableCellProps,
  TableHead,
  TableRow,
  TextField,
  Typography,
  Container,
} from "@mui/material";
import { useEffect, useState } from "react";
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

function updateAuthor(
  current: AbstractType,
  idx: number,
  update: Partial<AbstractType["authors"][number]>
): AbstractType {
  if (!(idx in current.authors)) {
    return current;
  } else {
    const target = current.authors[idx];
    const updated = { ...target, ...update };
    const updatedAuthors = [
      ...current.authors.slice(0, idx),
      updated,
      ...current.authors.slice(idx + 1),
    ];
    return updateAbstract(current, { authors: updatedAuthors });
  }
}

export default function Submit() {
  const [abstracts, setAbstracts] = useState<AbstractType[]>([]);
  const [selected, setSelected] = useState(-1);
  return (
    <Box>
      <Button
        onClick={() => {
          setSelected(abstracts.length);
        }}
      >
        Add
      </Button>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Title</TableCell>
            <TableCell>Speaker</TableCell>
            <TableCell>Authors</TableCell>
            <TableCell>Edit/Remove</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {abstracts.map((abstract, idx) => {
            const { title, speaker, authors } = abstract;
            return (
              <TableRow key={idx}>
                <TableCell>{title}</TableCell>
                <TableCell>{`${authors[speaker].firstName} ${authors[speaker].lastName}`}</TableCell>
                <TableCell>
                  {authors
                    .slice(0, 3)
                    .map(
                      ({ firstName, lastName }) => `${firstName} ${lastName}`
                    )
                    .join(", ") + (authors.length > 3 ? ", ..." : "")}
                </TableCell>
                <TableCell>
                  <Button onClick={() => setSelected(idx)}>
                    <Edit></Edit>
                  </Button>
                  <Button
                    onClick={() => {
                      setAbstracts([
                        ...abstracts.slice(0, idx),
                        ...abstracts.slice(idx + 1),
                      ]);
                    }}
                  >
                    <Delete></Delete>
                  </Button>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
      <Modal open={selected !== -1}>
        <AbstractEditor
          currentAbstract={abstracts[selected] ?? createEmptyAbstract()}
          submitHandler={(edited) => {
            if (selected === -1) {
              setAbstracts([...abstracts, edited]);
            } else {
              setAbstracts([
                ...abstracts.slice(0, selected),
                edited,
                ...abstracts.slice(selected + 1),
              ]);
            }
            setSelected(-1);
          }}
          cancelHandler={() => setSelected(-1)}
        ></AbstractEditor>
      </Modal>
    </Box>
  );
}

function AbstractEditor(props: {
  currentAbstract: AbstractType | null;
  submitHandler: (edited: AbstractType) => void;
  cancelHandler: () => void;
}) {
  const [edited, setEdited] = useState(
    props.currentAbstract ?? createEmptyAbstract()
  );
  const authors = edited.authors.map((author, idx) => ({
    ...author,
    isSpeaker: idx === edited.speaker,
    isCorrespondAuthor: idx === edited.correspondAuthor,
  }));
  return (
    <Container
      sx={{
        position: "absolute" as "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        borderRadius: 4,
        padding: 4,
        bgcolor: "background.paper",
        display: "flex",
        flexDirection: "column",
        gap: 2,
      }}
    >
        <Typography variant="h4">Submit a new abstract</Typography>
      <Typography variant="h6">Basic Infomation</Typography>
      <Box sx={{display: "flex", flexDirection: "row", gap: 2}}>
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
          multiline
          rows={4}
          fullWidth={true}
        ></TextField>
      </Box>
      <Typography variant="h6">Authors</Typography>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>First Name</TableCell>
            <TableCell>Last Name</TableCell>
            <TableCell>E-mail</TableCell>
            <TableCell>Region</TableCell>
            <TableCell>Institution</TableCell>
            <TableCell>Speaker</TableCell>
            <TableCell>Corresponding Author</TableCell>
            <TableCell>Remove</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {authors.map(
            (
              {
                firstName,
                lastName,
                email,
                region,
                institution,
                isSpeaker,
                isCorrespondAuthor,
              },
              idx
            ) => {
              return (
                <TableRow key={idx}>
                  <EditableCell
                    input={firstName}
                    valueSetter={(updated) => {
                      setEdited(
                        updateAuthor(edited, idx, { firstName: updated })
                      );
                    }}
                  ></EditableCell>
                  <EditableCell
                    input={lastName}
                    valueSetter={(updated) => {
                      setEdited(
                        updateAuthor(edited, idx, { lastName: updated })
                      );
                    }}
                  ></EditableCell>
                  <EditableCell
                    input={email}
                    valueSetter={(updated) => {
                      setEdited(updateAuthor(edited, idx, { email: updated }));
                    }}
                  ></EditableCell>
                  <EditableCell
                    input={region}
                    valueSetter={(updated) => {
                      setEdited(updateAuthor(edited, idx, { region: updated }));
                    }}
                  ></EditableCell>
                  <EditableCell
                    input={institution}
                    valueSetter={(updated) => {
                      setEdited(
                        updateAuthor(edited, idx, { institution: updated })
                      );
                    }}
                  ></EditableCell>
                  <TableCell>
                    <Checkbox
                      checked={isSpeaker}
                      onClick={(e) => {
                        e.preventDefault();
                        setEdited(updateAbstract(edited, { speaker: idx }));
                      }}
                    ></Checkbox>
                  </TableCell>
                  <TableCell>
                    <Checkbox
                      checked={isCorrespondAuthor}
                      onClick={(e) => {
                        e.preventDefault();
                        setEdited(updateAbstract(edited, { correspondAuthor: idx }));
                      }}
                    ></Checkbox>
                  </TableCell>
                  <TableCell>
                    <Button
                      onClick={() => setEdited(removeAuthor(edited, idx))}
                    >
                      <Delete></Delete>
                    </Button>
                  </TableCell>
                </TableRow>
              );
            }
          )}
        </TableBody>
      </Table>
      <Button onClick={() => setEdited(addAuthor(edited, {
        firstName: "", lastName: "", email: "", region: "", institution: ""
      }))}>Add author</Button>
      <ButtonGroup>
        <Button onClick={() => props.submitHandler(edited)}>Save</Button>
        <Button onClick={() => props.cancelHandler()}>Cancel</Button>
      </ButtonGroup>
    </Container>
  );
}

function EditableCell(
  props: {
    input: string;
    valueSetter: (value: string) => void;
  } & Omit<TableCellProps, "children">
) {
  const { input, valueSetter, ...tableCellProps } = props;
  const [value, setValue] = useState(input);
  const [editMode, setEditMode] = useState(false);
  return (
    <TableCell {...tableCellProps}>
      {editMode ? (
        <>
          <TextField
            autoFocus={true}
            value={value}
            onChange={(e) => setValue(e.target.value)}
          ></TextField>
          <Button
            onClick={() => {
              setEditMode(false);
              valueSetter(value);
            }}
          >
            <Save></Save>
          </Button>
        </>
      ) : (
        <>
          <Button onClick={() => setEditMode(true)}>
            <Edit />
          </Button>
          <Typography variant="body1">{value}</Typography>
        </>
      )}
    </TableCell>
  );
}
