import type { SubAccountInterface, SubAccountResponseInterface } from "src/interfaces";

import { parsePermissions } from "src/utils/parse-permissions";

import { splitName, capitalizeFirstLetter } from "src/utils";


export function subaccountListAdapter(subAccounts: SubAccountResponseInterface[]): SubAccountInterface[] {
  return subAccounts.map((subAccount) => {
    const { firstName, lastName } = splitName(subAccount.name);
    return {
      id: subAccount.entity_id,
      firstname: capitalizeFirstLetter(firstName),
      lastname: capitalizeFirstLetter(lastName),
      email: subAccount.email,
      status: subAccount.status == 1 ? 'ACTIVE' : 'INACTIVE',
      createdAt: subAccount.created_at,
      permissions: parsePermissions(subAccount.permissionType)
    };
  });
}

