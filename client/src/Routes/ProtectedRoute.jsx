import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Navigate } from "react-router-dom";
import { loadUser } from "../redux/actions/user";
import { loadQuestions } from "../redux/actions/loadquestion";
import { getAllQuestion } from "../redux/actions/allquestion";
import { getAllResult } from "../redux/actions/result";
import Loading from "../components/Loading/Loading";
import { logoutUser, checkAuth } from "../redux/reducers/";
const ProtectedRoute = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const { isAuthenticated } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(loadQuestions());
    dispatch(getAllQuestion());
    dispatch(getAllResult());
    dispatch(loadUser())
      .then(() => {
        setIsLoading(false);
      })
      .catch((error) => {
        setIsLoading(false);
        console.error("Error loading user:", error);
      });
  }, [dispatch]);

  if (isLoading) {
    // Return a loading indicator if authentication state is loading
    return <Loading />;
  }

  if (!isAuthenticated) {
    // Redirect to login if not authenticated
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
