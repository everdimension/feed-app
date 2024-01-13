import React from "react";
import { HStack } from "structure-kit";
import type { ClientUser, User } from "~/modules/auth/types.server";
import { Sidebar } from "./Sidebar";

export function MainLayout({
  user,
  users,
  children,
}: React.PropsWithChildren<{ user: User | null; users: ClientUser[] }>) {
  return (
    <HStack
      gap={0}
      style={{
        maxWidth: 800,
        marginInline: "auto",
        gridTemplateColumns: "200px 1fr",
      }}
    >
      <div style={{ marginTop: 102 }}>
        <Sidebar user={user} users={users} />
      </div>
      {children}
    </HStack>
  );
}
