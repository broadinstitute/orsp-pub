export const USER_ROLES = {
  'Admin' : { label: 'Admin', value :'orsp', index: 0 },
  'Compliance Office' : { label: 'Compliance Office', value :'Compliance Office', index: 1 },
  'Read Only' : { label: 'Read Only', value :'ro_admin', index: 2 }
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
