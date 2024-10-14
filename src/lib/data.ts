import db from "./db";

export async function getUser(address: string) {
  const user = await db.user.findUnique({
    where: { address },
  });
  return user;
}

export async function getAddressByUsername(username: string) {
  const user = await db.user.findUnique({
    where: { username: username },
  });

  return user?.address ?? null;
}
