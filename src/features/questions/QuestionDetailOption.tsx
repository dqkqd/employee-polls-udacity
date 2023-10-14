import CheckCircleIcon from "@mui/icons-material/CheckCircle"
import { Button, Card, Stack, Typography } from "@mui/material"

const QuestionDetailOption = (props: {
  text: string
  votes: string[]
  select: () => Promise<void>
  disabled?: boolean
}) => {
  return (
    <Stack alignItems="center" justifyContent="center" sx={{ width: "80%" }}>
      <Card variant="outlined" sx={{ width: "80%" }}>
        <Typography
          align="center"
          display="flex"
          justifyContent="center"
          alignItems="center"
          variant="h6"
          margin="auto"
          fontWeight="bold"
          px={5}
          py={2}
          height={120}
        >
          {props.text}
        </Typography>

        <Button
          fullWidth
          variant="contained"
          size="large"
          sx={{ borderRadius: 0, fontWeight: "bold", fontSize: 20 }}
          startIcon={<CheckCircleIcon />}
          onClick={props.select}
          disabled={props.disabled}
        >
          Vote
        </Button>
      </Card>
    </Stack>
  )
}

export default QuestionDetailOption
