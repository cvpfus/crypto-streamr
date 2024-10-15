import { getUserIdByAlertId } from "@/lib/data";
import Widget from "./widget";

export default async function AlertPage({
  params,
}: {
  params: { id: string };
}) {
  const userId = await getUserIdByAlertId(params.id);

  if (!userId) {
    return <div>User not found</div>;
  }

  return <Widget userId={userId} />;
}
