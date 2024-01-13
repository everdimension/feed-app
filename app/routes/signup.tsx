import { Spacer, VStack } from "structure-kit";
import type { ActionArgs } from "@remix-run/node";
import { PageColumn } from "~/components/PageColumn";
import { PageTitle } from "~/components/PageTitle";
import { PageTop } from "~/components/PageTop";
import { Button } from "~/ui-kit/Button";
import { InputField } from "~/ui-kit/Input/InputField";
import { UIText } from "~/ui-kit/UIText";
import { UnstyledLink } from "~/ui-kit/UnstyledLink";
import styles from "~/ui-kit/UIText/helpers.module.css";
import { createUserSession, register } from "~/modules/auth/auth.server";
import { isResponse } from "~/shared/isResponse";

export async function action({ request }: ActionArgs) {
  const formData = await request.formData();
  const result = await register({
    username: formData.get("username") as string,
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  });
  if (isResponse(result)) {
    return result;
  }
  return createUserSession({
    cookieHeader: request.headers.get("Cookie"),
    userId: result.id,
    redirectTo: "/",
  });
}

export default function Signup() {
  return (
    <PageColumn>
      <PageTop />
      <PageTitle>Signup</PageTitle>
      <Spacer height={32} />
      <form method="POST">
        <VStack gap={16}>
          <InputField
            label="Username"
            placeholder="Stranger"
            name="username"
            required={true}
          />
          <InputField
            label="Email"
            placeholder="hacker@protonmail.com"
            type="email"
            name="email"
            required={true}
          />
          <InputField
            label="Password"
            type="password"
            name="password"
            placeholder="your birthdate"
            required={true}
          />
          <Button>Create Account</Button>
          <UIText
            kind="body/regular"
            color="var(--primary)"
            style={{ textAlign: "center" }}
            className={styles.hoverUnderline}
          >
            <UnstyledLink to="/login">Or Login</UnstyledLink>
          </UIText>
        </VStack>
      </form>
    </PageColumn>
  );
}
