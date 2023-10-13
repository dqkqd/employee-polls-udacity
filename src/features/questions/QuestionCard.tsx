import {
  Button,
  Card,
  CardActions,
  CardContent,
  Stack,
  Typography,
} from "@mui/material"

import DoubleArrowIcon from "@mui/icons-material/DoubleArrow"

import { EntityId } from "@reduxjs/toolkit"
import { useNavigate } from "react-router-dom"
import { useAppSelector } from "../../app/hook"
import { selectQuestionById } from "./questionsSlice"

const QuestionCard = (props: { id: EntityId }) => {
  const navigate = useNavigate()

  const question = useAppSelector((state) =>
    selectQuestionById(state, props.id),
  )
  if (!question) {
    throw new Error("Handle question undefined")
  }

  const createdDate = new Date(question.timestamp).toUTCString()

  const handleShowClick = () => {
    navigate(`/questions/${props.id}`)
  }

  return (
    <>
      <Card elevation={3} sx={{ width: 300, margin: 5 }}>
        <Stack alignItems="center" textAlign="center">
          <CardContent>
            <Typography gutterBottom variant="h5" fontWeight="bold">
              {question.author}
            </Typography>
            <Typography
              variant="body1"
              color="gray"
              aria-label="question-created-date"
            >
              {createdDate}
            </Typography>
          </CardContent>
          <CardActions>
            <Button size="large" variant="contained" onClick={handleShowClick}>
              Show <DoubleArrowIcon />
            </Button>
          </CardActions>
        </Stack>
      </Card>
    </>
  )
}

export default QuestionCard
