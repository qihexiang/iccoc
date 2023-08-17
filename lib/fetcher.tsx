import { H2, P } from "@/components/TypoElement";
import axios from "axios";

export default function fetcher<T>(url: string): Promise<T> {
  return axios.get(url).then((res) => res.data);
}

export const loadingFailed = (
  <>
    <H2>Error </H2>
    <P>
      Can&#39t load the data now. Please wait a few minutes or contact the
      administrator
    </P>
  </>
);

export const loading = (
  <>
    <H2>Loading</H2>
    <P>Loading data, please wait.</P>
  </>
);
