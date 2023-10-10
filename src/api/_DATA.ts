import type {
  AnswerId,
  Question,
  QuestionId,
  QuestionsDictionary,
  User,
  UserId,
  UsersDictionary,
} from "../interfaces"

let users: UsersDictionary = {
  sarahedo: {
    id: "sarahedo",
    password: "password123",
    name: "Sarah Edo",
    avatarURL: null,
    answers: {
      "8xf0y6ziyjabvozdd253nd": "optionOne",
      "6ni6ok3ym7mf1p33lnez": "optionOne",
      am8ehyc8byjqgar0jgpub9: "optionTwo",
      loxhs1bqm25b708cmbf3g: "optionTwo",
    },
    questions: ["8xf0y6ziyjabvozdd253nd", "am8ehyc8byjqgar0jgpub9"],
  },
  tylermcginnis: {
    id: "tylermcginnis",
    password: "abc321",
    name: "Tyler McGinnis",
    avatarURL: null,
    answers: {
      vthrdm985a262al8qx3do: "optionOne",
      xj352vofupe1dqz9emx13r: "optionTwo",
    },
    questions: ["loxhs1bqm25b708cmbf3g", "vthrdm985a262al8qx3do"],
  },
  mtsamis: {
    id: "mtsamis",
    password: "xyz123",
    name: "Mike Tsamis",
    avatarURL: null,
    answers: {
      xj352vofupe1dqz9emx13r: "optionOne",
      vthrdm985a262al8qx3do: "optionTwo",
      "6ni6ok3ym7mf1p33lnez": "optionOne",
    },
    questions: ["6ni6ok3ym7mf1p33lnez", "xj352vofupe1dqz9emx13r"],
  },
  zoshikanlu: {
    id: "zoshikanlu",
    password: "pass246",
    name: "Zenobia Oshikanlu",
    avatarURL: null,
    answers: {
      xj352vofupe1dqz9emx13r: "optionOne",
    },
    questions: [],
  },
}

let questions: QuestionsDictionary = {
  "8xf0y6ziyjabvozdd253nd": {
    id: "8xf0y6ziyjabvozdd253nd",
    author: "sarahedo",
    timestamp: 1467166872634,
    optionOne: {
      votes: ["sarahedo"],
      text: "Build our new application with Javascript",
    },
    optionTwo: {
      votes: [],
      text: "Build our new application with Typescript",
    },
  },
  "6ni6ok3ym7mf1p33lnez": {
    id: "6ni6ok3ym7mf1p33lnez",
    author: "mtsamis",
    timestamp: 1468479767190,
    optionOne: {
      votes: [],
      text: "hire more frontend developers",
    },
    optionTwo: {
      votes: ["mtsamis", "sarahedo"],
      text: "hire more backend developers",
    },
  },
  am8ehyc8byjqgar0jgpub9: {
    id: "am8ehyc8byjqgar0jgpub9",
    author: "sarahedo",
    timestamp: 1488579767190,
    optionOne: {
      votes: [],
      text: "conduct a release retrospective 1 week after a release",
    },
    optionTwo: {
      votes: ["sarahedo"],
      text: "conduct release retrospectives quarterly",
    },
  },
  loxhs1bqm25b708cmbf3g: {
    id: "loxhs1bqm25b708cmbf3g",
    author: "tylermcginnis",
    timestamp: 1482579767190,
    optionOne: {
      votes: [],
      text: "have code reviews conducted by peers",
    },
    optionTwo: {
      votes: ["sarahedo"],
      text: "have code reviews conducted by managers",
    },
  },
  vthrdm985a262al8qx3do: {
    id: "vthrdm985a262al8qx3do",
    author: "tylermcginnis",
    timestamp: 1489579767190,
    optionOne: {
      votes: ["tylermcginnis"],
      text: "take a course on ReactJS",
    },
    optionTwo: {
      votes: ["mtsamis"],
      text: "take a course on unit testing with Jest",
    },
  },
  xj352vofupe1dqz9emx13r: {
    id: "xj352vofupe1dqz9emx13r",
    author: "mtsamis",
    timestamp: 1493579767190,
    optionOne: {
      votes: ["mtsamis", "zoshikanlu"],
      text: "deploy to production once every two weeks",
    },
    optionTwo: {
      votes: ["tylermcginnis"],
      text: "deploy to production once every month",
    },
  },
}

function generateUID() {
  return (
    Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15)
  )
}

export function _getUsers() {
  return new Promise<UsersDictionary>((resolve) => {
    setTimeout(() => resolve({ ...users }), 1000)
  })
}

export function _saveUser(user: {
  id: string
  password: string
  name: string
  avatarURL?: string
}) {
  return new Promise<User>((resolve, reject) => {
    const { id, password, name, avatarURL } = user
    if (!id || !name || !password) {
      reject("Please provide id, name, password")
    } else if (Object.hasOwn(users, id)) {
      reject("User already existed")
    } else {
      const formattedUser = {
        ...user,
        avatarURL: avatarURL ?? null,
        answers: {},
        questions: [],
      }

      setTimeout(() => {
        users = {
          ...users,
          [id]: formattedUser,
        }

        resolve(formattedUser)
      }, 50)
    }
  })
}

export function _getQuestions() {
  return new Promise<QuestionsDictionary>((resolve) => {
    setTimeout(() => resolve({ ...questions }), 1000)
  })
}

function formatQuestion(question: {
  optionOneText: string
  optionTwoText: string
  author: UserId
}): Question {
  return {
    id: generateUID(),
    author: question.author,
    timestamp: Date.now(),
    optionOne: {
      votes: [],
      text: question.optionOneText,
    },
    optionTwo: {
      votes: [],
      text: question.optionTwoText,
    },
  }
}

export function _saveQuestion(question: {
  optionOneText?: string | null
  optionTwoText?: string | null
  author?: UserId | null
}) {
  return new Promise<Question>((resolve, reject) => {
    const { optionOneText, optionTwoText, author } = question
    if (!optionOneText || !optionTwoText || !author) {
      reject("Please provide optionOneText, optionTwoText, and author")
    } else if (optionOneText === optionTwoText) {
      reject("Options must be different")
    } else if (!Object.hasOwn(users, author)) {
      reject(`User id '${author}' does not exist`)
    } else {
      const formattedQuestion = formatQuestion({
        optionOneText,
        optionTwoText,
        author,
      })
      setTimeout(() => {
        questions = {
          ...questions,
          [formattedQuestion.id]: formattedQuestion,
        }

        resolve(formattedQuestion)
      }, 1000)
    }
  })
}

export function _saveQuestionAnswer(answer: {
  authedUser?: UserId | null
  qid?: QuestionId | null
  answerId?: AnswerId | null
}) {
  return new Promise<boolean>((resolve, reject) => {
    const { authedUser, qid, answerId } = answer

    if (!authedUser || !qid || !answerId) {
      reject("Please provide authedUser, qid, and answer")
    } else if (!Object.hasOwn(users, authedUser)) {
      reject(`User id '${authedUser}' does not exist`)
    } else if (!Object.hasOwn(questions, qid)) {
      reject(`Question id '${qid}' does not exist`)
    } else if (!["optionOne", "optionTwo"].includes(answerId)) {
      reject(`Answer should be 'optionOne' or 'optionTwo', not '${answerId}'`)
    } else {
      setTimeout(() => {
        users = {
          ...users,
          [authedUser]: {
            ...users[authedUser],
            answers: {
              ...users[authedUser].answers,
              [qid]: answerId,
            },
          },
        }

        questions = {
          ...questions,
          [qid]: {
            ...questions[qid],
            [answerId]: {
              ...questions[qid][answerId],
              votes: questions[qid][answerId].votes.concat([authedUser]),
            },
          },
        }

        resolve(true)
      }, 500)
    }
  })
}
