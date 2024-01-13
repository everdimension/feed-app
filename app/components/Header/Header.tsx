import { HStack } from 'structure-kit';
import type { User } from '~/modules/auth/types.server';
import { TextLink } from '~/ui-kit/TextLink';
import { PageTitle } from '../PageTitle';
import { PageTop } from '../PageTop';

export function Header({
  title,
  user,
}: {
  title: React.ReactNode;
  user?: User | null;
}) {
  return (
    <div>
      <PageTop />
      <HStack gap={24} justifyContent="space-between" alignItems="baseline">
        <PageTitle>{title}</PageTitle>
        {user ? (
          <TextLink to="/profile">{user.profile.username}</TextLink>
        ) : (
          <TextLink to="/login">Login</TextLink>
        )}
      </HStack>
    </div>
  );
}
