export const isObject = (value: Object) => {
  return value != null && (typeof value === 'object' || typeof value === 'function') && !Array.isArray(value);
}

export const isArray = (value: Object) => {
  return Array.isArray(value)
}

export const isBoolean = (value: Object) => {
  return value instanceof Boolean || typeof value === 'boolean';
}

export const isDate = (value: Object) => {
  return value instanceof Date && !isNaN(value.getTime());
}

export const isInt = (value: Object) => {
  return typeof value === 'number' && Number.isInteger(value);
}

export interface IsNumberOptions {
  allowNaN?: boolean;
  allowInfinity?: boolean;
  maxDecimalPlaces?: number;
}

export const isNumber = (value: Object, options: IsNumberOptions = {}) => {
  if (typeof value !== 'number') {
    return false;
  }

  if (value === Infinity || value === -Infinity) {
    return !!options.allowInfinity;
  }

  if (Number.isNaN(value)) {
    return !!options.allowNaN;
  }

  if (options.maxDecimalPlaces !== undefined) {
    let decimalPlaces = 0;
    if (value % 1 !== 0) {
      decimalPlaces = value.toString().split('.')[1].length;
    }
    if (decimalPlaces > options.maxDecimalPlaces) {
      return false;
    }
  }

  return Number.isFinite(value);
}

export const isString = (value: Object) => {
  return value instanceof String || typeof value === 'string';
}

export const isNull = (value: Object) => {
  return value === null;
}

export const isUndefined = (value: Object) => {
  return typeof value === "undefined" || value === undefined;
}