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
import type { AppProps } from "next/app";
import { useRouter } from "next/router";
import ICOC2016 from "./public/ICOC2016.jpg";
import { useEffect, useState } from "react";
import api from "@/lib/apiRequest";

const routes = [
  ["Home", "/"],
  ["Program", "/program"],
  ["General Info", "/general_info"],
  ["Speakers", "/speakers"],
  ["Activities", "/activities"],
  ["Registration", "/registration"],
  ["Visa Info", "/visa"],
  ["Accommodation", "/accommodation"],
  ["2016", "/2016"],
];

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const routeIdx = routes.findIndex(
    ([_, pathname]) =>
      pathname === router.pathname ||
      (router.pathname.startsWith("/activities") && pathname === "/activities")
  );
  const [count, setCount] = useState(0);
  useEffect(() => {
    api.get("/counter").then(res => {
      setCount(res.data.count)
    })
  }, [])
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
      <Box component={"div"} style={{ marginTop: 8 }}>
        {routes.map(([routeName, routePath], idx) => (
          <Button variant={idx === routeIdx ? "contained" : "text"} key={idx} onClick={() => router.push(routePath)}>
            {routeName}
          </Button>
        ))}
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
        }}
      >
        <Component {...pageProps} />
      </MDXProvider>
      <Typography
        component={"div"}
        variant="body2"
        sx={{ textAlign: "center" }}
      >
        ICOC2016, International Symposium of Computational Organometallic
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
    </Container>
  );
}
