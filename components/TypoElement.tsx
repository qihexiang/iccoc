import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import Image from "next/image";
import React, { DetailedHTMLProps, ImgHTMLAttributes, ReactNode } from "react";

export const H1 = ({ children }: { children: ReactNode }) => (
  <Typography variant="h4" sx={{ marginTop: 2 }}>
    {children}
  </Typography>
);
export const H2 = ({ children }: { children: React.ReactNode }) => (
  <Typography variant="h5" sx={{ marginTop: 2 }}>
    {children}
  </Typography>
);
export const H3 = ({ children }: { children: React.ReactNode }) => (
  <Typography variant="subtitle2" sx={{ marginTop: 2 }}>
    {children}
  </Typography>
);
export const P = ({ children }: { children: React.ReactNode }) => (
  <Typography variant="body1">{children}</Typography>
);
export const SPAN = ({ children }: { children: React.ReactNode }) => (
  <Typography component="span" variant="body1">
    {children}
  </Typography>
);
export const LI = ({ children }: { children: React.ReactNode }) => (
  <Typography component="li" variant="body1">
    {children}
  </Typography>
);
export const TABLE = ({ children }: { children: React.ReactNode }) => (
  <Table>{children}</Table>
);
export const THEAD = ({ children }: { children: React.ReactNode }) => (
  <TableHead>{children}</TableHead>
);
export const TBODY = ({ children }: { children: React.ReactNode }) => (
  <TableBody>{children}</TableBody>
);
export const TR = ({ children }: { children: React.ReactNode }) => (
  <TableRow>{children}</TableRow>
);
export const TH = ({ children }: { children: React.ReactNode }) => (
  <TableCell>{children}</TableCell>
);
export const TD = ({ children }: { children: React.ReactNode }) => (
  <TableCell>{children}</TableCell>
);
export const PRE = ({ children }: { children: React.ReactNode }) => (
  <Typography variant="body2" component={"pre"} style={{ overflow: "scroll" }}>
    {children}
  </Typography>
);
export const CODE = ({ children }: { children: React.ReactNode }) => (
  <Typography variant="body2" component={"code"}>
    {children}
  </Typography>
);
