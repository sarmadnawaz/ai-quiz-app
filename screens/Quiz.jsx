import * as React from "react";
import { StyleSheet, View } from "react-native";
import {
  DataTable,
  Card,
  Text,
  Button,
  ActivityIndicator,
} from "react-native-paper";
import ScreenWrapper from "../components/ScreenWrapper";
import RadioGroup from "../components/RadioGroup";
import { useEffect } from "react";
import { getQuiz, updateQuiz } from "../lib/database";

const evaluateQuiz = (questions = [], answers = {}) => {
  let score = 0;
  questions?.forEach((question, idx) => {
    if (question.correctAnswer === answers[idx + 1]) {
      score++;
    }
  });
  return score;
};

const Quiz = () => {
  const [quizId, setQuizId] = React.useState(18);
  const [currentQuestionNo, setCurrentQuestionNo] = React.useState(1);
  const [anwers, setAnswers] = React.useState({});
  const [status, setStatus] = React.useState("loading");
  const [quiz, setQuiz] = React.useState(null);
  const [message, setMessage] = React.useState("");

  const handleOnQuestionChange = (questionNo) => {
    if (questionNo > quiz?.questions?.length || questionNo < 1) return;
    setCurrentQuestionNo(questionNo);
  };

  useEffect(() => {
    async function updateQuizMutation() {
      setStatus("submitting");
      const score = evaluateQuiz(quiz?.questions, anwers);
      await updateQuiz({ ...quiz, score });
      setMessage(`You scored ${score} out of ${quiz?.questions?.length}`);
      setStatus("submitted");
      return;
    }

    if (status === "completed") {
      updateQuizMutation();
    }

    return () => {
      setStatus("idle");
    };
  }, [status]);

  useEffect(() => {
    async function fetchQuiz() {
      const quiz = await getQuiz(quizId);
      console.log(quiz);
      setQuiz(quiz);
      setStatus("idle");
    }

    fetchQuiz();
  }, []);

  const LoadingState = ({ text }) => (
    <View style={styles.loadingContainer}>
      <ActivityIndicator animating={true} />
      <Text>{text}</Text>
    </View>
  );

  const CompletedState = ({ text }) => (
    <View style={styles.finishedStateContainer}>
      <View
        style={{
          backgroundColor: "#000",
          padding: 20,
          borderRadius: 10,
          alignItems: "center",
          flexDirection: "column",
          gap: 10,
        }}
      >
        <Text>Wow 🎉</Text>
        <Text>{text}</Text>
        <Button onPress={() => setStatus("idle")}>Ok</Button>
      </View>
    </View>
  );

  return (
    <ScreenWrapper paddingTop={40} contentContainerStyle={styles.content}>
      {status === "submitting" && (
        <LoadingState text="Submitting your quiz..." />
      )}
      {status === "loading" && <LoadingState text="Loading quiz..." />}
      {status === "submitted" && <CompletedState text="Quiz submitted" />}
      <Text style={styles.titleMain}>{quiz ? quiz?.title : "Loading..."}</Text>
      <Card>
        <DataTable>
          <DataTable.Header>
            <DataTable.Title>Question No: {currentQuestionNo}</DataTable.Title>
            <DataTable.Title>Time time: {quiz?.time} minutes</DataTable.Title>
          </DataTable.Header>

          <DataTable.Row marginVertical={40}>
            <DataTable.Cell>
              <Text style={styles.question}>
                {quiz?.questions[currentQuestionNo - 1]?.description}
              </Text>
            </DataTable.Cell>
          </DataTable.Row>

          <RadioGroup
            flexDirection="column"
            options={
              quiz?.questions?.[currentQuestionNo - 1]?.options?.map(
                (option) => ({
                  label: option,
                  value: option,
                })
              ) || []
            }
            value={anwers[currentQuestionNo]}
            onChange={(value) =>
              setAnswers({ ...anwers, [currentQuestionNo]: value })
            }
          />

          <DataTable.Pagination
            page={currentQuestionNo}
            numberOfPages={quiz?.questions?.length + 1 || 1}
            onPageChange={handleOnQuestionChange}
            label={`${currentQuestionNo}  of  ${quiz?.questions?.length}`}
          />
        </DataTable>
      </Card>
      <Button
        margin={30}
        mode="contained"
        onPress={() => setStatus("completed")}
      >
        Submit Quiz
      </Button>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  content: {
    flex: 1,
    padding: 8,
    position: "relative",
  },
  first: {
    flex: 1,
  },
  question: {
    fontSize: 18,
    fontWeight: "semibold",
  },
  title: {
    marginVertical: 16,
    fontSize: 16,
    fontWeight: "medium",
    marginBottom: 16,
  },
  titleMain: {
    fontSize: 18,
    fontWeight: "semibold",
    marginBottom: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    zIndex: 100,
    gap: 10,
  },
  finishedStateContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    zIndex: 100,
  },
});

export default Quiz;
