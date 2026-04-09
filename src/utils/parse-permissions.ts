import { PERMISSIONS } from "src/sections/sub-account/constants/status";

export function parsePermissions(permissionType: string[]): { [key: string]: string }[] {
  if (!permissionType) return [];

  return permissionType
    .map((key) => key.trim())
    .filter(Boolean)
    .map((key) => {
      const permission = PERMISSIONS.find((perm) => perm.value === key);
      if (permission) {
        return { [key]: permission.label };
      } else {
        console.warn(`Permission key "${key}" not found in PERMISSIONS.`);
        return { [key]: `Unknown permission: ${key}` };
      }
    });
}
