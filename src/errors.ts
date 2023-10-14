import { EntityId } from "@reduxjs/toolkit"
import { QuestionId, UserId } from "./interfaces"

export class LoginRequiredError extends Error {
  constructor() {
    super("Require authorization")
    this.name = this.constructor.name
  }
}

export class UserNotFoundError extends Error {
  constructor(id?: UserId | EntityId | string | null) {
    super(`user ${id} must exist`)
    this.name = this.constructor.name
  }
}

export class QuestionNotFoundError extends Error {
  constructor(id?: QuestionId | EntityId | string | null) {
    super(`question ${id} must exist`)
    this.name = this.constructor.name
  }
}
