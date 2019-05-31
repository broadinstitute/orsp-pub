import _ from 'lodash';

export const validateEmail = (email) => {
  let valid = false;
  const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  if (re.test(email)) {
    valid = true;
  }
  return valid;
};

export const areAllTheseThingsTruthy = (values) => {
  { _.every(values, true); }
}

export const areSomeTheseThingsTruthy = (values) => {
  { _.some(values, true); }
}

export const isEmpty = (value) => {
  if (typeof value === 'object' && value !== null  && value !== undefined) {
    return !Object.keys(value).length
  } else {
    return value === '' || value === null || value === undefined;
  }
}

export const createObjectCopy = (obj) => {
  let copy = {};
  if (!isEmpty(obj)) {
    copy = JSON.parse(JSON.stringify(obj));
  }
  return copy;
}

export const compareNotEmptyObjects = (obj1, obj2) => {
  return !isEmpty(obj1) && !isEmpty(obj2) ? JSON.stringify(obj1) === JSON.stringify(obj2) : false;
}

export const scrollToTop = () => {
  document.body.scrollTop = 0; // For Safari
  document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
}
