import type { V2_MetaFunction } from "@remix-run/node";

export const meta: V2_MetaFunction = () => [{ title: "Home Index" }];

export default function HomeIndex() {
  return null;
}
