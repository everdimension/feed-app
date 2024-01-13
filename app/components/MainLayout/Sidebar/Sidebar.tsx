import { Link } from "@remix-run/react";
import { VStack } from "structure-kit";
import type { ClientUser, User } from "~/modules/auth/types.server";
import { TextLink } from "~/ui-kit/TextLink";
import { UIText } from "~/ui-kit/UIText";
import { UnstyledButton } from "~/ui-kit/UnstyledButton";

export function Sidebar({
  user,
  users,
}: {
  user: User | null;
  users: ClientUser[];
}) {
  return (
    <aside
      style={{
        // minHeight: 'calc(100vh - 102px)',
        padding: 20,
        paddingTop: 0,
        display: "flex",
        flexDirection: "column",
      }}
    >
      <VStack gap={20}>
        <TextLink to="/">Home</TextLink>

        <VStack gap={0}>
          <UIText kind="small/regular" color="var(--neutral-500)">
            Users
          </UIText>
          <VStack gap={0}>
            {users.map((user) => (
              <UIText
                as={Link}
                to={`/reaction/${user.id}`}
                key={user.id}
                kind="small/accent"
              >
                {user.profile.username}
              </UIText>
            ))}
          </VStack>
        </VStack>
      </VStack>
      <div style={{ marginTop: 32 }}>
        {user ? (
          <form action="/logout" method="post">
            <UnstyledButton style={{ color: "var(--negative-500)" }}>
              Logout
            </UnstyledButton>
          </form>
        ) : (
          <TextLink to="/login">Login</TextLink>
        )}
      </div>
    </aside>
  );
}
