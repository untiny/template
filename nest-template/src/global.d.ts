declare global {
  interface RequestUser {
    id: number
    iat?: number
    exp?: number
  }
  namespace Express {
    interface Request {
      user: RequestUser
    }
  }
}

export {}
