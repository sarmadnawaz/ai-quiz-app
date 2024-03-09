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
import { useQuizzes } from "../context/QuizzesProvider";
import Modal from "../components/Modal";

const evaluateQuiz = (questions = [], answers = {}) => {
  let score = 0;
  questions?.forEach((question, idx) => {
    if (question.correctAnswer === answers[idx + 1]) {
      score++;
    }
  });
  return score;
};

const Quiz = ({ navigation, route }) => {
  const { quizId } = route.params;
  const { fetchQuizzes } = useQuizzes();
  const [status, setStatus] = React.useState("idle");
  const [score, setScore] = React.useState(0);
  const [currentQuestionNo, setCurrentQuestionNo] = React.useState(1);
  const [anwers, setAnswers] = React.useState({});
  const [quiz, setQuiz] = React.useState(null);

  useEffect(() => {
    async function updateQuizMutation() {
      const score = evaluateQuiz(quiz?.questions, anwers);
      setScore(score);
      await updateQuiz({ ...quiz, score });
      fetchQuizzes();
      setStatus("completed");
      return;
    }

    if (status === "submitted") {
      updateQuizMutation();
    }
  }, [status]);

  useEffect(() => {
    async function fetchQuiz() {
      const quiz = await getQuiz(quizId);
      setQuiz(quiz);
      setStatus("ready");
    }

    if (status === "idle" && quizId) {
      fetchQuiz();
    }
  }, [status, quizId]);

  const handleOnQuestionChange = (questionNo) => {
    if (questionNo > quiz?.questions?.length || questionNo < 1) return;
    setCurrentQuestionNo(questionNo);
  };

  if (status === "not-found") {
    return (
      <Modal
        onAction={() => {
          setStatus("idle");
          navigation.navigate("Quizzes");
        }}
        actionButtonTitle="Go back"
      >
        <Text>Didn't find the quiz you are looking for 😑</Text>
      </Modal>
    );
  }

  if (status === "idle") {
    return (
      <Modal>
        <ActivityIndicator animating={true} />
        <Text>Loading quiz... Plz wait</Text>
      </Modal>
    );
  }

  if (status === "completed") {
    return (
      <Modal
        onAction={() => {
          setStatus("idle");
          navigation.navigate("Quizzes");
        }}
        actionButtonTitle="Go back"
      >
        <View paddingVertical={20}>
          {score / quiz?.questions?.length > 0.5 ? (
            <Text>
              You scored {score} out of {quiz?.questions?.length}. Well done!
              🎉🎉
            </Text>
          ) : (
            <Text>
              Scored {score} out of {quiz?.questions?.length}. Better luck next
              time!
            </Text>
          )}
        </View>
      </Modal>
    );
  }

  if (status === "submitted") {
    return (
      <Modal>
        <ActivityIndicator animating={true} />
        <Text>Submitting your quiz... Plz wait</Text>
      </Modal>
    );
  }

  return (
    <ScreenWrapper contentContainerStyle={styles.content}>
      <View marginBottom={40} marginTop={10}>
        <Text style={styles.heading}>Quiz</Text>
        <Text style={styles.subHeading}>{quiz?.title}</Text>
      </View>
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
        marginTop={40}
        marginHorizontal={10}
        mode="contained"
        onPress={() => setStatus("submitted")}
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
  question: {
    fontSize: 18,
    fontWeight: "semibold",
  },
  constainer: {
    flex: 1,
    padding: 10,
  },
  heading: {
    fontWeight: "700",
    fontSize: 24,
    marginVertical: 5,
  },
  subHeading: {
    fontSize: 18,
  },
});

export default Quiz;
