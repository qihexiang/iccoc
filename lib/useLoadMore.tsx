import { P } from "@/components/TypoElement";
import { useState, useEffect, useCallback } from "react";
import { InView } from "react-intersection-observer";

export function useLoadMore<T>(list: T[] | undefined, initState: number = 20) {
    const [displayAmount, setDisplayAmount] = useState(initState);
    const [loadMore, setLoadMore] = useState(false);

    useEffect(() => {
        const interval = setInterval(() => {
            if (loadMore) {
                setDisplayAmount((amount) => amount + 20);
            }
        }, 1000);
        return () => clearInterval(interval);
    }, [loadMore]);

    useEffect(() => {
        if (displayAmount > (list?.length ?? 0)) {
            setLoadMore(false);
        }
    }, [list, displayAmount]);

    const loadMoreComponent = displayAmount < (list?.length ?? 0) ? (
        <InView as={"div"} onChange={(inview) => setLoadMore(inview)}>
            <P>Loading more...</P>
        </InView>
    ) : null

    const reset = useCallback(() => setDisplayAmount(initState), [initState])

    return [displayAmount, loadMoreComponent, reset] as const
}