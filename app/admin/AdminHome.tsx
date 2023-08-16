"use client";

import { H2, H3, P } from "@/components/TypoElement";
import fetcher, { loading, loadingFailed } from "@/lib/fetcher";
import { Box, Container } from "@mui/system";
import { useEffect, useState } from "react";
import useSWR from "swr";
import { InView } from "react-intersection-observer";

export default function AdminHome() {
  return (
    <>
      <AbstractList></AbstractList>
    </>
  );
}

function AbstractList() {
  const { data: list, error } = useSWR<number[]>(
    "/api/v2/admin/abstract",
    fetcher,
    {
      refreshInterval: 60 * 1000,
      errorRetryCount: 5,
      errorRetryInterval: 5 * 1000,
    }
  );

  const [displayAmount, setDisplayAmount] = useState(20);
  const [loadMore, setLoadMore] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      if (loadMore && displayAmount <= (list?.length ?? 0)) {
        setDisplayAmount((amount) => amount + 20);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [loadMore, list?.length]);

  if (error) return loadingFailed;

  if (list === undefined) return loading;

  return (
    <Container>
      <H2>Abstracts</H2>
      {list.map((itemId) => (
        <AbstractItem abstractId={itemId} key={itemId}></AbstractItem>
      ))}
      {displayAmount < list.length ? (
        <InView as={"div"} onChange={(inview) => setLoadMore(inview)}>
          <P>Loading more...</P>
        </InView>
      ) : null}
    </Container>
  );
}

// function AbstractItem(props: AbstractItemData) {
//   return (
//     <Box>
//       <H3>
//         {props.title} <StatusIndicator status={props.status}></StatusIndicator>
//       </H3>
//       <Box>
//         <AuthorItem
//           name={props.user.name}
//           email={props.user.email}
//           attend={true}
//         ></AuthorItem>
//         {props.collaborators.map((item, idx) => (
//           <AuthorItem {...item} key={idx}></AuthorItem>
//         ))}
//       </Box>
//       <ButtonGroup variant="contained">
//         <Button color="success">Download abstracts</Button>
//         <Button color="primary">Accept</Button>
//         <Button color="error">Reject</Button>
//       </ButtonGroup>
//     </Box>
//   );
// }

function AbstractItem(props: { abstractId: number }) {
  const { data: abstract, error } = useSWR<{
    name: string
  }>(
    `/api/v2/admin/abstract/${props.abstractId}`,
    fetcher,
    {
      refreshInterval: 60 * 1000,
      errorRetryCount: 5,
      errorRetryInterval: 5 * 1000,
    }
  );

  if (error) return loadingFailed;

  if (abstract === undefined) return loading;

  return <Container>
    <H3>{abstract.name}</H3>
  </Container>;
}

// function AuthorItem(props: { email: string; name: string; attend: boolean }) {
//   return (
//     <P>
//       {props.name} | {props.name} | {props.attend ? "Attend" : "Not attend"}
//     </P>
//   );
// }
