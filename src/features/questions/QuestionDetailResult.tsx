import { Typography } from "@mui/material"
import { AnswerId } from "../../interfaces"
import QuestionDetailResultOption from "./QuestionDetailResultOption"

const QuestionDetailResult = (props: {
  optionOneText: string
  optionTwoText: string
  optionOneTotalVotes: number
  optionTwoTotalVotes: number
  votedOption: AnswerId
}) => {
  const totalVotes = props.optionOneTotalVotes + props.optionTwoTotalVotes
  return (
    <>
      <Typography variant="h4" fontWeight="bold" m={3}>
        Poll result
      </Typography>
      <QuestionDetailResultOption
        text={props.optionOneText}
        numberOfVotes={props.optionOneTotalVotes}
        totalVotes={totalVotes}
        voted={props.votedOption === "optionOne"}
      />
      <QuestionDetailResultOption
        text={props.optionTwoText}
        numberOfVotes={props.optionTwoTotalVotes}
        totalVotes={totalVotes}
        voted={props.votedOption === "optionTwo"}
      />
    </>
  )
}

export default QuestionDetailResult
