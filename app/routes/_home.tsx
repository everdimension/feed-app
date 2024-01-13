import type { LoaderArgs } from "@remix-run/node";
import { Outlet, useLoaderData } from "@remix-run/react";
import { Spacer, VStack } from "structure-kit";
import { Header } from "~/components/Header";
import { MainLayout } from "~/components/MainLayout";
import { PageColumn } from "~/components/PageColumn";
import { getUserFromSession } from "~/modules/auth/auth.server";
import { getOtherUsers } from "~/modules/auth/user.server";
import { SurfaceList } from "~/ui-kit/SurfaceList";
import { UIText } from "~/ui-kit/UIText";

export async function loader({ request }: LoaderArgs) {
  const user = await getUserFromSession({ request });
  const users = await getOtherUsers(user?.id || "");
  return { user, users };
}

export default function Index() {
  const { user, users } = useLoaderData() as Awaited<ReturnType<typeof loader>>;
  console.log({ user })
  return (
    <MainLayout user={user} users={users}>
      <PageColumn>
        <Header title="Overview" user={user} />
        <Spacer height={32} />
        <VStack gap={12}>
          <UIText kind="headline/h2">Users</UIText>
          {users.length ? (
            <SurfaceList
              items={users.map((user) => ({
                key: user.id,
                to: `/reaction/${user.id}`,
                component: (
                  <UIText kind="body/regular">{user.profile.username}</UIText>
                ),
              }))}
            />
          ) : (
            <UIText kind="body/regular" style={{ textAlign: "center" }}>
              No Users
            </UIText>
          )}
        </VStack>
        <Outlet />
      </PageColumn>
    </MainLayout>
  );
}
