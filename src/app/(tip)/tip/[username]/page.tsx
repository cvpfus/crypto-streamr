import { getAddressByUsername } from "@/lib/data";
import TipForm from "./tip-form";
import { notFound } from "next/navigation";

export const metadata = {
  title: "Tip",
};

export default async function TipPage({
  params,
}: {
  params: { username: string };
}) {
  const address = await getAddressByUsername(params.username);

  if (!address || params.username === "admin") return notFound();

  return (
    <div className="flex flex-col items-center justify-center bg-white rounded-xl p-4 gap-2 max-w-md mx-4 shadow-md border">
      <div className="size-16 rounded-full bg-slate-400" />
      <div>Tip to {params.username}</div>
      <div className="text-sm text-center mb-4">
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.
      </div>
      <TipForm username={params.username} address={address} />
    </div>
  );
}
