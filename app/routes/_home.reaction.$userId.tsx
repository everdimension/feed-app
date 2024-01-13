import type { Color, Emoji } from "@prisma/client";
import { Prisma } from "@prisma/client";
import type { ActionArgs, LoaderArgs, V2_MetaFunction } from "@remix-run/node";
import { redirect, json } from "@remix-run/node";
import { useLoaderData, useNavigate } from "@remix-run/react";
import { useEffect, useRef } from "react";
import { HStack, Spacer, VStack } from "structure-kit";
import { requireAuth } from "~/modules/auth/auth.server";
import { findUserById } from "~/modules/auth/user.server";
import { createReaction } from "~/modules/reaction/reaction.server";
import { Button } from "~/ui-kit/Button";
import { InputField } from "~/ui-kit/Input/InputField";
import { UnstyledButton } from "~/ui-kit/UnstyledButton";

export const meta: V2_MetaFunction = () => [{ title: "Reaction Route" }];

export async function loader({ request, params }: LoaderArgs) {
  await requireAuth({ request });
  const { userId } = params;
  if (!userId || userId === "1337") {
    throw new Response(null, { status: 404, statusText: "Not Found" });
  }
  try {
    const recipient = await findUserById({ id: userId });
    if (!recipient) {
      throw new Response(null, { status: 404, statusText: "Not Found" });
    }
    return { recipient };
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      throw new Response(null, { status: 404, statusText: "Not Found" });
    } else {
      throw error;
    }
  }
}

function validate(fd: FormData) {
  if (
    typeof fd.get("message") !== "string" ||
    typeof fd.get("emoji") !== "string" ||
    typeof fd.get("textColor") !== "string" ||
    typeof fd.get("backgroundColor") !== "string" ||
    typeof fd.get("recipientId") !== "string"
  ) {
    return "Unexpected form value";
  }
  if (!fd.get("message")?.length) {
    return "Please provide a message";
  }
  if (!fd.get("recipientId")) {
    return "No recipient found";
  }
  return null;
}

export async function action({ request }: ActionArgs) {
  console.log("submission");
  const { userId } = await requireAuth({ request });
  const fd = await request.formData();
  const error = validate(fd);
  if (error) {
    return json({ error }, { status: 400 });
  }
  const message = fd.get("message") as string;
  const emoji = fd.get("emoji") as Emoji;
  const textColor = fd.get("textColor") as Color;
  const backgroundColor = fd.get("backgroundColor") as Color;
  const recipientId = fd.get("recipientId") as string;
  await createReaction({
    message,
    style: { emoji, backgroundColor, textColor },
    authorId: userId,
    recipientId,
  });
  return redirect("/");
}

const colors = ["WHITE", "RED", "GREEN", "YELLOW", "BLUE"];
const emojis = ["HEAVY_PLUS", "PARTY", "GOAT"] as const;
const emojiMap: Record<(typeof emojis)[number], { emoji: string }> = {
  GOAT: { emoji: "🐐" },
  PARTY: { emoji: "🥳" },
  HEAVY_PLUS: { emoji: "➕" },
};

export default function ReactionPage() {
  const { recipient } = useLoaderData<ReturnType<typeof loader>>();
  const navigate = useNavigate();
  const dialogRef = useRef<HTMLDialogElement | null>(null);
  useEffect(() => {
    if (!dialogRef.current?.open) {
      dialogRef.current?.showModal();
    }
  }, []);
  return (
    <dialog
      style={{
        width: 640,
        height: 480,
        backgroundColor: "var(--z-index-1)",
        border: "none",
        borderRadius: 8,
      }}
      ref={dialogRef}
      onClose={(event) => {
        if (event.currentTarget.returnValue === "cancel") {
          navigate("/");
        }
      }}
      onCancel={() => {
        navigate("/");
      }}
    >
      <form method="dialog">
        <input type="hidden" value={recipient.id} name="recipientId" />
        <div style={{ textAlign: "end" }}>
          <UnstyledButton
            formAction="/"
            value="cancel"
            style={{ color: "var(--primary)" }}
          >
            close
          </UnstyledButton>
        </div>
      </form>
      <Spacer height={24} />
      <HStack gap={12} style={{ gridTemplateColumns: "min-content 1fr" }}>
        <div
          style={{
            width: 56,
            height: 56,
            backgroundColor: "var(--notice-400)",
            borderRadius: "50%",
            textAlign: "center",
            lineHeight: "56px",
            userSelect: "none",
          }}
        >
          {recipient.profile.username
            .split(/\s+/)
            .slice(0, 2)
            .map((s) => s.charAt(0))
            .join("")
            .toUpperCase()}
        </div>

        <form method="post">
          <VStack gap={16}>
            <InputField
              autoFocus={true}
              label={`Your message to ${recipient.profile.username}`}
              placeholder=""
              type="text"
              name="message"
              required={true}
            />
            <HStack gap={8}>
              {emojis.map((emoji) => (
                <label
                  key={emoji}
                  style={{
                    border: "1px solid var(--neutral-300)",
                    borderRadius: 8,
                    padding: "4px 8px",
                  }}
                >
                  <HStack gap={4}>
                    <input
                      type="radio"
                      name="emoji"
                      value={emoji}
                      required={true}
                    />
                    <span>{emojiMap[emoji].emoji}</span>
                  </HStack>
                </label>
              ))}
            </HStack>
            <select name="textColor" required={true}>
              {colors.map((color) => (
                <option key={color} value={color}>
                  {color}
                </option>
              ))}
            </select>
            <select name="backgroundColor" required={true}>
              {colors.map((color) => (
                <option key={color} value={color}>
                  {color}
                </option>
              ))}
            </select>
            <Button kind="primary">Submit</Button>
          </VStack>
        </form>
      </HStack>
    </dialog>
  );
}
