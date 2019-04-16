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

export const parseDate = (date) => {
  if (date !== undefined) {
    let d = new Date(date).toISOString();
    return d.slice(0, d.indexOf("T"));
  }
}
