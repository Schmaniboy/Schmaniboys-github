import { Permission } from '@ap/core';
import { listOwnInvoices } from '@ap/db';

import { ok, route } from '@/lib/api';

/** Die eigenen Rechnungen. Fremde gibt es hier nicht -- auch nicht als 403. */
export const GET = route(
  async (context) => ok({ invoices: await listOwnInvoices(context.userId()) }),
  { permission: Permission.INVOICE_READ_OWN },
);
