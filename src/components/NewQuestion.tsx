import { Box, Stack, Typography } from "@mui/material"
import QuestionNewForm from "../features/questions/QuestionNewForm"

const NewQuestion = () => {
  return (
    <Box display="flex" justifyContent="center" alignItems="center" mt={5}>
      <Stack spacing={3} width={500}>
        <Typography variant="h4" textAlign="center" fontWeight="bold">
          Would you rather
        </Typography>

        <Typography
          variant="h6"
          textAlign="center"
          fontWeight="bold"
          color="#888"
        >
          Create your own poll
        </Typography>

        <QuestionNewForm />
      </Stack>
    </Box>
  )
}

export default NewQuestion
