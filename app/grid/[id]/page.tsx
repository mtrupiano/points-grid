import getGrid from "./actions/getGrid";
import GridClient from "./GridClient";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const id = (await params).id;
  const queryResult = await getGrid(id);
  return (
    <div>
      <GridClient gridJson={queryResult?.data[0].json} />
    </div>
  );
}
