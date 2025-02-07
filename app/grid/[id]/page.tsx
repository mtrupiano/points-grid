import getGrid from "./actions/getGrid";
import Grid from "@/app/components/Grid";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const id = (await params).id;
  const queryResult = await getGrid(id);
  const gridData = JSON.parse(queryResult?.data?.[0]?.json);
  return (
    <div>
      <Grid gridData={gridData} />
    </div>
  );
}
