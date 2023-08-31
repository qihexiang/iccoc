import axios from "axios";

export default function fetcher<T>(url: string): Promise<T> {
  return axios.get(url).then((res) => res.data);
}

export const loadingFailed = (
  <>
    <h2>Error </h2>
    <p>
      Can{"'"}t load the data now. Please wait a few minutes or contact the
      administrator
    </p>
  </>
);

export const loading = (
  <>
    <h2>Loading</h2>
    <p>Loading data, please wait.</p>
  </>
);
