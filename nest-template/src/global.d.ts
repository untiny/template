declare global {
  interface RequestUser {
    id: number
  }
  namespace Express {
    interface Request {
      user: RequestUser
    }
  }
}

export {}
