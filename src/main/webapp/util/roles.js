export const USER_ROLES = [
  { label: 'Admin', value: 'orsp' },
  { label: 'Compliance Office', value: 'Compliance Office' },
  { label: 'Read Only', value: 'ro_admin' }
];

export const ROLE = {
  admin: 0,
  complianceOffice: 1,
  readOnly: 2
};

export const formatRoleName = (roles) => {
  let formattedRole = [];
  roles.forEach(it => {
    if (it === "orsp" || it === "admin") {
      formattedRole.push("admin")
    }
    if (it === "ro_admin") {
      formattedRole.push("Read Only")
    }
    if (it === "Compliance Office") {
      formattedRole.push("Compliance Office")
    }
  });
  return [...new Set(formattedRole)].join(', ');
};
