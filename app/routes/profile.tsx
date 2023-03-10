import type { LoaderArgs } from '@remix-run/node';
import { useLoaderData } from 'react-router';
import { HStack, Spacer } from 'structure-kit';
import { PageColumn } from '~/components/PageColumn';
import { PageTitle } from '~/components/PageTitle';
import { PageTop } from '~/components/PageTop';
import { getUserFromSession, requireAuth } from '~/modules/auth/auth.server';
import { SurfaceList } from '~/ui-kit/SurfaceList';
import { UIText } from '~/ui-kit/UIText';

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
      <PageTop />
      <PageTitle>Profile</PageTitle>
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
