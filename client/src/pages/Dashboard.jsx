import React, { useEffect, useState } from "react";
import { BarLoader } from "react-spinners";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { Input } from "@/components/ui/input";
import { FilterIcon } from "lucide-react";
import { getUrls } from "../../db/apiUrls";
import { UrlState } from "@/context";
import useFetch from "@/hooks/useFetch";
import { getClicksForUrls } from "../../db/apiClicks";
import Error from "@/components/authentication/Error";
import LinkCard from "@/components/dashboard/LinkCard";
import CreateLink from "@/components/dashboard/CreateLink";

const Dashboard = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const { user } = UrlState();

  const {
    loading,
    data: urls,
    error,
    funct: fnUrls,
  } = useFetch(getUrls, user?.id);

  const {
    loading: loadingClicks,
    data: clicks,
    funct: fnClicks,
  } = useFetch(
    getClicksForUrls,
    urls?.map((url) => url.id)
  );

  useEffect(() => {
    fnUrls();
  }, []);

  useEffect(() => {
    if (urls?.length) fnClicks();
  }, [urls?.length]);

  const filteredUrls = urls?.filter((url) =>
    url.title.toLowerCase().includes(searchQuery.toLowerCase())
  );
  return (
    <div className="flex flex-col gap-8 pt-4">
      {(loading || loadingClicks) && (
        <BarLoader width={"100%"} color="#36d7b7" className="mt-4 mb-4" />
      )}
      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Links created</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{urls?.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Total Clicks</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{clicks?.length}</p>
          </CardContent>
        </Card>
      </div>
      <div className="flex justify-between">
        <h1 className="text-4xl font-extrabold">My Links </h1>
        <CreateLink />
      </div>

      <div className="relative">
        <Input
          value={searchQuery}
          type="text"
          placeholder="Filter Links"
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <FilterIcon className="absolute top-2 right-2 p-1 text-gray-500" />
      </div>
      {error && <Error message={error?.message} />}
      {(filteredUrls || []).map((url, idx) => {
        return <LinkCard key={idx} url={url} fetchUrls={fnUrls} />;
      })}
    </div>
  );
};

export default Dashboard;
