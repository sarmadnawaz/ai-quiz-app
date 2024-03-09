import { getQuizes } from "../lib/database";
import { useUser } from "./UserProvider";
import React, { useEffect } from "react";

const QuizzesContext = React.createContext();

const QuizzesProvider = ({ children }) => {
  const user = useUser();
  const [status, setStatus] = React.useState("idle");
  const [quizzes, setQuizzes] = React.useState([]);

  const fetchQuizzes = async () => {
    if (status !== "idle") setStatus("idle");
    const data = await getQuizes(user.id);
    setQuizzes(data);
    setStatus("ready");
  };

  useEffect(() => {
    fetchQuizzes();
  }, []);

  return (
    <QuizzesContext.Provider value={{ status, quizzes, fetchQuizzes }}>
      {children}
    </QuizzesContext.Provider>
  );
};

export const useQuizzes = () => {
  const context = React.useContext(QuizzesContext);
  if (context === undefined) {
    throw new Error("useQuizzes must be used within a QuizzesProvider");
  }
  return context;
};

export { QuizzesProvider, QuizzesContext };
