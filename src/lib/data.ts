import db from "./db";

export async function getUserByAddress(address: string) {
  const user = await db.user.findUnique({
    where: { address },
  });
  return user;
}

export async function getUserById(id: string) {
  const user = await db.user.findUnique({
    where: { id },
  });
  return user;
}

export async function getAddressByUsername(username: string) {
  const user = await db.user.findUnique({
    where: { username: username },
  });

  return user?.address ?? null;
}

export async function getAlertIdByUserId(userId: string) {
  const alert = await db.alertSetting.findUnique({
    where: { userId },
  });

  return alert?.id ?? null;
}

export async function getUserIdByAlertId(alertId: string) {
  const alert = await db.alertSetting.findUnique({
    where: { id: alertId },
  });

  return alert?.userId ?? null;
}

export async function getUserImageUrl(username: string | null | undefined) {
  if (!username) {
    return `https://api.dicebear.com/6.x/thumbs/png?seed=${username}`;
  }

  const user = await db.user.findUnique({
    where: { username },
  });

  return (
    user?.userImageUrl ??
    `https://api.dicebear.com/6.x/thumbs/png?seed=${username}`
  );
}
