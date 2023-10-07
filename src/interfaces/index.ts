export type UserId = string;
export type QuestionId = string;
export type AnswerId = "optionOne" | "optionTwo";

export interface Question {
  id: QuestionId;
  author: UserId;
  timestamp: number;

  optionOne: {
    votes: UserId[];
    text: string;
  };

  optionTwo: {
    votes: UserId[];
    text: string;
  };
}

export interface QuestionsDictionary {
  [id: QuestionId]: Question;
}

export interface User {
  id: UserId;
  name: string;
  password: string;
  avatarURL: null;
  questions: QuestionId[];
  answers: {
    [id: QuestionId]: AnswerId;
  };
}

export interface UsersDictionary {
  [id: UserId]: User;
}
