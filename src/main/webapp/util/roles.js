export const USER_ROLES = {
  'Admin' : { label: 'Admin', value :'orsp', alias: ['orsp', 'admin', 'Compliance Office'], index: 0 },
  'Read Only' : { label: 'Read Only', value :'ro_admin', alias: ['ro_admin'], index: 1 }
};

export const formatRoleName = (roles) => {
  let formattedRole = [];
  roles.forEach(it => {
    if (it === "orsp" || it === "admin" || it === "Compliance Office") {
      formattedRole.push("admin")
    }
    if (it === "ro_admin") {
      formattedRole.push("Read Only")
    }
  });
  return [...new Set(formattedRole)].join(', ');
};
