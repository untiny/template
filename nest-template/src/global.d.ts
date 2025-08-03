declare global {
  interface RequestUser {
    id: string
    iat?: number
    exp?: number
  }

  /** 语言设定 */
  type Language = 'zh' | 'en'
}

declare module 'nestjs-cls' {
  interface ClsStore {
    /** 客户端语言 */
    language: Language
    timezone: string
  }
}

declare module 'express' {
  interface Request {
    user: RequestUser
  }
}

export {}
