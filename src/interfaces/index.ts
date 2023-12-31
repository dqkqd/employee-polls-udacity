export type UserId = string
export type QuestionId = string
export type AnswerId = "optionOne" | "optionTwo"

export interface Question {
  id: QuestionId
  author: UserId
  timestamp: number

  optionOne: {
    votes: UserId[]
    text: string
  }

  optionTwo: {
    votes: UserId[]
    text: string
  }
}

export interface QuestionsDictionary {
  [id: QuestionId]: Question
}

export interface User {
  id: UserId
  name: string
  password: string
  avatarURL: string | null
  questions: QuestionId[]
  answers: {
    [id: QuestionId]: AnswerId
  }
}

export interface UsersDictionary {
  [id: UserId]: User
}

export interface AuthedUser {
  id: string | null
  name: string | null
  avatarURL: string | null
  password: string | null
  status: "idle" | "success" | "loading" | "failed"
}

export interface PublicUser {
  id: string
  name: string
  avatarURL: string | null
}
