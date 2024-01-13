import type { ActionArgs, LoaderArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { Spacer, VStack } from "structure-kit";
import { PageColumn } from "~/components/PageColumn";
import { PageTitle } from "~/components/PageTitle";
import { PageTop } from "~/components/PageTop";
import { Button } from "~/ui-kit/Button";
import { InputField } from "~/ui-kit/Input/InputField";
import { UIText } from "~/ui-kit/UIText";
import { UnstyledLink } from "~/ui-kit/UnstyledLink";
import styles from "~/ui-kit/UIText/helpers.module.css";
import {
  createUserSession,
  getUserFromSession,
  login,
} from "~/modules/auth/auth.server";
import { isResponse } from "~/shared/isResponse";
import { useActionData } from "react-router";
import { Form } from "@remix-run/react";

function getNextDestination(request: Request) {
  const next = new URLSearchParams(new URL(request.url).search).get("next");
  return next || "/";
}

export const action = async ({ request }: ActionArgs) => {
  const formData = await request.formData();
  const result = await login({
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  });
  if (isResponse(result)) {
    return result;
  }

  return createUserSession({
    cookieHeader: request.headers.get("Cookie"),
    userId: result.id,
    redirectTo: getNextDestination(request),
  });
};

export async function loader({ request }: LoaderArgs) {
  const user = await getUserFromSession({ request });
  if (user) {
    return redirect(getNextDestination(request));
  }
  return null;
}

interface Errors {
  error: string;
}
export default function Login() {
  const errors = useActionData() as Errors | undefined;
  console.log({ errors });
  return (
    <PageColumn>
      <PageTop />
      <PageTitle>Login</PageTitle>
      <Spacer height={32} />
      <Form method="post">
        <VStack gap={16}>
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
          {errors?.error ? (
            <UIText
              kind="body/regular"
              color="var(--negative-500)"
              style={{ textAlign: "center" }}
            >
              {errors.error}
            </UIText>
          ) : null}
          <Button>Login</Button>
          <UIText
            kind="body/regular"
            color="var(--primary)"
            style={{ textAlign: "center" }}
            className={styles.hoverUnderline}
          >
            <UnstyledLink to="/signup">Register New User</UnstyledLink>
          </UIText>
        </VStack>
      </Form>
    </PageColumn>
  );
}
