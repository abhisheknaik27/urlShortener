import useFetch from "@/hooks/useFetch";
import { getLongUrl, storeClicks } from "../../db/apiUrls";
import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { BarLoader } from "react-spinners";

const RedirectLink = () => {
  const { id } = useParams();
  const { loading, data, funct } = useFetch(getLongUrl, id);

  const { loading: loadingStats, funct: fnStats } = useFetch(storeClicks, {
    id: data?.id,
    originalUrl: data?.original_url,
  });
  useEffect(() => {
    funct();
  }, []);
  useEffect(() => {
    if (!loading && data) {
      fnStats();
    }
  }, [loading]);

  if (loading || loadingStats) {
    return (
      <>
        <BarLoader className="mt-4" width={"100%"} color="#36d7b7" />
        <br />
        Redirecting...
      </>
    );
  }
  return null;
};

export default RedirectLink;
