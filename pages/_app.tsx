import api from "@/lib/apiRequest";
import "@/styles/globals.css";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import { MDXProvider } from "@mdx-js/react";
import {
  Box,
  Button,
  ClickAwayListener,
  Container,
  Grow,
  MenuItem,
  MenuList,
  Paper,
  Popper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import ICCOC2023 from "./index/ICCOC2023.jpg";
import type { AppProps } from "next/app";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";

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

function Head() {
  const router = useRouter();
  const routeIdx = mainRoutes.findIndex(
    ([_, pathname]) =>
      pathname === router.pathname ||
      (router.pathname.startsWith("/abstracts") && pathname === "/abstracts")
  );
  const dropBtnRef = useRef<HTMLButtonElement>(null);
  const [dropOpen, setDropOpen] = useState(false);
  return <>
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
        <Button
          key={idx}
          onClick={() => router.push(routePath)}
          color={routeIdx === idx ? "secondary" : "primary"}
        >
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
                    <MenuItem
                      key={idx}
                      onClick={() => {
                        setDropOpen(false);
                        router.push(`/previous/${path}`);
                      }}
                    >
                      {label}
                    </MenuItem>
                  ))}
                </MenuList>
              </ClickAwayListener>
            </Paper>
          </Grow>
        )}
      </Popper>
    </Box></>
}

export function Foot() {
  const [count, setCount] = useState(0);
  useEffect(() => {
    api.get("/counter").then((res) => {
      setCount(res.data.count);
    });
  }, []);
  return <>
    <Typography
      component={"div"}
      variant="body2"
      sx={{ textAlign: "center", marginTop: 2 }}
    >
      ICCOC2023, International Conference of Computational Organometallic
      Catalysis
    </Typography>
    <Typography sx={{ textAlign: "center" }} variant="body2">
      Recently visited: {count}
    </Typography>
    <Typography
      variant="body2"
      component={"a"}
      href="https://beian.miit.gov.cn"
      sx={{ textAlign: "center", display: "block" }}
    >
      京ICP备18022349-3号
    </Typography>
  </>
}

function MDXMapper({ children }: { children: JSX.Element | JSX.Element[] | null }) {
  return <MDXProvider
    components={{
      h1: ({ children }) => (
        <Typography variant="h4" sx={{ marginTop: 2 }}>
          {children}
        </Typography>
      ),
      h2: ({ children }) => (
        <Typography variant="h5" sx={{ marginTop: 2 }}>
          {children}
        </Typography>
      ),
      h3: ({ children }) => (
        <Typography variant="subtitle2" sx={{ marginTop: 2 }}>
          {children}
        </Typography>
      ),
      p: ({ children }) => (
        <Typography variant="body1">{children}</Typography>
      ),
      span: ({ children }) => (
        <Typography component="span" variant="body1">
          {children}
        </Typography>
      ),
      li: ({ children }) => (
        <Typography component="li" variant="body1">
          {children}
        </Typography>
      ),
      table: ({ children }) => <Table>{children}</Table>,
      thead: ({ children }) => <TableHead>{children}</TableHead>,
      tbody: ({ children }) => <TableBody>{children}</TableBody>,
      tr: ({ children }) => <TableRow>{children}</TableRow>,
      th: ({ children }) => <TableCell>{children}</TableCell>,
      td: ({ children }) => <TableCell>{children}</TableCell>,
      pre: ({ children }) => (
        <Typography
          variant="body2"
          component={"pre"}
          style={{ overflow: "scroll" }}
        >
          {children}
        </Typography>
      ),
      code: ({ children }) => (
        <Typography variant="body2" component={"code"}>
          {children}
        </Typography>
      ),
      img: (props) => (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <img {...props} style={{ maxWidth: "100%" }}></img>
        </div>
      ),
    }}
  >
    {children}
  </MDXProvider>
}

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();
  return (
    <Container component="div" className="App">
      {
        router.pathname.startsWith("/previous") ? <>
          <MDXMapper>
            <Component {...pageProps} />
          </MDXMapper>
          <Foot></Foot>
        </> : <>
          <Head></Head>
          <MDXMapper><Component {...pageProps} /></MDXMapper>
          <Foot></Foot>
        </>
      }
    </Container>
  );
}
