import { useAuth } from "../app/hook"

const Home = () => {
  const auth = useAuth()
  return <div>Hello {auth.name}</div>
}

export default Home
