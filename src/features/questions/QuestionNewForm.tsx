import {
  Button,
  CircularProgress,
  FormControl,
  TextField,
  Typography,
} from "@mui/material"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAppDispatch, useAuth } from "../../app/hook"
import { createNewQuestion } from "../common"

const QuestionNewForm = () => {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  const auth = useAuth()

  const [optionOneText, setOptionOneText] = useState("")
  const [optionTwoText, setOptionTwoText] = useState("")

  const [addStatus, setAddStatus] = useState<
    "idle" | "loading" | "succeeded" | "failed"
  >("idle")

  const loading = addStatus === "loading"
  const buttonEnabled = Boolean(
    !loading &&
      optionOneText &&
      optionTwoText &&
      optionOneText !== optionTwoText,
  )

  const sameOptionsErrorMassage =
    optionOneText && optionTwoText && optionOneText === optionTwoText
      ? "Two options should be different"
      : ""

  const [submitErrorMessage, setSubmitErrorMessage] = useState("")

  const handleAddQuestion = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    setAddStatus("loading")
    const response = await dispatch(
      createNewQuestion({
        optionOneText,
        optionTwoText,
        author: auth.id as string,
      }),
    ).unwrap()
    if (response.ok && response.qid) {
      navigate(`/questions/${response.qid}`)
    } else {
      setSubmitErrorMessage(response.error ?? "")
    }
  }

  return (
    <>
      <FormControl>
        <TextField
          value={optionOneText}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setOptionOneText(e.target.value.trim())
          }
          label="First option"
          disabled={loading}
        />
      </FormControl>

      <FormControl>
        <TextField
          value={optionTwoText}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setOptionTwoText(e.target.value.trim())
          }
          label="Second option"
          disabled={loading}
        />
      </FormControl>

      <Button
        type="submit"
        variant="contained"
        onClick={handleAddQuestion}
        disabled={!buttonEnabled}
      >
        {loading ? (
          <CircularProgress data-testid="add-question-loading" />
        ) : (
          "Submit"
        )}
      </Button>

      {(sameOptionsErrorMassage || submitErrorMessage) && (
        <Typography fontSize={13} color="red">
          {sameOptionsErrorMassage || submitErrorMessage}
        </Typography>
      )}
    </>
  )
}

export default QuestionNewForm
