import CheckCircleIcon from "@mui/icons-material/CheckCircle"
import { Grid, LinearProgress, Paper, Stack, Typography } from "@mui/material"

const QuestionDetailResultOption = (props: {
  text: string
  numberOfVotes: number
  totalVotes: number
  voted: boolean
}) => {
  const percentage = (props.numberOfVotes / props.totalVotes) * 100

  return (
    <Stack sx={{ width: "70%" }} p={5} data-testid="detail-result-option">
      <Paper
        elevation={10}
        sx={{
          padding: 2,
          boxShadow: props.voted ? "2px 2px 30px #40a02b" : "",
          opacity: props.voted ? 1.0 : 0.6,
        }}
      >
        <Grid container alignItems="center" pb={4}>
          <Grid item xs={10} sx={{ height: 30 }}>
            <Typography
              variant="h6"
              fontWeight="bold"
              mr={2}
              alignItems="center"
              justifyContent="center"
            >
              {props.text}
            </Typography>
          </Grid>
          <Grid item xs={2} textAlign="center">
            {props.voted && (
              <CheckCircleIcon
                color="success"
                fontSize="large"
                data-testid="voted-icon"
              />
            )}
          </Grid>
        </Grid>

        <Grid container alignItems="center">
          <Grid item xs={10} sx={{ height: 30 }}>
            <LinearProgress
              variant="determinate"
              color={props.voted ? "success" : "info"}
              value={percentage}
              sx={{ height: "100%" }}
            />
          </Grid>
          <Grid item xs={2} textAlign="center">
            <Typography variant="body1" fontWeight="bold" pl={1}>
              {props.numberOfVotes} vote{props.numberOfVotes > 1 && "s"} (
              {percentage.toFixed(2)} %)
            </Typography>
          </Grid>
        </Grid>
      </Paper>
    </Stack>
  )
}

export default QuestionDetailResultOption
