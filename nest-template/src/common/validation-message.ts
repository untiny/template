import { ValidationArguments, ValidationOptions } from 'class-validator'

export interface ValidationMessageOptions extends ValidationArguments, Pick<ValidationOptions, 'each'> {
  message?: string
}

export interface BuildMessage {
  (options: ValidationMessageOptions): string
}

const defaultValidationMessage = {
  arrayContains: (options: ValidationMessageOptions): string => {
    return `${options.each ? 'each value in ' : ''}$property must contain $constraint1 values`
  },
  arrayMaxSize: (options: ValidationMessageOptions): string => {
    return `${options.each ? 'each value in ' : ''}$property must contain no more than $constraint1 elements`
  },
  arrayMinSize: (options: ValidationMessageOptions): string => {
    return `${options.each ? 'each value in ' : ''}$property must contain at least $constraint1 elements`
  },
  arrayNotContains: (options: ValidationMessageOptions): string => {
    return `${options.each ? 'each value in ' : ''}$property should not contain $constraint1 values`
  },
  arrayNotEmpty: (options: ValidationMessageOptions): string => {
    return `${options.each ? 'each value in ' : ''}$property should not be empty`
  },
  arrayUnique: (options: ValidationMessageOptions): string => {
    return `${options.each ? 'each value in ' : ''}All $property's elements must be unique`
  },
  equals: (options: ValidationMessageOptions): string => {
    return `${options.each ? 'each value in ' : ''}$property must be equal to $constraint1`
  },
  isDefined: (options: ValidationMessageOptions): string => {
    return `${options.each ? 'each value in ' : ''}$property should not be null or undefined`
  },
  isEmpty: (options: ValidationMessageOptions): string => {
    return `${options.each ? 'each value in ' : ''}$property must be empty`
  },
  isIn: (options: ValidationMessageOptions): string => {
    return `${options.each ? 'each value in ' : ''}$property must be one of the following values: $constraint1`
  },
  isLatLong: (options: ValidationMessageOptions): string => {
    return `${options.each ? 'each value in ' : ''}$property must be a latitude,longitude string`
  },
  isLatitude: (options: ValidationMessageOptions): string => {
    return `${options.each ? 'each value in ' : ''}$property must be a latitude string or number`
  },
  isLongitude: (options: ValidationMessageOptions): string => {
    return `${options.each ? 'each value in ' : ''}$property must be a longitude string or number`
  },
  isNotEmpty: (options: ValidationMessageOptions): string => {
    return `${options.each ? 'each value in ' : ''}$property should not be empty`
  },
  isNotIn: (options: ValidationMessageOptions): string => {
    return `${options.each ? 'each value in ' : ''}$property should not be one of the following values: $constraint1`
  },
  notEquals: (options: ValidationMessageOptions): string => {
    return `${options.each ? 'each value in ' : ''}$property should not be equal to $constraint1`
  },
  nestedValidation: (options: ValidationMessageOptions): string => {
    if (options.message) {
      return options.message
    }
    return `${options.each ? 'each value in ' : ''}nested property $property must be either object or array`
  },
  maxDate: (options: ValidationMessageOptions): string => {
    return `${options.each ? 'each value in ' : ''}maximal allowed date for $property is $constraint1`
  },
  minDate: (options: ValidationMessageOptions): string => {
    return `${options.each ? 'each value in ' : ''}minimal allowed date for $property is $constraint1`
  },
  isDivisibleBy: (options: ValidationMessageOptions): string => {
    return `${options.each ? 'each value in ' : ''}$property must be divisible by $constraint1`
  },
  isNegative: (options: ValidationMessageOptions): string => {
    return `${options.each ? 'each value in ' : ''}$property must be a negative number`
  },
  isPositive: (options: ValidationMessageOptions): string => {
    return `${options.each ? 'each value in ' : ''}$property must be a positive number`
  },
  max: (options: ValidationMessageOptions): string => {
    return `${options.each ? 'each value in ' : ''}$property must not be greater than $constraint1`
  },
  min: (options: ValidationMessageOptions): string => {
    return `${options.each ? 'each value in ' : ''}$property must not be less than $constraint1`
  },
  isInstance: (options: ValidationMessageOptions): string => {
    if (options.constraints[0]) {
      return `${options.each ? 'each value in ' : ''}$property must be an instance of ${options.constraints[0].name}`
    }
    else {
      return `${options.each ? 'each value in ' : ''}isInstance decorator expects and object as value, but got falsy value.`
    }
  },
  contains: (options: ValidationMessageOptions): string => {
    return `${options.each ? 'each value in ' : ''}$property must contain a $constraint1 string`
  },
  isAlpha: (options: ValidationMessageOptions): string => {
    return `${options.each ? 'each value in ' : ''}$property must contain only letters (a-zA-Z)`
  },
  isAlphanumeric: (options: ValidationMessageOptions): string => {
    return `${options.each ? 'each value in ' : ''}$property must contain only letters and numbers`
  },
  isAscii: (options: ValidationMessageOptions): string => {
    return `${options.each ? 'each value in ' : ''}$property must contain only ASCII characters`
  },
  isBIC: (options: ValidationMessageOptions): string => {
    return `${options.each ? 'each value in ' : ''}$property must be a BIC or SWIFT code`
  },
  isBase32: (options: ValidationMessageOptions): string => {
    return `${options.each ? 'each value in ' : ''}$property must be base32 encoded`
  },
  isBase58: (options: ValidationMessageOptions): string => {
    return `${options.each ? 'each value in ' : ''}$property must be base58 encoded`
  },
  isBase64: (options: ValidationMessageOptions): string => {
    return `${options.each ? 'each value in ' : ''}$property must be base64 encoded`
  },
  isBooleanString: (options: ValidationMessageOptions): string => {
    return `${options.each ? 'each value in ' : ''}$property must be a boolean string`
  },
  isBtcAddress: (options: ValidationMessageOptions): string => {
    return `${options.each ? 'each value in ' : ''}$property must be a BTC address`
  },
  isByteLength: (options: ValidationMessageOptions): string => {
    return `${options.each ? 'each value in ' : ''}$property's byte length must fall into ($constraint1, $constraint2) range`
  },
  isCreditCard: (options: ValidationMessageOptions): string => {
    return `${options.each ? 'each value in ' : ''}$property must be a credit card`
  },
  isCurrency: (options: ValidationMessageOptions): string => {
    return `${options.each ? 'each value in ' : ''}$property must be a currency`
  },
  isDataURI: (options: ValidationMessageOptions): string => {
    return `${options.each ? 'each value in ' : ''}$property must be a data uri format`
  },
  isDateString: (options: ValidationMessageOptions): string => {
    return `${options.each ? 'each value in ' : ''}$property must be a valid ISO 8601 date string`
  },
  isDecimal: (options: ValidationMessageOptions): string => {
    return `${options.each ? 'each value in ' : ''}$property is not a valid decimal number`
  },
  isEAN: (options: ValidationMessageOptions): string => {
    return `${options.each ? 'each value in ' : ''}$property must be an EAN (European Article Number)`
  },
  isEmail: (options: ValidationMessageOptions): string => {
    return `${options.each ? 'each value in ' : ''}$property must be an email`
  },
  isEthereumAddress: (options: ValidationMessageOptions): string => {
    return `${options.each ? 'each value in ' : ''}$property must be an Ethereum address`
  },
  isFQDN: (options: ValidationMessageOptions): string => {
    return `${options.each ? 'each value in ' : ''}$property must be a valid domain name`
  },
  IsFirebasePushId: (options: ValidationMessageOptions): string => {
    return `${options.each ? 'each value in ' : ''}$property must be a Firebase Push Id`
  },
  isFullWidth: (options: ValidationMessageOptions): string => {
    return `${options.each ? 'each value in ' : ''}$property must contain a full-width characters`
  },
  isHSL: (options: ValidationMessageOptions): string => {
    return `${options.each ? 'each value in ' : ''}$property must be a HSL color`
  },
  isHalfWidth: (options: ValidationMessageOptions): string => {
    return `${options.each ? 'each value in ' : ''}$property must contain a half-width characters`
  },
  isHash: (options: ValidationMessageOptions): string => {
    return `${options.each ? 'each value in ' : ''}$property must be a hash of type $constraint1`
  },
  isHexColor: (options: ValidationMessageOptions): string => {
    return `${options.each ? 'each value in ' : ''}$property must be a hexadecimal color`
  },
  isHexadecimal: (options: ValidationMessageOptions): string => {
    return `${options.each ? 'each value in ' : ''}$property must be a hexadecimal number`
  },
  isIBAN: (options: ValidationMessageOptions): string => {
    return `${options.each ? 'each value in ' : ''}$property must be an IBAN`
  },
  isIp: (options: ValidationMessageOptions): string => {
    return `${options.each ? 'each value in ' : ''}$property must be an ip address`
  },
  isISBN: (options: ValidationMessageOptions): string => {
    return `${options.each ? 'each value in ' : ''}$property must be an ISBN`
  },
  isISIN: (options: ValidationMessageOptions): string => {
    return `${options.each ? 'each value in ' : ''}$property must be an ISIN`
  },
  isISO31661Alpha2: (options: ValidationMessageOptions): string => {
    return `${options.each ? 'each value in ' : ''}$property must be a valid ISO31661 Alpha2 code`
  },
  isISO31661Alpha3: (options: ValidationMessageOptions): string => {
    return `${options.each ? 'each value in ' : ''}$property must be a valid ISO31661 Alpha3 code`
  },
  isIso8601: (options: ValidationMessageOptions): string => {
    return `${options.each ? 'each value in ' : ''}$property must be a valid ISO8601 date string`
  },
  isISRC: (options: ValidationMessageOptions): string => {
    return `${options.each ? 'each value in ' : ''}$property must be an ISRC`
  },
  isISSN: (options: ValidationMessageOptions): string => {
    return `${options.each ? 'each value in ' : ''}$property must be an ISSN`
  },
  isIdentityCard: (options: ValidationMessageOptions): string => {
    return `${options.each ? 'each value in ' : ''}$property must be a identity card number`
  },
  isJson: (options: ValidationMessageOptions): string => {
    return `${options.each ? 'each value in ' : ''}$property must be a valid json string`
  },
  isJWT: (options: ValidationMessageOptions): string => {
    return `${options.each ? 'each value in ' : ''}$property must be a jwt string`
  },
  isLocale: (options: ValidationMessageOptions): string => {
    return `${options.each ? 'each value in ' : ''}$property must be a locale`
  },
  isLowercase: (options: ValidationMessageOptions): string => {
    return `${options.each ? 'each value in ' : ''}$property must be a lowercase string`
  },
  isMacAddress: (options: ValidationMessageOptions): string => {
    return `${options.each ? 'each value in ' : ''}$property must be a MAC address`
  },
  isMagnetURI: (options: ValidationMessageOptions): string => {
    return `${options.each ? 'each value in ' : ''}$property must be magnet uri format`
  },
  isMilitaryTime: (options: ValidationMessageOptions): string => {
    return `${options.each ? 'each value in ' : ''}$property must be a valid representation of military time in the format HH:MM`
  },
  isMimeType: (options: ValidationMessageOptions): string => {
    return `${options.each ? 'each value in ' : ''}$property must be MIME type format`
  },
  isMobilePhone: (options: ValidationMessageOptions): string => {
    return `${options.each ? 'each value in ' : ''}$property must be a phone number`
  },
  isMongoId: (options: ValidationMessageOptions): string => {
    return `${options.each ? 'each value in ' : ''}$property must be a valid mongo id`
  },
  isMultibyte: (options: ValidationMessageOptions): string => {
    return `${options.each ? 'each value in ' : ''}$property must contain one or more multibyte chars`
  },
  isNumberString: (options: ValidationMessageOptions): string => {
    return `${options.each ? 'each value in ' : ''}$property must be a number string`
  },
  isOctal: (options: ValidationMessageOptions): string => {
    return `${options.each ? 'each value in ' : ''}$property must be valid octal number`
  },
  isPassportNumber: (options: ValidationMessageOptions): string => {
    return `${options.each ? 'each value in ' : ''}$property must be valid passport number`
  },
  isPhoneNumber: (options: ValidationMessageOptions): string => {
    return `${options.each ? 'each value in ' : ''}$property must be a valid phone number`
  },
  isPort: (options: ValidationMessageOptions): string => {
    return `${options.each ? 'each value in ' : ''}$property must be a port`
  },
  isPostalCode: (options: ValidationMessageOptions): string => {
    return `${options.each ? 'each value in ' : ''}$property must be a postal code`
  },
  isRFC3339: (options: ValidationMessageOptions): string => {
    return `${options.each ? 'each value in ' : ''}$property must be a valid RFC 3339 date string`
  },
  isRgbColor: (options: ValidationMessageOptions): string => {
    return `${options.each ? 'each value in ' : ''}$property must be RGB color`
  },
  isSemVer: (options: ValidationMessageOptions): string => {
    return `${options.each ? 'each value in ' : ''}$property must be a Semantic Versioning Specification`
  },
  isStrongPassword: (options: ValidationMessageOptions): string => {
    return `${options.each ? 'each value in ' : ''}$property is not strong enough`
  },
  isSurrogatePair: (options: ValidationMessageOptions): string => {
    return `${options.each ? 'each value in ' : ''}$property must contain any surrogate pairs chars`
  },
  isTimeZone: (options: ValidationMessageOptions): string => {
    return `${options.each ? 'each value in ' : ''}$property must be a valid IANA time-zone`
  },
  isUuid: (options: ValidationMessageOptions): string => {
    return `${options.each ? 'each value in ' : ''}$property must be a UUID`
  },
  isUppercase: (options: ValidationMessageOptions): string => {
    return `${options.each ? 'each value in ' : ''}$property must be uppercase`
  },
  isUrl: (options: ValidationMessageOptions): string => {
    return `${options.each ? 'each value in ' : ''}$property must be a URL address`
  },
  isVariableWidth: (options: ValidationMessageOptions): string => {
    return `${options.each ? 'each value in ' : ''}$property must contain a full-width and half-width characters`
  },
  isLength: (options: ValidationMessageOptions): string => {
    const isMinLength = options?.constraints[0] !== null && options?.constraints[0] !== undefined
    const isMaxLength = options?.constraints[1] !== null && options?.constraints[1] !== undefined
    if (isMinLength && (!options.value || options.value.length < options?.constraints[0])) {
      return `${options.each ? 'each value in ' : ''}$property must be longer than or equal to $constraint1 characters`
    }
    else if (isMaxLength && options.value.length > options?.constraints[1]) {
      return `${options.each ? 'each value in ' : ''}$property must be shorter than or equal to $constraint2 characters`
    }
    return `${options.each ? 'each value in ' : ''}$property must be longer than or equal to $constraint1 and shorter than or equal to $constraint2 characters`
  },
  matches: (options: ValidationMessageOptions): string => {
    return `${options.each ? 'each value in ' : ''}$property must match $constraint1 regular expression`
  },
  maxLength: (options: ValidationMessageOptions): string => {
    return `${options.each ? 'each value in ' : ''}$property must be shorter than or equal to $constraint1 characters`
  },
  minLength: (options: ValidationMessageOptions): string => {
    return `${options.each ? 'each value in ' : ''}$property must be longer than or equal to $constraint1 characters`
  },
  notContains: (options: ValidationMessageOptions): string => {
    return `${options.each ? 'each value in ' : ''}$property should not contain a $constraint1 string`
  },
  isISO4217CurrencyCode: (options: ValidationMessageOptions): string => {
    return `${options.each ? 'each value in ' : ''}$property must be a valid ISO4217 currency code`
  },
  isTaxId: (options: ValidationMessageOptions): string => {
    return `${options.each ? 'each value in ' : ''}$property must be a Tax Identification Number`
  },
  isArray: (options: ValidationMessageOptions): string => {
    return `${options.each ? 'each value in ' : ''}$property must be an array`
  },
  isObject: (options: ValidationMessageOptions): string => {
    return `${options.each ? 'each value in ' : ''}$property must be an object`
  },
  isBoolean: (options: ValidationMessageOptions): string => {
    return `${options.each ? 'each value in ' : ''}$property must be a boolean value`
  },
  isDate: (options: ValidationMessageOptions): string => {
    return `${options.each ? 'each value in ' : ''}$property must be a Date instance`
  },
  isEnum: (options: ValidationMessageOptions): string => {
    return `${options.each ? 'each value in ' : ''}$property must be one of the following values: $constraint2`
  },
  isInt: (options: ValidationMessageOptions): string => {
    return `${options.each ? 'each value in ' : ''}$property must be an integer number`
  },
  isNumber: (options: ValidationMessageOptions): string => {
    return `${options.each ? 'each value in ' : ''}$property must be a number conforming to the specified constraints`
  },
  isString: (options: ValidationMessageOptions): string => {
    return `${options.each ? 'each value in ' : ''}$property must be a string`
  },
}

export type ValidationMessages = typeof defaultValidationMessage

export class ValidationMessage {
  /**
   * 英语
   */
  static en_US: ValidationMessages = defaultValidationMessage

  /**
   * 简体中文
   */
  static zh_CN: ValidationMessages = {
    arrayContains: (options: ValidationMessageOptions): string => {
      return `$property${options.each ? '中的每个值' : ''}必须包含 $constraint1 个值`
    },
    arrayMaxSize: (options: ValidationMessageOptions): string => {
      return `$property${options.each ? '中的每个值' : ''}不得包含超过 $constraint1 个元素`
    },
    arrayMinSize: (options: ValidationMessageOptions): string => {
      return `$property${options.each ? '中的每个值' : ''}必须至少包含 $constraint1 个元素`
    },
    arrayNotContains: (options: ValidationMessageOptions): string => {
      return `$property${options.each ? '中的每个值' : ''}不应包含 $constraint1 个值`
    },
    arrayNotEmpty: (options: ValidationMessageOptions): string => {
      return `$property${options.each ? '中的每个值' : ''}都不应为空`
    },
    arrayUnique: (options: ValidationMessageOptions): string => {
      return `所有$property元素${options.each ? '中的每个值' : ''}都必须唯一`
    },
    equals: (options: ValidationMessageOptions): string => {
      return `$property${options.each ? '中的每个值' : ''}必须等于 $constraint1`
    },
    isDefined: (options: ValidationMessageOptions): string => {
      return `$property${options.each ? '中的每个值' : ''}都不应为 null 或 undefined`
    },
    isEmpty: (options: ValidationMessageOptions): string => {
      return `$property${options.each ? '中的每个值' : ''}必须为空`
    },
    isIn: (options: ValidationMessageOptions): string => {
      return `$property${options.each ? '中的每个值' : ''}必须是以下值之一：$constraint1`
    },
    isLatLong: (options: ValidationMessageOptions): string => {
      return `$property${options.each ? '中的每个值' : ''}必须是纬度或经度字符串`
    },
    isLatitude: (options: ValidationMessageOptions): string => {
      return `$property${options.each ? '中的每个值' : ''}必须是纬度字符串或数字`
    },
    isLongitude: (options: ValidationMessageOptions): string => {
      return `$property${options.each ? '中的每个值' : ''}必须是经度字符串或数字`
    },
    isNotEmpty: (options: ValidationMessageOptions): string => {
      return `$property${options.each ? '中的每个值' : ''}不能为空`
    },
    isNotIn: (options: ValidationMessageOptions): string => {
      return `$property${options.each ? '中的每个值' : ''}都不能是以下值之一：$constraint1`
    },
    notEquals: (options: ValidationMessageOptions): string => {
      return `$property${options.each ? '中的每个值' : ''}都不能等于 $constraint1`
    },
    nestedValidation: (options: ValidationMessageOptions): string => {
      if (options.message) {
        return options.message
      }
      return `嵌套属性$property${options.each ? '中的每个值' : ''}必须是对象或数组`
    },
    maxDate: (options: ValidationMessageOptions): string => {
      return `$property允许的最大日期${options.each ? '中的每个值' : ''}都是 $constraint1`
    },
    minDate: (options: ValidationMessageOptions): string => {
      return `$property允许的最小日期${options.each ? '中的每个值' : ''}都是 $constraint1`
    },
    isDivisibleBy: (options: ValidationMessageOptions): string => {
      return `$property${options.each ? '中的每个值' : ''}都必须能被 $constraint1 整除`
    },
    isNegative: (options: ValidationMessageOptions): string => {
      return `$property${options.each ? '中的每个值' : ''}必须是负数`
    },
    isPositive: (options: ValidationMessageOptions): string => {
      return `$property${options.each ? '中的每个值' : ''}都必须是正数`
    },
    max: (options: ValidationMessageOptions): string => {
      return `$property${options.each ? '中的每个值' : ''}不得大于 $constraint1`
    },
    min: (options: ValidationMessageOptions): string => {
      return `$property${options.each ? '中的每个值' : ''}不得小于 $constraint1`
    },
    isInstance: (options: ValidationMessageOptions): string => {
      if (options.constraints[0]) {
        return `$property${options.each ? '中的每个值' : ''}必须是 ${options.constraints[0].name} 的一个实例`
      }
      else {
        return `isInstance 装饰器${options.each ? '中的每个值' : ''}都期望一个对象作为值，但得到的却是假值。`
      }
    },
    contains: (options: ValidationMessageOptions): string => {
      return `$property${options.each ? '中的每个值' : ''}都必须包含一个 $constraint1 字符串`
    },
    isAlpha: (options: ValidationMessageOptions): string => {
      return `$property${options.each ? '中的每个值' : ''}都必须只能包含字母 (a-zA-Z)`
    },
    isAlphanumeric: (options: ValidationMessageOptions): string => {
      return `$property${options.each ? '中的每个值' : ''}都必须只能包含字母和数字`
    },
    isAscii: (options: ValidationMessageOptions): string => {
      return `$property${options.each ? '中的每个值' : ''}必须仅包含 ASCII 字符`
    },
    isBIC: (options: ValidationMessageOptions): string => {
      return `$property${options.each ? '中的每个值' : ''}必须是 BIC 或 SWIFT 代码`
    },
    isBase32: (options: ValidationMessageOptions): string => {
      return `$property${options.each ? '中的每个值' : ''}必须是 base32 编码`
    },
    isBase58: (options: ValidationMessageOptions): string => {
      return `$property${options.each ? '中的每个值' : ''}必须是 base58 编码`
    },
    isBase64: (options: ValidationMessageOptions): string => {
      return `$property${options.each ? '中的每个值' : ''}必须是 base64 编码`
    },
    isBooleanString: (options: ValidationMessageOptions): string => {
      return `$property${options.each ? '中的每个值' : ''}必须是布尔字符串`
    },
    isBtcAddress: (options: ValidationMessageOptions): string => {
      return `$property${options.each ? '中的每个值' : ''}必须是 BTC 地址`
    },
    isByteLength: (options: ValidationMessageOptions): string => {
      return `$property${options.each ? '中的每个值' : ''}的字节长度必须在 ($constraint1, $constraint2) 范围内`
    },
    isCreditCard: (options: ValidationMessageOptions): string => {
      return `$property${options.each ? '中的每个值' : ''}必须是信用卡`
    },
    isCurrency: (options: ValidationMessageOptions): string => {
      return `$property${options.each ? '中的每个值' : ''}必须是货币`
    },
    isDataURI: (options: ValidationMessageOptions): string => {
      return `$property${options.each ? '中的每个值' : ''}必须是数据 URI 格式`
    },
    isDateString: (options: ValidationMessageOptions): string => {
      return `$property${options.each ? '中的每个值' : ''}必须是有效的 ISO 8601 日期字符串`
    },
    isDecimal: (options: ValidationMessageOptions): string => {
      return `$property${options.each ? '中的每个值' : ''}不是有效的十进制数`
    },
    isEAN: (options: ValidationMessageOptions): string => {
      return `$property${options.each ? '中的每个值' : ''}必须是 EAN（欧洲商品编号）`
    },
    isEmail: (options: ValidationMessageOptions): string => {
      return `$property${options.each ? '中的每个值' : ''}必须是电子邮件`
    },
    isEthereumAddress: (options: ValidationMessageOptions): string => {
      return `$property${options.each ? '中的每个值' : ''}必须是以太坊地址`
    },
    isFQDN: (options: ValidationMessageOptions): string => {
      return `$property${options.each ? '中的每个值' : ''}必须是有效域名`
    },
    IsFirebasePushId: (options: ValidationMessageOptions): string => {
      return `$property${options.each ? '中的每个值' : ''}必须是 Firebase Push ID`
    },
    isFullWidth: (options: ValidationMessageOptions): string => {
      return `$property${options.each ? '中的每个值' : ''}必须包含全角字符`
    },
    isHSL: (options: ValidationMessageOptions): string => {
      return `$property${options.each ? '中的每个值' : ''}必须是 HSL 颜色`
    },
    isHalfWidth: (options: ValidationMessageOptions): string => {
      return `$property${options.each ? '中的每个值' : ''}必须包含半角字符`
    },
    isHash: (options: ValidationMessageOptions): string => {
      return `$property${options.each ? '中的每个值' : ''}必须是 $constraint1 类型的哈希值`
    },
    isHexColor: (options: ValidationMessageOptions): string => {
      return `$property${options.each ? '中的每个值' : ''}必须是十六进制颜色`
    },
    isHexadecimal: (options: ValidationMessageOptions): string => {
      return `$property${options.each ? '中的每个值' : ''}必须是十六进制数`
    },
    isIBAN: (options: ValidationMessageOptions): string => {
      return `$property${options.each ? '中的每个值' : ''}必须是 IBAN`
    },
    isIp: (options: ValidationMessageOptions): string => {
      return `$property${options.each ? '中的每个值' : ''}必须是 IP 地址`
    },
    isISBN: (options: ValidationMessageOptions): string => {
      return `$property${options.each ? '中的每个值' : ''}必须是 ISBN`
    },
    isISIN: (options: ValidationMessageOptions): string => {
      return `$property${options.each ? '中的每个值' : ''}必须是 ISIN`
    },
    isISO31661Alpha2: (options: ValidationMessageOptions): string => {
      return `$property${options.each ? '中的每个值' : ''}必须是有效的 ISO31661 Alpha2 代码`
    },
    isISO31661Alpha3: (options: ValidationMessageOptions): string => {
      return `$property${options.each ? '中的每个值' : ''}必须是有效的 ISO31661 Alpha3 代码`
    },
    isIso8601: (options: ValidationMessageOptions): string => {
      return `$property${options.each ? '中的每个值' : ''}必须是有效的 ISO8601 日期字符串`
    },
    isISRC: (options: ValidationMessageOptions): string => {
      return `$property${options.each ? '中的每个值' : ''}必须是 ISRC`
    },
    isISSN: (options: ValidationMessageOptions): string => {
      return `$property${options.each ? '中的每个值' : ''}必须是 ISSN`
    },
    isIdentityCard: (options: ValidationMessageOptions): string => {
      return `$property${options.each ? '中的每个值' : ''}必须是身份证号码`
    },
    isJson: (options: ValidationMessageOptions): string => {
      return `$property${options.each ? '中的每个值' : ''}必须是有效的 json 字符串`
    },
    isJWT: (options: ValidationMessageOptions): string => {
      return `$property${options.each ? '中的每个值' : ''}必须是 jwt 字符串`
    },
    isLocale: (options: ValidationMessageOptions): string => {
      return `$property${options.each ? '中的每个值' : ''}必须是语言环境`
    },
    isLowercase: (options: ValidationMessageOptions): string => {
      return `$property${options.each ? '中的每个值' : ''}必须是小写字符串`
    },
    isMacAddress: (options: ValidationMessageOptions): string => {
      return `$property${options.each ? '中的每个值' : ''}必须是 MAC 地址`
    },
    isMagnetURI: (options: ValidationMessageOptions): string => {
      return `$property${options.each ? '中的每个值' : ''}必须是磁力链接 URI 格式`
    },
    isMilitaryTime: (options: ValidationMessageOptions): string => {
      return `$property${options.each ? '中的每个值' : ''}必须是有效的军事时间表示形式，格式为 HH:MM`
    },
    isMimeType: (options: ValidationMessageOptions): string => {
      return `$property${options.each ? '中的每个值' : ''}必须是 MIME 类型格式`
    },
    isMobilePhone: (options: ValidationMessageOptions): string => {
      return `$property${options.each ? '中的每个值' : ''}必须是电话号码`
    },
    isMongoId: (options: ValidationMessageOptions): string => {
      return `$property${options.each ? '中的每个值' : ''}必须是有效的 Mongo id`
    },
    isMultibyte: (options: ValidationMessageOptions): string => {
      return `$property${options.each ? '中的每个值' : ''}必须包含一个或多个多字节字符`
    },
    isNumberString: (options: ValidationMessageOptions): string => {
      return `$property${options.each ? '中的每个值' : ''}必须是数字字符串`
    },
    isOctal: (options: ValidationMessageOptions): string => {
      return `$property${options.each ? '中的每个值' : ''}必须是有效的八进制数`
    },
    isPassportNumber: (options: ValidationMessageOptions): string => {
      return `$property${options.each ? '中的每个值' : ''}必须是有效的护照号码`
    },
    isPhoneNumber: (options: ValidationMessageOptions): string => {
      return `$property${options.each ? '中的每个值' : ''}必须是有效的电话号码`
    },
    isPort: (options: ValidationMessageOptions): string => {
      return `$property${options.each ? '中的每个值' : ''}必须是端口`
    },
    isPostalCode: (options: ValidationMessageOptions): string => {
      return `$property${options.each ? '中的每个值' : ''}必须是邮政编码`
    },
    isRFC3339: (options: ValidationMessageOptions): string => {
      return `$property${options.each ? '中的每个值' : ''}必须是有效的 RFC 3339 日期字符串`
    },
    isRgbColor: (options: ValidationMessageOptions): string => {
      return `$property${options.each ? '中的每个值' : ''}必须是 RGB 颜色`
    },
    isSemVer: (options: ValidationMessageOptions): string => {
      return `$property${options.each ? '中的每个值' : ''}必须是语义版本规范`
    },
    isStrongPassword: (options: ValidationMessageOptions): string => {
      return `$property${options.each ? '中的每个值' : ''}不够强大`
    },
    isSurrogatePair: (options: ValidationMessageOptions): string => {
      return `$property${options.each ? '中的每个值' : ''}必须包含任何代理对字符`
    },
    isTimeZone: (options: ValidationMessageOptions): string => {
      return `$property${options.each ? '中的每个值' : ''}必须是有效的 IANA 时区`
    },
    isUuid: (options: ValidationMessageOptions): string => {
      return `$property${options.each ? '中的每个值' : ''}必须是 UUID`
    },
    isUppercase: (options: ValidationMessageOptions): string => {
      return `$property${options.each ? '中的每个值' : ''}必须是大写`
    },
    isUrl: (options: ValidationMessageOptions): string => {
      return `$property${options.each ? '中的每个值' : ''}必须是 URL 地址`
    },
    isVariableWidth: (options: ValidationMessageOptions): string => {
      return `$property${options.each ? '中的每个值' : ''}必须包含全角字符和半角字符`
    },
    isLength: (options: ValidationMessageOptions): string => {
      const isMinLength = options?.constraints[0] !== null && options?.constraints[0] !== undefined
      const isMaxLength = options?.constraints[1] !== null && options?.constraints[1] !== undefined
      if (isMinLength && (!options.value || options.value.length < options?.constraints[0])) {
        return `$property${options.each ? '中的每个值' : ''}必须长于或等于 $constraint1 个字符`
      }
      else if (isMaxLength && options.value.length > options?.constraints[1]) {
        return `$property${options.each ? '中的每个值' : ''}必须短于或等于 $constraint2 个字符`
      }
      return `$property${options.each ? '中的每个值' : ''}必须长于或等于 $constraint1 且短于或等于 $constraint2 个字符`
    },
    matches: (options: ValidationMessageOptions): string => {
      return `$property${options.each ? '中的每个值' : ''}必须符合 $constraint1 正则表达式`
    },
    maxLength: (options: ValidationMessageOptions): string => {
      return `$property${options.each ? '中的每个值' : ''}必须小于或等于 $constraint1 个字符`
    },
    minLength: (options: ValidationMessageOptions): string => {
      return `$property${options.each ? '中的每个值' : ''}必须大于或等于 $constraint1 个字符`
    },
    notContains: (options: ValidationMessageOptions): string => {
      return `$property${options.each ? '中的每个值' : ''}不应包含 $constraint1 字符串`
    },
    isISO4217CurrencyCode: (options: ValidationMessageOptions): string => {
      return `$property${options.each ? '中的每个值' : ''}必须是有效的 ISO4217 货币代码`
    },
    isTaxId: (options: ValidationMessageOptions): string => {
      return `$property${options.each ? '中的每个值' : ''}必须是税务识别号`
    },
    isArray: (options: ValidationMessageOptions): string => {
      return `$property${options.each ? '中的每个值' : ''}必须是数组`
    },
    isObject: (options: ValidationMessageOptions): string => {
      return `$property${options.each ? '中的每个值' : ''}必须是对象`
    },
    isBoolean: (options: ValidationMessageOptions): string => {
      return `$property${options.each ? '中的每个值' : ''}必须是布尔值`
    },
    isDate: (options: ValidationMessageOptions): string => {
      return `$property${options.each ? '中的每个值' : ''}必须是日期实例`
    },
    isEnum: (options: ValidationMessageOptions): string => {
      return `$property${options.each ? '中的每个值' : ''}必须是以下值之一：$constraint2`
    },
    isInt: (options: ValidationMessageOptions): string => {
      return `$property${options.each ? '中的每个值' : ''}必须是整数`
    },
    isNumber: (options: ValidationMessageOptions): string => {
      return `$property${options.each ? '中的每个值' : ''}必须是符合指定条件的数字约束`
    },
    isString: (options: ValidationMessageOptions): string => {
      return `$property${options.each ? '中的每个值' : ''}都必须是字符串`
    },
  }
}
