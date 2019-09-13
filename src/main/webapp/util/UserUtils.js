
import { Storage } from './Storage';

export const nonBroadUser = () => {
  return Storage.userIsLogged() && Storage.getCurrentUser() != null && !Storage.getCurrentUser().isBroad 
}

export const broadUser = () => {
  return !nonBroadUser();
}

export const isAdmin = () => {
  return Storage.getCurrentUser() != null ? Storage.getCurrentUser().isAdmin || Storage.getCurrentUser().isORSP || Storage.getCurrentUser().isComplianceOffice : false;
}

export const isViewer = () => {
  return Storage.getCurrentUser() != null ? Storage.getCurrentUser().isViewer : false;
}


