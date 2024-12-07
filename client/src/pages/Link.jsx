import { UrlState } from "@/context";
import useFetch from "@/hooks/useFetch";
import { getClicksForUrl } from "../../db/apiClicks";
import { deleteUrl, getUrl } from "../../db/apiUrls";
import React, { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { BarLoader, BeatLoader } from "react-spinners";
import { Copy, Download, LinkIcon, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
const Link = () => {
  const { id } = useParams();
  const { user } = UrlState();
  const navigate = useNavigate();
  const {
    loading,
    data: url,
    funct,
    error,
  } = useFetch(getUrl, { id, user_id: user?.id });

  const {
    loading: loadingStats,
    data: stats,
    funct: fnStats,
  } = useFetch(getClicksForUrl, id);

  const { loading: loadingDelete, funct: fnDelete } = useFetch(deleteUrl, id);

  const downloadImg = () => {
    const imageUrl = url?.qr;
    const fileName = url?.title;

    const anchor = document.createElement("a");
    anchor.href = imageUrl;
    anchor.download = fileName;

    document.appendChild(anchor);
    anchor.click();
    document.removeChild(anchor);
  };

  useEffect(() => {
    funct();
    fnStats();
  }, []);

  if (error) {
    navigate("/dashboard");
  }
  let link = "";
  if (url) {
    link = url?.customUrl ? url?.customUrl : url.short_url;
  }
  return (
    <>
      {(loading || loadingStats) && (
        <BarLoader className="mb-4" width={"100%"} color="#36d7b7" />
      )}

      <div className="flex flex-col gap-8 sm:flex-row justify-between">
        <div className="flex flex-col items-start gap-8 rounded-lg sm: w-2/5">
          <span className="text-6xl font-extrabold hover:underline cursor-pointer">
            {url?.title}
          </span>
          <a
            className="text-3xl sm:text-4xl text-blue-400 font-bold hover:underline cursor-pointer"
            href={`https://dqr.in/${link}`}
            target="_blank"
          >
            https://dqr.in/{link}
          </a>
          <a
            className="flex items-center gap-1 hover:underline cursor-pointer"
            href={url?.original_url}
            target="_blank"
          >
            <LinkIcon width={"15px"} />
            {url?.original_url}
          </a>
          <span className="flex items-end font-extralight text-sm">
            {new Date(url?.created_at).toLocaleString()}
          </span>

          <div className="flex gap-2">
            <Button
              variant="ghost"
              onClick={() =>
                navigator.clipboard.writeText(
                  `https://d-qr.in/${url?.short_url}`
                )
              }
            >
              <Copy />
            </Button>
            <Button variant="ghost" onClick={downloadImg}>
              <Download />
            </Button>
            <Button variant="ghost" onClick={() => fnDelete()}>
              {loadingDelete ? (
                <BeatLoader size={5} color="white" />
              ) : (
                <Trash />
              )}
            </Button>
          </div>
          <img
            src={url?.qr}
            className="w-full self-center sm:self-start ring ring-blue-500 p-1 object-contain"
            alt="qr code"
          />
        </div>

        <Card className="sm:w-3/5">
          <CardHeader>
            <CardTitle>Statistics</CardTitle>
          </CardHeader>
          {stats && stats?.length ? (
            <CardContent className="flex flex-col gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Total Clicks</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>{stats?.length}</p>
                </CardContent>
              </Card>

              <CardTitle>Location Data</CardTitle>
              {/* <Location stats={stats} /> */}
              <CardTitle>Devices</CardTitle>
              {/* <Devices stats={stats} /> */}
            </CardContent>
          ) : (
            <CardContent>
              {loadingStats === false ? "No Statistics Yet" : "Loading.."}
            </CardContent>
          )}
        </Card>
      </div>
    </>
  );
};

export default Link;
