import { useAppSelector } from "../../app/hook";
import { selectAllPublicUsers } from "../users/usersSlice";

const LoginPage = () => {
  const users = useAppSelector(selectAllPublicUsers);
  return (
    <div>
      {users.map((user) => (
        <li key={user.id}>{user.name}</li>
      ))}
    </div>
  );
};

export default LoginPage;
