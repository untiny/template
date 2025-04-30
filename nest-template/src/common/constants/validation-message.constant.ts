import { ARRAY_CONTAINS, ARRAY_MAX_SIZE, ARRAY_MIN_SIZE, ARRAY_NOT_CONTAINS, ARRAY_NOT_EMPTY, ARRAY_UNIQUE, CONTAINS, EQUALS, IS_ALPHA, IS_ALPHANUMERIC, IS_ARRAY, IS_ASCII, IS_BASE32, IS_BASE58, IS_BASE64, IS_BIC, IS_BOOLEAN, IS_BOOLEAN_STRING, IS_BTC_ADDRESS, IS_BYTE_LENGTH, IS_CREDIT_CARD, IS_CURRENCY, IS_DATA_URI, IS_DATE, IS_DATE_STRING, IS_DECIMAL, IS_DIVISIBLE_BY, IS_EAN, IS_EMAIL, IS_EMPTY, IS_ENUM, IS_ETHEREUM_ADDRESS, IS_FIREBASE_PUSH_ID, IS_FQDN, IS_FULL_WIDTH, IS_HALF_WIDTH, IS_HASH, IS_HEX_COLOR, IS_HEXADECIMAL, IS_HSL, IS_IBAN, IS_IDENTITY_CARD, IS_IN, IS_INSTANCE, IS_INT, IS_IP, IS_ISBN, IS_ISIN, IS_ISO4217_CURRENCY_CODE, IS_ISO8601, IS_ISO31661_ALPHA_2, IS_ISO31661_ALPHA_3, IS_ISRC, IS_ISSN, IS_JSON, IS_JWT, IS_LATITUDE, IS_LATLONG, IS_LENGTH, IS_LOCALE, IS_LONGITUDE, IS_LOWERCASE, IS_MAC_ADDRESS, IS_MAGNET_URI, IS_MILITARY_TIME, IS_MIME_TYPE, IS_MOBILE_PHONE, IS_MONGO_ID, IS_MULTIBYTE, IS_NEGATIVE, IS_NOT_EMPTY, IS_NOT_IN, IS_NUMBER, IS_NUMBER_STRING, IS_OBJECT, IS_OCTAL, IS_PASSPORT_NUMBER, IS_PHONE_NUMBER, IS_PORT, IS_POSITIVE, IS_POSTAL_CODE, IS_RFC_3339, IS_RGB_COLOR, IS_SEM_VER, IS_STRING, IS_STRONG_PASSWORD, IS_SURROGATE_PAIR, IS_TAX_ID, IS_TIMEZONE, IS_UPPERCASE, IS_URL, IS_UUID, IS_VARIABLE_WIDTH, MATCHES, MAX, MAX_DATE, MAX_LENGTH, MIN, MIN_DATE, MIN_LENGTH, NOT_CONTAINS, NOT_EQUALS, ValidationArguments, ValidationOptions } from 'class-validator'
import { Language } from '../enums/language.enum'

export interface ValidationMessageArguments extends ValidationArguments, Pick<ValidationOptions, 'each'> {
  message?: string
}

export interface BuildMessage {
  (options: ValidationMessageArguments): string
}

export const DefaultValidationMessage = {
  [ARRAY_CONTAINS]: (options: ValidationMessageArguments): string => {
    return `${options.each ? 'each value in ' : ''}$property must contain $constraint1 values`
  },
  [ARRAY_MAX_SIZE]: (options: ValidationMessageArguments): string => {
    return `${options.each ? 'each value in ' : ''}$property must contain no more than $constraint1 elements`
  },
  [ARRAY_MIN_SIZE]: (options: ValidationMessageArguments): string => {
    return `${options.each ? 'each value in ' : ''}$property must contain at least $constraint1 elements`
  },
  [ARRAY_NOT_CONTAINS]: (options: ValidationMessageArguments): string => {
    return `${options.each ? 'each value in ' : ''}$property should not contain $constraint1 values`
  },
  [ARRAY_NOT_EMPTY]: (options: ValidationMessageArguments): string => {
    return `${options.each ? 'each value in ' : ''}$property should not be empty`
  },
  [ARRAY_UNIQUE]: (options: ValidationMessageArguments): string => {
    return `${options.each ? 'each value in ' : ''}All $property's elements must be unique`
  },
  [EQUALS]: (options: ValidationMessageArguments): string => {
    return `${options.each ? 'each value in ' : ''}$property must be equal to $constraint1`
  },
  isDefined: (options: ValidationMessageArguments): string => {
    return `${options.each ? 'each value in ' : ''}$property should not be null or undefined`
  },
  [IS_EMPTY]: (options: ValidationMessageArguments): string => {
    return `${options.each ? 'each value in ' : ''}$property must be empty`
  },
  [IS_IN]: (options: ValidationMessageArguments): string => {
    return `${options.each ? 'each value in ' : ''}$property must be one of the following values: $constraint1`
  },
  [IS_LATLONG]: (options: ValidationMessageArguments): string => {
    return `${options.each ? 'each value in ' : ''}$property must be a latitude,longitude string`
  },
  [IS_LATITUDE]: (options: ValidationMessageArguments): string => {
    return `${options.each ? 'each value in ' : ''}$property must be a latitude string or number`
  },
  [IS_LONGITUDE]: (options: ValidationMessageArguments): string => {
    return `${options.each ? 'each value in ' : ''}$property must be a longitude string or number`
  },
  [IS_NOT_EMPTY]: (options: ValidationMessageArguments): string => {
    return `${options.each ? 'each value in ' : ''}$property should not be empty`
  },
  [IS_NOT_IN]: (options: ValidationMessageArguments): string => {
    return `${options.each ? 'each value in ' : ''}$property should not be one of the following values: $constraint1`
  },
  [NOT_EQUALS]: (options: ValidationMessageArguments): string => {
    return `${options.each ? 'each value in ' : ''}$property should not be equal to $constraint1`
  },
  nestedValidation: (options: ValidationMessageArguments): string => {
    if (options.message) {
      return options.message
    }
    return `${options.each ? 'each value in ' : ''}nested property $property must be either object or array`
  },
  [MAX_DATE]: (options: ValidationMessageArguments): string => {
    return `${options.each ? 'each value in ' : ''}maximal allowed date for $property is $constraint1`
  },
  [MIN_DATE]: (options: ValidationMessageArguments): string => {
    return `${options.each ? 'each value in ' : ''}minimal allowed date for $property is $constraint1`
  },
  [IS_DIVISIBLE_BY]: (options: ValidationMessageArguments): string => {
    return `${options.each ? 'each value in ' : ''}$property must be divisible by $constraint1`
  },
  [IS_NEGATIVE]: (options: ValidationMessageArguments): string => {
    return `${options.each ? 'each value in ' : ''}$property must be a negative number`
  },
  [IS_POSITIVE]: (options: ValidationMessageArguments): string => {
    return `${options.each ? 'each value in ' : ''}$property must be a positive number`
  },
  [MAX]: (options: ValidationMessageArguments): string => {
    return `${options.each ? 'each value in ' : ''}$property must not be greater than $constraint1`
  },
  [MIN]: (options: ValidationMessageArguments): string => {
    return `${options.each ? 'each value in ' : ''}$property must not be less than $constraint1`
  },
  [IS_INSTANCE]: (options: ValidationMessageArguments): string => {
    if (options.constraints[0]) {
      return `${options.each ? 'each value in ' : ''}$property must be an instance of ${options.constraints[0].name}`
    }
    else {
      return `${options.each ? 'each value in ' : ''}isInstance decorator expects and object as value, but got falsy value.`
    }
  },
  [CONTAINS]: (options: ValidationMessageArguments): string => {
    return `${options.each ? 'each value in ' : ''}$property must contain a $constraint1 string`
  },
  [IS_ALPHA]: (options: ValidationMessageArguments): string => {
    return `${options.each ? 'each value in ' : ''}$property must contain only letters (a-zA-Z)`
  },
  [IS_ALPHANUMERIC]: (options: ValidationMessageArguments): string => {
    return `${options.each ? 'each value in ' : ''}$property must contain only letters and numbers`
  },
  [IS_ASCII]: (options: ValidationMessageArguments): string => {
    return `${options.each ? 'each value in ' : ''}$property must contain only ASCII characters`
  },
  [IS_BIC]: (options: ValidationMessageArguments): string => {
    return `${options.each ? 'each value in ' : ''}$property must be a BIC or SWIFT code`
  },
  [IS_BASE32]: (options: ValidationMessageArguments): string => {
    return `${options.each ? 'each value in ' : ''}$property must be base32 encoded`
  },
  [IS_BASE58]: (options: ValidationMessageArguments): string => {
    return `${options.each ? 'each value in ' : ''}$property must be base58 encoded`
  },
  [IS_BASE64]: (options: ValidationMessageArguments): string => {
    return `${options.each ? 'each value in ' : ''}$property must be base64 encoded`
  },
  [IS_BOOLEAN_STRING]: (options: ValidationMessageArguments): string => {
    return `${options.each ? 'each value in ' : ''}$property must be a boolean string`
  },
  [IS_BTC_ADDRESS]: (options: ValidationMessageArguments): string => {
    return `${options.each ? 'each value in ' : ''}$property must be a BTC address`
  },
  [IS_BYTE_LENGTH]: (options: ValidationMessageArguments): string => {
    return `${options.each ? 'each value in ' : ''}$property's byte length must fall into ($constraint1, $constraint2) range`
  },
  [IS_CREDIT_CARD]: (options: ValidationMessageArguments): string => {
    return `${options.each ? 'each value in ' : ''}$property must be a credit card`
  },
  [IS_CURRENCY]: (options: ValidationMessageArguments): string => {
    return `${options.each ? 'each value in ' : ''}$property must be a currency`
  },
  [IS_DATA_URI]: (options: ValidationMessageArguments): string => {
    return `${options.each ? 'each value in ' : ''}$property must be a data uri format`
  },
  [IS_DATE_STRING]: (options: ValidationMessageArguments): string => {
    return `${options.each ? 'each value in ' : ''}$property must be a valid ISO 8601 date string`
  },
  [IS_DECIMAL]: (options: ValidationMessageArguments): string => {
    return `${options.each ? 'each value in ' : ''}$property is not a valid decimal number`
  },
  [IS_EAN]: (options: ValidationMessageArguments): string => {
    return `${options.each ? 'each value in ' : ''}$property must be an EAN (European Article Number)`
  },
  [IS_EMAIL]: (options: ValidationMessageArguments): string => {
    return `${options.each ? 'each value in ' : ''}$property must be an email`
  },
  [IS_ETHEREUM_ADDRESS]: (options: ValidationMessageArguments): string => {
    return `${options.each ? 'each value in ' : ''}$property must be an Ethereum address`
  },
  [IS_FQDN]: (options: ValidationMessageArguments): string => {
    return `${options.each ? 'each value in ' : ''}$property must be a valid domain name`
  },
  [IS_FIREBASE_PUSH_ID]: (options: ValidationMessageArguments): string => {
    return `${options.each ? 'each value in ' : ''}$property must be a Firebase Push Id`
  },
  [IS_FULL_WIDTH]: (options: ValidationMessageArguments): string => {
    return `${options.each ? 'each value in ' : ''}$property must contain a full-width characters`
  },
  [IS_HSL]: (options: ValidationMessageArguments): string => {
    return `${options.each ? 'each value in ' : ''}$property must be a HSL color`
  },
  [IS_HALF_WIDTH]: (options: ValidationMessageArguments): string => {
    return `${options.each ? 'each value in ' : ''}$property must contain a half-width characters`
  },
  [IS_HASH]: (options: ValidationMessageArguments): string => {
    return `${options.each ? 'each value in ' : ''}$property must be a hash of type $constraint1`
  },
  [IS_HEX_COLOR]: (options: ValidationMessageArguments): string => {
    return `${options.each ? 'each value in ' : ''}$property must be a hexadecimal color`
  },
  [IS_HEXADECIMAL]: (options: ValidationMessageArguments): string => {
    return `${options.each ? 'each value in ' : ''}$property must be a hexadecimal number`
  },
  [IS_IBAN]: (options: ValidationMessageArguments): string => {
    return `${options.each ? 'each value in ' : ''}$property must be an IBAN`
  },
  [IS_IP]: (options: ValidationMessageArguments): string => {
    return `${options.each ? 'each value in ' : ''}$property must be an ip address`
  },
  [IS_ISBN]: (options: ValidationMessageArguments): string => {
    return `${options.each ? 'each value in ' : ''}$property must be an ISBN`
  },
  [IS_ISIN]: (options: ValidationMessageArguments): string => {
    return `${options.each ? 'each value in ' : ''}$property must be an ISIN`
  },
  [IS_ISO31661_ALPHA_2]: (options: ValidationMessageArguments): string => {
    return `${options.each ? 'each value in ' : ''}$property must be a valid ISO31661 Alpha2 code`
  },
  [IS_ISO31661_ALPHA_3]: (options: ValidationMessageArguments): string => {
    return `${options.each ? 'each value in ' : ''}$property must be a valid ISO31661 Alpha3 code`
  },
  [IS_ISO8601]: (options: ValidationMessageArguments): string => {
    return `${options.each ? 'each value in ' : ''}$property must be a valid ISO8601 date string`
  },
  [IS_ISRC]: (options: ValidationMessageArguments): string => {
    return `${options.each ? 'each value in ' : ''}$property must be an ISRC`
  },
  [IS_ISSN]: (options: ValidationMessageArguments): string => {
    return `${options.each ? 'each value in ' : ''}$property must be an ISSN`
  },
  [IS_IDENTITY_CARD]: (options: ValidationMessageArguments): string => {
    return `${options.each ? 'each value in ' : ''}$property must be a identity card number`
  },
  [IS_JSON]: (options: ValidationMessageArguments): string => {
    return `${options.each ? 'each value in ' : ''}$property must be a valid json string`
  },
  [IS_JWT]: (options: ValidationMessageArguments): string => {
    return `${options.each ? 'each value in ' : ''}$property must be a jwt string`
  },
  [IS_LOCALE]: (options: ValidationMessageArguments): string => {
    return `${options.each ? 'each value in ' : ''}$property must be a locale`
  },
  [IS_LOWERCASE]: (options: ValidationMessageArguments): string => {
    return `${options.each ? 'each value in ' : ''}$property must be a lowercase string`
  },
  [IS_MAC_ADDRESS]: (options: ValidationMessageArguments): string => {
    return `${options.each ? 'each value in ' : ''}$property must be a MAC address`
  },
  [IS_MAGNET_URI]: (options: ValidationMessageArguments): string => {
    return `${options.each ? 'each value in ' : ''}$property must be magnet uri format`
  },
  [IS_MILITARY_TIME]: (options: ValidationMessageArguments): string => {
    return `${options.each ? 'each value in ' : ''}$property must be a valid representation of military time in the format HH:MM`
  },
  [IS_MIME_TYPE]: (options: ValidationMessageArguments): string => {
    return `${options.each ? 'each value in ' : ''}$property must be MIME type format`
  },
  [IS_MOBILE_PHONE]: (options: ValidationMessageArguments): string => {
    return `${options.each ? 'each value in ' : ''}$property must be a phone number`
  },
  [IS_MONGO_ID]: (options: ValidationMessageArguments): string => {
    return `${options.each ? 'each value in ' : ''}$property must be a valid mongo id`
  },
  [IS_MULTIBYTE]: (options: ValidationMessageArguments): string => {
    return `${options.each ? 'each value in ' : ''}$property must contain one or more multibyte chars`
  },
  [IS_NUMBER_STRING]: (options: ValidationMessageArguments): string => {
    return `${options.each ? 'each value in ' : ''}$property must be a number string`
  },
  [IS_OCTAL]: (options: ValidationMessageArguments): string => {
    return `${options.each ? 'each value in ' : ''}$property must be valid octal number`
  },
  [IS_PASSPORT_NUMBER]: (options: ValidationMessageArguments): string => {
    return `${options.each ? 'each value in ' : ''}$property must be valid passport number`
  },
  [IS_PHONE_NUMBER]: (options: ValidationMessageArguments): string => {
    return `${options.each ? 'each value in ' : ''}$property must be a valid phone number`
  },
  [IS_PORT]: (options: ValidationMessageArguments): string => {
    return `${options.each ? 'each value in ' : ''}$property must be a port`
  },
  [IS_POSTAL_CODE]: (options: ValidationMessageArguments): string => {
    return `${options.each ? 'each value in ' : ''}$property must be a postal code`
  },
  [IS_RFC_3339]: (options: ValidationMessageArguments): string => {
    return `${options.each ? 'each value in ' : ''}$property must be a valid RFC 3339 date string`
  },
  [IS_RGB_COLOR]: (options: ValidationMessageArguments): string => {
    return `${options.each ? 'each value in ' : ''}$property must be RGB color`
  },
  [IS_SEM_VER]: (options: ValidationMessageArguments): string => {
    return `${options.each ? 'each value in ' : ''}$property must be a Semantic Versioning Specification`
  },
  [IS_STRONG_PASSWORD]: (options: ValidationMessageArguments): string => {
    return `${options.each ? 'each value in ' : ''}$property is not strong enough`
  },
  [IS_SURROGATE_PAIR]: (options: ValidationMessageArguments): string => {
    return `${options.each ? 'each value in ' : ''}$property must contain any surrogate pairs chars`
  },
  [IS_TIMEZONE]: (options: ValidationMessageArguments): string => {
    return `${options.each ? 'each value in ' : ''}$property must be a valid IANA time-zone`
  },
  [IS_UUID]: (options: ValidationMessageArguments): string => {
    return `${options.each ? 'each value in ' : ''}$property must be a UUID`
  },
  [IS_UPPERCASE]: (options: ValidationMessageArguments): string => {
    return `${options.each ? 'each value in ' : ''}$property must be uppercase`
  },
  [IS_URL]: (options: ValidationMessageArguments): string => {
    return `${options.each ? 'each value in ' : ''}$property must be a URL address`
  },
  [IS_VARIABLE_WIDTH]: (options: ValidationMessageArguments): string => {
    return `${options.each ? 'each value in ' : ''}$property must contain a full-width and half-width characters`
  },
  [IS_LENGTH]: (options: ValidationMessageArguments): string => {
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
  [MATCHES]: (options: ValidationMessageArguments): string => {
    return `${options.each ? 'each value in ' : ''}$property must match $constraint1 regular expression`
  },
  [MAX_LENGTH]: (options: ValidationMessageArguments): string => {
    return `${options.each ? 'each value in ' : ''}$property must be shorter than or equal to $constraint1 characters`
  },
  [MIN_LENGTH]: (options: ValidationMessageArguments): string => {
    return `${options.each ? 'each value in ' : ''}$property must be longer than or equal to $constraint1 characters`
  },
  [NOT_CONTAINS]: (options: ValidationMessageArguments): string => {
    return `${options.each ? 'each value in ' : ''}$property should not contain a $constraint1 string`
  },
  [IS_ISO4217_CURRENCY_CODE]: (options: ValidationMessageArguments): string => {
    return `${options.each ? 'each value in ' : ''}$property must be a valid ISO4217 currency code`
  },
  [IS_TAX_ID]: (options: ValidationMessageArguments): string => {
    return `${options.each ? 'each value in ' : ''}$property must be a Tax Identification Number`
  },
  [IS_ARRAY]: (options: ValidationMessageArguments): string => {
    return `${options.each ? 'each value in ' : ''}$property must be an array`
  },
  [IS_OBJECT]: (options: ValidationMessageArguments): string => {
    return `${options.each ? 'each value in ' : ''}$property must be an object`
  },
  [IS_BOOLEAN]: (options: ValidationMessageArguments): string => {
    return `${options.each ? 'each value in ' : ''}$property must be a boolean value`
  },
  [IS_DATE]: (options: ValidationMessageArguments): string => {
    return `${options.each ? 'each value in ' : ''}$property must be a Date instance`
  },
  [IS_ENUM]: (options: ValidationMessageArguments): string => {
    return `${options.each ? 'each value in ' : ''}$property must be one of the following values: $constraint2`
  },
  [IS_INT]: (options: ValidationMessageArguments): string => {
    return `${options.each ? 'each value in ' : ''}$property must be an integer number`
  },
  [IS_NUMBER]: (options: ValidationMessageArguments): string => {
    return `${options.each ? 'each value in ' : ''}$property must be a number conforming to the specified constraints`
  },
  [IS_STRING]: (options: ValidationMessageArguments): string => {
    return `${options.each ? 'each value in ' : ''}$property must be a string`
  },
} as const

export type ValidationMessageMap = typeof DefaultValidationMessage

export type ValidationMethod = keyof ValidationMessageMap

export const ValidationMessage: Record<Language, ValidationMessageMap> = {
  /**
   * 英语
   */
  [Language.EN]: DefaultValidationMessage,

  /**
   * 简体中文
   */
  [Language.ZH]: {
    [ARRAY_CONTAINS]: (options: ValidationMessageArguments): string => {
      return `$property${options.each ? '中的每个值' : ''}必须包含 $constraint1 个值`
    },
    [ARRAY_MAX_SIZE]: (options: ValidationMessageArguments): string => {
      return `$property${options.each ? '中的每个值' : ''}不得包含超过 $constraint1 个元素`
    },
    [ARRAY_MIN_SIZE]: (options: ValidationMessageArguments): string => {
      return `$property${options.each ? '中的每个值' : ''}必须至少包含 $constraint1 个元素`
    },
    [ARRAY_NOT_CONTAINS]: (options: ValidationMessageArguments): string => {
      return `$property${options.each ? '中的每个值' : ''}不应包含 $constraint1 个值`
    },
    [ARRAY_NOT_EMPTY]: (options: ValidationMessageArguments): string => {
      return `$property${options.each ? '中的每个值' : ''}都不应为空`
    },
    [ARRAY_UNIQUE]: (options: ValidationMessageArguments): string => {
      return `所有$property元素${options.each ? '中的每个值' : ''}都必须唯一`
    },
    [EQUALS]: (options: ValidationMessageArguments): string => {
      return `$property${options.each ? '中的每个值' : ''}必须等于 $constraint1`
    },
    isDefined: (options: ValidationMessageArguments): string => {
      return `$property${options.each ? '中的每个值' : ''}都不应为 null 或 undefined`
    },
    [IS_EMPTY]: (options: ValidationMessageArguments): string => {
      return `$property${options.each ? '中的每个值' : ''}必须为空`
    },
    [IS_IN]: (options: ValidationMessageArguments): string => {
      return `$property${options.each ? '中的每个值' : ''}必须是以下值之一：$constraint1`
    },
    [IS_LATLONG]: (options: ValidationMessageArguments): string => {
      return `$property${options.each ? '中的每个值' : ''}必须是纬度或经度字符串`
    },
    [IS_LATITUDE]: (options: ValidationMessageArguments): string => {
      return `$property${options.each ? '中的每个值' : ''}必须是纬度字符串或数字`
    },
    [IS_LONGITUDE]: (options: ValidationMessageArguments): string => {
      return `$property${options.each ? '中的每个值' : ''}必须是经度字符串或数字`
    },
    [IS_NOT_EMPTY]: (options: ValidationMessageArguments): string => {
      return `$property${options.each ? '中的每个值' : ''}不能为空`
    },
    [IS_NOT_IN]: (options: ValidationMessageArguments): string => {
      return `$property${options.each ? '中的每个值' : ''}都不能是以下值之一：$constraint1`
    },
    [NOT_EQUALS]: (options: ValidationMessageArguments): string => {
      return `$property${options.each ? '中的每个值' : ''}都不能等于 $constraint1`
    },
    nestedValidation: (options: ValidationMessageArguments): string => {
      if (options.message) {
        return options.message
      }
      return `嵌套属性$property${options.each ? '中的每个值' : ''}必须是对象或数组`
    },
    [MAX_DATE]: (options: ValidationMessageArguments): string => {
      return `$property允许的最大日期${options.each ? '中的每个值' : ''}都是 $constraint1`
    },
    [MIN_DATE]: (options: ValidationMessageArguments): string => {
      return `$property允许的最小日期${options.each ? '中的每个值' : ''}都是 $constraint1`
    },
    [IS_DIVISIBLE_BY]: (options: ValidationMessageArguments): string => {
      return `$property${options.each ? '中的每个值' : ''}都必须能被 $constraint1 整除`
    },
    [IS_NEGATIVE]: (options: ValidationMessageArguments): string => {
      return `$property${options.each ? '中的每个值' : ''}必须是负数`
    },
    [IS_POSITIVE]: (options: ValidationMessageArguments): string => {
      return `$property${options.each ? '中的每个值' : ''}都必须是正数`
    },
    [MAX]: (options: ValidationMessageArguments): string => {
      return `$property${options.each ? '中的每个值' : ''}不得大于 $constraint1`
    },
    [MIN]: (options: ValidationMessageArguments): string => {
      return `$property${options.each ? '中的每个值' : ''}不得小于 $constraint1`
    },
    [IS_INSTANCE]: (options: ValidationMessageArguments): string => {
      if (options.constraints[0]) {
        return `$property${options.each ? '中的每个值' : ''}必须是 ${options.constraints[0].name} 的一个实例`
      }
      else {
        return `isInstance 装饰器${options.each ? '中的每个值' : ''}都期望一个对象作为值，但得到的却是假值。`
      }
    },
    [CONTAINS]: (options: ValidationMessageArguments): string => {
      return `$property${options.each ? '中的每个值' : ''}都必须包含一个 $constraint1 字符串`
    },
    [IS_ALPHA]: (options: ValidationMessageArguments): string => {
      return `$property${options.each ? '中的每个值' : ''}都必须只能包含字母 (a-zA-Z)`
    },
    [IS_ALPHANUMERIC]: (options: ValidationMessageArguments): string => {
      return `$property${options.each ? '中的每个值' : ''}都必须只能包含字母和数字`
    },
    [IS_ASCII]: (options: ValidationMessageArguments): string => {
      return `$property${options.each ? '中的每个值' : ''}必须仅包含 ASCII 字符`
    },
    [IS_BIC]: (options: ValidationMessageArguments): string => {
      return `$property${options.each ? '中的每个值' : ''}必须是 BIC 或 SWIFT 代码`
    },
    [IS_BASE32]: (options: ValidationMessageArguments): string => {
      return `$property${options.each ? '中的每个值' : ''}必须是 base32 编码`
    },
    [IS_BASE58]: (options: ValidationMessageArguments): string => {
      return `$property${options.each ? '中的每个值' : ''}必须是 base58 编码`
    },
    [IS_BASE64]: (options: ValidationMessageArguments): string => {
      return `$property${options.each ? '中的每个值' : ''}必须是 base64 编码`
    },
    [IS_BOOLEAN_STRING]: (options: ValidationMessageArguments): string => {
      return `$property${options.each ? '中的每个值' : ''}必须是布尔字符串`
    },
    [IS_BTC_ADDRESS]: (options: ValidationMessageArguments): string => {
      return `$property${options.each ? '中的每个值' : ''}必须是 BTC 地址`
    },
    [IS_BYTE_LENGTH]: (options: ValidationMessageArguments): string => {
      return `$property${options.each ? '中的每个值' : ''}的字节长度必须在 ($constraint1, $constraint2) 范围内`
    },
    [IS_CREDIT_CARD]: (options: ValidationMessageArguments): string => {
      return `$property${options.each ? '中的每个值' : ''}必须是信用卡`
    },
    [IS_CURRENCY]: (options: ValidationMessageArguments): string => {
      return `$property${options.each ? '中的每个值' : ''}必须是货币`
    },
    [IS_DATA_URI]: (options: ValidationMessageArguments): string => {
      return `$property${options.each ? '中的每个值' : ''}必须是数据 URI 格式`
    },
    [IS_DATE_STRING]: (options: ValidationMessageArguments): string => {
      return `$property${options.each ? '中的每个值' : ''}必须是有效的 ISO 8601 日期字符串`
    },
    [IS_DECIMAL]: (options: ValidationMessageArguments): string => {
      return `$property${options.each ? '中的每个值' : ''}不是有效的十进制数`
    },
    [IS_EAN]: (options: ValidationMessageArguments): string => {
      return `$property${options.each ? '中的每个值' : ''}必须是 EAN（欧洲商品编号）`
    },
    [IS_EMAIL]: (options: ValidationMessageArguments): string => {
      return `$property${options.each ? '中的每个值' : ''}必须是电子邮件`
    },
    [IS_ETHEREUM_ADDRESS]: (options: ValidationMessageArguments): string => {
      return `$property${options.each ? '中的每个值' : ''}必须是以太坊地址`
    },
    [IS_FQDN]: (options: ValidationMessageArguments): string => {
      return `$property${options.each ? '中的每个值' : ''}必须是有效域名`
    },
    [IS_FIREBASE_PUSH_ID]: (options: ValidationMessageArguments): string => {
      return `$property${options.each ? '中的每个值' : ''}必须是 Firebase Push ID`
    },
    [IS_FULL_WIDTH]: (options: ValidationMessageArguments): string => {
      return `$property${options.each ? '中的每个值' : ''}必须包含全角字符`
    },
    [IS_HSL]: (options: ValidationMessageArguments): string => {
      return `$property${options.each ? '中的每个值' : ''}必须是 HSL 颜色`
    },
    [IS_HALF_WIDTH]: (options: ValidationMessageArguments): string => {
      return `$property${options.each ? '中的每个值' : ''}必须包含半角字符`
    },
    [IS_HASH]: (options: ValidationMessageArguments): string => {
      return `$property${options.each ? '中的每个值' : ''}必须是 $constraint1 类型的哈希值`
    },
    [IS_HEX_COLOR]: (options: ValidationMessageArguments): string => {
      return `$property${options.each ? '中的每个值' : ''}必须是十六进制颜色`
    },
    [IS_HEXADECIMAL]: (options: ValidationMessageArguments): string => {
      return `$property${options.each ? '中的每个值' : ''}必须是十六进制数`
    },
    [IS_IBAN]: (options: ValidationMessageArguments): string => {
      return `$property${options.each ? '中的每个值' : ''}必须是 IBAN`
    },
    [IS_IP]: (options: ValidationMessageArguments): string => {
      return `$property${options.each ? '中的每个值' : ''}必须是 IP 地址`
    },
    [IS_ISBN]: (options: ValidationMessageArguments): string => {
      return `$property${options.each ? '中的每个值' : ''}必须是 ISBN`
    },
    [IS_ISIN]: (options: ValidationMessageArguments): string => {
      return `$property${options.each ? '中的每个值' : ''}必须是 ISIN`
    },
    [IS_ISO31661_ALPHA_2]: (options: ValidationMessageArguments): string => {
      return `$property${options.each ? '中的每个值' : ''}必须是有效的 ISO31661 Alpha2 代码`
    },
    [IS_ISO31661_ALPHA_3]: (options: ValidationMessageArguments): string => {
      return `$property${options.each ? '中的每个值' : ''}必须是有效的 ISO31661 Alpha3 代码`
    },
    [IS_ISO8601]: (options: ValidationMessageArguments): string => {
      return `$property${options.each ? '中的每个值' : ''}必须是有效的 ISO8601 日期字符串`
    },
    [IS_ISRC]: (options: ValidationMessageArguments): string => {
      return `$property${options.each ? '中的每个值' : ''}必须是 ISRC`
    },
    [IS_ISSN]: (options: ValidationMessageArguments): string => {
      return `$property${options.each ? '中的每个值' : ''}必须是 ISSN`
    },
    [IS_IDENTITY_CARD]: (options: ValidationMessageArguments): string => {
      return `$property${options.each ? '中的每个值' : ''}必须是身份证号码`
    },
    [IS_JSON]: (options: ValidationMessageArguments): string => {
      return `$property${options.each ? '中的每个值' : ''}必须是有效的 json 字符串`
    },
    [IS_JWT]: (options: ValidationMessageArguments): string => {
      return `$property${options.each ? '中的每个值' : ''}必须是 jwt 字符串`
    },
    [IS_LOCALE]: (options: ValidationMessageArguments): string => {
      return `$property${options.each ? '中的每个值' : ''}必须是语言环境`
    },
    [IS_LOWERCASE]: (options: ValidationMessageArguments): string => {
      return `$property${options.each ? '中的每个值' : ''}必须是小写字符串`
    },
    [IS_MAC_ADDRESS]: (options: ValidationMessageArguments): string => {
      return `$property${options.each ? '中的每个值' : ''}必须是 MAC 地址`
    },
    [IS_MAGNET_URI]: (options: ValidationMessageArguments): string => {
      return `$property${options.each ? '中的每个值' : ''}必须是磁力链接 URI 格式`
    },
    [IS_MILITARY_TIME]: (options: ValidationMessageArguments): string => {
      return `$property${options.each ? '中的每个值' : ''}必须是有效的军事时间表示形式，格式为 HH:MM`
    },
    [IS_MIME_TYPE]: (options: ValidationMessageArguments): string => {
      return `$property${options.each ? '中的每个值' : ''}必须是 MIME 类型格式`
    },
    [IS_MOBILE_PHONE]: (options: ValidationMessageArguments): string => {
      return `$property${options.each ? '中的每个值' : ''}必须是电话号码`
    },
    [IS_MONGO_ID]: (options: ValidationMessageArguments): string => {
      return `$property${options.each ? '中的每个值' : ''}必须是有效的 Mongo id`
    },
    [IS_MULTIBYTE]: (options: ValidationMessageArguments): string => {
      return `$property${options.each ? '中的每个值' : ''}必须包含一个或多个多字节字符`
    },
    [IS_NUMBER_STRING]: (options: ValidationMessageArguments): string => {
      return `$property${options.each ? '中的每个值' : ''}必须是数字字符串`
    },
    [IS_OCTAL]: (options: ValidationMessageArguments): string => {
      return `$property${options.each ? '中的每个值' : ''}必须是有效的八进制数`
    },
    [IS_PASSPORT_NUMBER]: (options: ValidationMessageArguments): string => {
      return `$property${options.each ? '中的每个值' : ''}必须是有效的护照号码`
    },
    [IS_PHONE_NUMBER]: (options: ValidationMessageArguments): string => {
      return `$property${options.each ? '中的每个值' : ''}必须是有效的电话号码`
    },
    [IS_PORT]: (options: ValidationMessageArguments): string => {
      return `$property${options.each ? '中的每个值' : ''}必须是端口`
    },
    [IS_POSTAL_CODE]: (options: ValidationMessageArguments): string => {
      return `$property${options.each ? '中的每个值' : ''}必须是邮政编码`
    },
    [IS_RFC_3339]: (options: ValidationMessageArguments): string => {
      return `$property${options.each ? '中的每个值' : ''}必须是有效的 RFC 3339 日期字符串`
    },
    [IS_RGB_COLOR]: (options: ValidationMessageArguments): string => {
      return `$property${options.each ? '中的每个值' : ''}必须是 RGB 颜色`
    },
    [IS_SEM_VER]: (options: ValidationMessageArguments): string => {
      return `$property${options.each ? '中的每个值' : ''}必须是语义版本规范`
    },
    [IS_STRONG_PASSWORD]: (options: ValidationMessageArguments): string => {
      return `$property${options.each ? '中的每个值' : ''}不够强大`
    },
    [IS_SURROGATE_PAIR]: (options: ValidationMessageArguments): string => {
      return `$property${options.each ? '中的每个值' : ''}必须包含任何代理对字符`
    },
    [IS_TIMEZONE]: (options: ValidationMessageArguments): string => {
      return `$property${options.each ? '中的每个值' : ''}必须是有效的 IANA 时区`
    },
    [IS_UUID]: (options: ValidationMessageArguments): string => {
      return `$property${options.each ? '中的每个值' : ''}必须是 UUID`
    },
    [IS_UPPERCASE]: (options: ValidationMessageArguments): string => {
      return `$property${options.each ? '中的每个值' : ''}必须是大写`
    },
    [IS_URL]: (options: ValidationMessageArguments): string => {
      return `$property${options.each ? '中的每个值' : ''}必须是 URL 地址`
    },
    [IS_VARIABLE_WIDTH]: (options: ValidationMessageArguments): string => {
      return `$property${options.each ? '中的每个值' : ''}必须包含全角字符和半角字符`
    },
    [IS_LENGTH]: (options: ValidationMessageArguments): string => {
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
    [MATCHES]: (options: ValidationMessageArguments): string => {
      return `$property${options.each ? '中的每个值' : ''}必须符合 $constraint1 正则表达式`
    },
    [MAX_LENGTH]: (options: ValidationMessageArguments): string => {
      return `$property${options.each ? '中的每个值' : ''}必须小于或等于 $constraint1 个字符`
    },
    [MIN_LENGTH]: (options: ValidationMessageArguments): string => {
      return `$property${options.each ? '中的每个值' : ''}必须大于或等于 $constraint1 个字符`
    },
    [NOT_CONTAINS]: (options: ValidationMessageArguments): string => {
      return `$property${options.each ? '中的每个值' : ''}不应包含 $constraint1 字符串`
    },
    [IS_ISO4217_CURRENCY_CODE]: (options: ValidationMessageArguments): string => {
      return `$property${options.each ? '中的每个值' : ''}必须是有效的 ISO4217 货币代码`
    },
    [IS_TAX_ID]: (options: ValidationMessageArguments): string => {
      return `$property${options.each ? '中的每个值' : ''}必须是税务识别号`
    },
    [IS_ARRAY]: (options: ValidationMessageArguments): string => {
      return `$property${options.each ? '中的每个值' : ''}必须是数组`
    },
    [IS_OBJECT]: (options: ValidationMessageArguments): string => {
      return `$property${options.each ? '中的每个值' : ''}必须是对象`
    },
    [IS_BOOLEAN]: (options: ValidationMessageArguments): string => {
      return `$property${options.each ? '中的每个值' : ''}必须是布尔值`
    },
    [IS_DATE]: (options: ValidationMessageArguments): string => {
      return `$property${options.each ? '中的每个值' : ''}必须是日期实例`
    },
    [IS_ENUM]: (options: ValidationMessageArguments): string => {
      return `$property${options.each ? '中的每个值' : ''}必须是以下值之一：$constraint2`
    },
    [IS_INT]: (options: ValidationMessageArguments): string => {
      return `$property${options.each ? '中的每个值' : ''}必须是整数`
    },
    [IS_NUMBER]: (options: ValidationMessageArguments): string => {
      return `$property${options.each ? '中的每个值' : ''}必须是符合指定条件的数字约束`
    },
    [IS_STRING]: (options: ValidationMessageArguments): string => {
      return `$property${options.each ? '中的每个值' : ''}都必须是字符串`
    },
  },
} as const

export function getValidationBuildMessage(language: Language, methodName: ValidationMethod): BuildMessage {
  const map = ValidationMessage[language] ?? DefaultValidationMessage
  return map[methodName] ?? DefaultValidationMessage[methodName]
}
