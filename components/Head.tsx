"use client";

import {
  Button,
  Popper,
  Grow,
  Paper,
  ClickAwayListener,
  MenuList,
  MenuItem,
  Container,
} from "@mui/material";
import { Box } from "@mui/system";
import { useRouter } from "next/router";
import { useRef, useState } from "react";
import ICCOC2023 from "@/images/ICCOC2023.jpg";
import Link from "next/link";

const mainRoutes = [
  ["Home", "/"],
  ["Program", "/program"],
  ["General Info", "/general_info"],
  ["Speakers", "/speakers"],
  ["Registration", "/registration"],
  ["Abstracts", "/abstracts"],
  ["Visa Info", "/visa"],
  ["Accommodation", "/accommodation"],
];

const previousEvents = [["2016", "/2016"]];

export default function Head() {
  const dropBtnRef = useRef<HTMLButtonElement>(null);
  const [dropOpen, setDropOpen] = useState(false);
  return (
    <Container>
      <Box
        component={"div"}
        style={{
          backgroundImage: `url(${ICCOC2023.src})`,
          backgroundPosition: "center center",
          backgroundSize: "cover",
          aspectRatio: `${ICCOC2023.width}/${ICCOC2023.height}`,
        }}
      ></Box>
      <Box
        sx={{
          marginTop: 1,
          marginBottom: 1,
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {mainRoutes.map(([routeName, routePath], idx) => (
          <Button key={idx} LinkComponent={Link} href={routePath}>
            {routeName}
          </Button>
        ))}
        <Button ref={dropBtnRef} onClick={() => setDropOpen(!dropOpen)}>
          Pervious Events
        </Button>
        <Popper
          open={dropOpen}
          anchorEl={dropBtnRef.current}
          placement="bottom-start"
          transition
          disablePortal
        >
          {({ TransitionProps, placement }) => (
            <Grow
              {...TransitionProps}
              style={{
                transformOrigin:
                  placement === "bottom-start" ? "left top" : "left bottom",
              }}
            >
              <Paper>
                <ClickAwayListener onClickAway={() => setDropOpen(false)}>
                  <MenuList autoFocusItem={dropOpen}>
                    {previousEvents.map(([label, path], idx) => (
                      <MenuItem key={idx} LinkComponent={Link} href={path}>
                        {label}
                      </MenuItem>
                    ))}
                  </MenuList>
                </ClickAwayListener>
              </Paper>
            </Grow>
          )}
        </Popper>
      </Box>
    </Container>
  );
}
