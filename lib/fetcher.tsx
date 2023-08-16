import { H2, P } from "@/components/TypoElement";
import { Container } from "@mui/system";
import axios from "axios";

export default function fetcher<T>(url: string): Promise<T> {
  return axios.get(url).then((res) => res.data);
}

export const loadingFailed = (
  <Container>
    <H2>Error </H2>
    <P>
      Can't load the data now. Please wait a few minutes or contact the
      administrator
    </P>
  </Container>
);

export const loading = (
  <Container>
    <H2>Loading</H2>
    <P>Loading data, please wait.</P>
  </Container>
);
