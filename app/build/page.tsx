import { Suspense } from "react";
import GridBuilderClient from "./GridBuilderClient";

export default async function Page() {
  return (
    <Suspense>
      <GridBuilderClient />
    </Suspense>
  );
}
