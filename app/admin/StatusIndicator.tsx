import { ProjectStatus } from "@prisma/client";

function Chip(props: {label: string, color: "primary" | "info" | "safe" | "danger" | "warning"}) {
    const {label, color} = props;
    return <div
      className={`rounded-full ${color} px-4 py-2 text-white font-bold`}
    >{label}</div>
  }
  
  export default function StatusIndicator(props: { status: ProjectStatus }) {
    const { status } = props;
    if (status === ProjectStatus.SAVED) {
      return <Chip label="Saved" color="info"></Chip>;
    }
    if (status === ProjectStatus.SUBMITTED) {
      return <Chip label="Submitted" color="primary"></Chip>;
    }
    if (status === ProjectStatus.ACCEPTED) {
      return <Chip label="Accepted" color="safe"></Chip>;
    }
    return <Chip label="Rejected" color="danger"></Chip>;
  }