import type { LoaderArgs } from "@remix-run/node";
import { Outlet, useLoaderData } from "react-router";
import { MainLayout } from "~/components/MainLayout";
import { getUserFromSession, requireAuth } from "~/modules/auth/auth.server";
import { getOtherUsers } from "~/modules/auth/user.server";

export async function loader({ request }: LoaderArgs) {
  const user = await getUserFromSession({ request });
  const users = await getOtherUsers(user?.id || "");
  return { user, users };
}

export default function Profile() {
  const { user, users } = useLoaderData() as Awaited<ReturnType<typeof loader>>;
  return (
    <MainLayout user={user} users={users}>
      <Outlet />
    </MainLayout>
  );
}
