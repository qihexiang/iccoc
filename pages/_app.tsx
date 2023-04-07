import "@/styles/globals.css";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import { MDXProvider } from "@mdx-js/react";
import {
  Box,
  Button,
  Container,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Tabs,
  Typography,
} from "@mui/material";
import { findIndex } from "lodash";
import type { AppProps } from "next/app";
import { useRouter } from "next/router";
import { createContext, useState } from "react";
import ICOC2016 from "./public/ICOC2016.jpg";

const routes = [
  ["Home", "/"],
  ["Program", "/program"],
  ["General Info", "/general_info"],
  ["Speakers", "/speakers"],
  ["Activities", "/activities"],
  ["Registration", "/registration"],
  ["Visa Info", "/visa"],
  ["Accommodation", "/accommodation"],
];

type LoginStatus = {
  username: string,
  authToken: string,
  accessToken: string
}

export const LoginStatusStorage = createContext<{ state: LoginStatus | null, login: (state: LoginStatus | null) => void }>({
  state: null, login: () => { }
});

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const routeIdx = findIndex(
    routes,
    ([_, pathname]) => pathname === router.pathname || (router.pathname.startsWith("/activities") && pathname === "/activities")
  );
  const [state, login] = useState<LoginStatus | null>(null)
  return (
    <Container component="div" className="App">
      <Box
        component={"div"}
        style={{
          backgroundImage: `url(${ICOC2016.src})`,
          backgroundPosition: "center center",
          backgroundSize: "cover",
          aspectRatio: "4/1",
        }}
      ></Box>
      <Box style={{ marginBottom: 8 }}>
        <Tabs
          value={routeIdx === -1 ? false : routeIdx}
          onChange={(_, value) => router.push(routes[value][1])}
          variant="scrollable"
          scrollButtons
          allowScrollButtonsMobile
        >
          {routes.map(([routeName], idx) => (
            <Tab key={idx} label={routeName}></Tab>
          ))}
        </Tabs>
      </Box>
      <MDXProvider
        components={{
          h1: ({ children }) => (
            <Typography variant="h4">{children}</Typography>
          ),
          h2: ({ children }) => (
            <Typography variant="h5">{children}</Typography>
          ),
          h3: ({ children }) => (
            <Typography variant="subtitle2">{children}</Typography>
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
            <Typography variant="body2" component={"pre"} style={{ overflow: "scroll" }}>
              {children}
            </Typography>
          ),
          code: ({ children }) => (
            <Typography variant="body2" component={"code"}>
              {children}
            </Typography>
          )
        }}
      >
        <LoginStatusStorage.Provider value={{ state, login }}>
          <Component {...pageProps} />
        </LoginStatusStorage.Provider>
      </MDXProvider>
      <Box component={"div"} style={{ marginTop: 8 }}>
        {routes.map(([routeName, routePath], idx) => (
          <Button key={idx} onClick={() => router.push(routePath)}>
            {routeName}
          </Button>
        ))}
      </Box>
      <Typography
        component={"div"}
        variant="body2"
        style={{ textAlign: "center" }}
      >
        ICOC2016, International Symposium of Computational Organometallic
        Catalysis
      </Typography>
    </Container>
  );
}
