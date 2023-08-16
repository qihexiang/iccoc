import { Chip } from "@mui/material";
import { ProjectStatus } from "@prisma/client";

export default function StatusIndicator(props: { status: ProjectStatus }) {
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