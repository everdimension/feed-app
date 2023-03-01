import type { ActionArgs } from '@remix-run/node';
import { logout } from '~/modules/auth/auth.server';

export function action({ request }: ActionArgs) {
  return logout({ request });
}
