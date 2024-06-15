import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Navigate } from "react-router-dom";
import { loadAdmin } from "../redux/actions/admin";
import { getAllQuestion } from "../redux/actions/allquestion";
import Loading from "../components/Loading/Loading";
const ProtectedRoute = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);

  const { isAuthenticatedAdmin } = useSelector((state) => state.admin);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getAllQuestion());
    dispatch(loadAdmin())
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

  if (!isAuthenticatedAdmin) {
    // Redirect to login if not authenticated
    return <Navigate to="/login-admin" replace />;
  }

  return children;
};

export default ProtectedRoute;
