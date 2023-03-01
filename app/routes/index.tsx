import type { LoaderArgs } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { Spacer, VStack } from 'structure-kit';
import { PageColumn } from '~/components/PageColumn';
import { PageTitle } from '~/components/PageTitle';
import { PageTop } from '~/components/PageTop';
import { getUserFromSession } from '~/modules/auth/auth.server';
import { getOtherUsers } from '~/modules/auth/user.server';
import { SurfaceList } from '~/ui-kit/SurfaceList';
import { TextLink } from '~/ui-kit/TextLink';
import { UIText } from '~/ui-kit/UIText';

export async function loader({ request }: LoaderArgs) {
  const user = await getUserFromSession({ request });
  const users = await getOtherUsers(user?.id || '');
  return { user, users };
}

export default function Index() {
  const { user, users } = useLoaderData() as Awaited<ReturnType<typeof loader>>;
  return (
    <PageColumn>
      <PageTop />
      <PageTitle>
        {user ? (
          <span>
            Hello, <TextLink to="/profile">{user.profile.username}</TextLink>
          </span>
        ) : (
          'Overview'
        )}
      </PageTitle>
      <Spacer height={32} />
      <VStack gap={12}>
        <UIText kind="headline/h2">Users</UIText>
        {users.length ? (
          <SurfaceList
            items={users.map(user => ({
              key: user.id,
              component: (
                <UIText kind="body/regular">{user.profile.username}</UIText>
              ),
            }))}
          />
        ) : (
          <UIText kind="body/regular" style={{ textAlign: 'center' }}>
            No Users
          </UIText>
        )}
      </VStack>
    </PageColumn>
  );
}
