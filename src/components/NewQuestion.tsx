import { useAuth } from "../app/hook"

const NewQuestion = () => {
  const auth = useAuth()
  return <div>Welcome to new question</div>
}

export default NewQuestion
