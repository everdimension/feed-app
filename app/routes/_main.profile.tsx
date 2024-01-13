import type { LoaderArgs, V2_MetaFunction } from "@remix-run/node";
import { useLoaderData } from "react-router";
import { HStack, Spacer } from "structure-kit";
import { Header } from "~/components/Header";
import { PageColumn } from "~/components/PageColumn";
import { getUserFromSession, requireAuth } from "~/modules/auth/auth.server";
import { SurfaceList } from "~/ui-kit/SurfaceList";
import { UIText } from "~/ui-kit/UIText";

export const meta: V2_MetaFunction = () => [{ title: "Main / Profile" }];

export async function loader({ request }: LoaderArgs) {
  await requireAuth({ request });
  const user = await getUserFromSession({ request });
  return user;
}

export default function Profile() {
  const user = useLoaderData() as
    | undefined
    | Awaited<ReturnType<typeof loader>>;
  if (!user) {
    return <p>no user</p>;
  }
  return (
    <PageColumn>
      <Header title="Profile" user={user} />
      <Spacer height={32} />
      <SurfaceList
        items={[
          {
            key: 0,
            component: (
              <HStack gap={4} justifyContent="space-between">
                <UIText kind="body/regular" color="var(--neutral-500)">
                  Username
                </UIText>
                <UIText kind="body/regular">{user.profile.username}</UIText>
              </HStack>
            ),
          },
          {
            key: 1,
            component: (
              <HStack gap={4} justifyContent="space-between">
                <UIText kind="body/regular" color="var(--neutral-500)">
                  Email
                </UIText>
                <UIText kind="body/regular">{user.email}</UIText>
              </HStack>
            ),
          },
        ]}
      />
      <Spacer height={32} />
      <form action="/logout" method="post">
        <SurfaceList
          items={[
            {
              key: 0,
              onClick: () => {},
              component: (
                <UIText kind="body/regular" color="var(--negative-500)">
                  Logout
                </UIText>
              ),
            },
          ]}
        />
      </form>
    </PageColumn>
  );
}
