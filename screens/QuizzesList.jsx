import * as React from "react";
import { useMemo } from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import {
  Text,
  Chip,
  useTheme,
  Card,
  Button,
  ActivityIndicator,
} from "react-native-paper";
import ScreenWrapper from "../components/ScreenWrapper";
import Modal from "../components/Modal";
import globalStyles from "../styles";
import { useQuizzes } from "../context/QuizzesProvider";

const types = ["all", "unattempted", "attempted"];

const QuizzesList = ({ navigation }) => {
  const { colors } = useTheme();
  const { quizzes, status } = useQuizzes();
  const [selectedType, setSelectedType] = React.useState(types[0]);

  const filteredQuizzes = useMemo(() => {
    return selectedType === "all"
      ? quizzes
      : quizzes.filter((quiz) => quiz.status === selectedType);
  }, [selectedType, quizzes]);

  if (status === "idle") {
    return (
      <Modal>
        <ActivityIndicator animating={true} />
        <Text>Fetching quizzes...</Text>
      </Modal>
    );
  }

  if (!quizzes.length) {
    return (
      <Modal
        actionButtonTitle="Generate a Quiz"
        onAction={() => navigation.navigate("GenearteQuiz")}
      >
        <Text
          style={{
            ...globalStyles.heading,
            textAlign: "center",
          }}
        >
          No quizzes found 🙂
        </Text>
        <Text
          marginBottom={20}
          style={{
            ...globalStyles.subHeading,
            textAlign: "center",
          }}
        >
          Generate a quiz to boost your learning experience.
        </Text>
      </Modal>
    );
  }

  return (
    <ScreenWrapper contentContainerStyle={styles.content}>
      <Text style={styles.title}>All Quizzes</Text>
      <View style={styles.preference}>
        {types.map((type) => (
          <Chip
            key={type}
            selected={selectedType === type}
            mode="outlined"
            onPress={() => setSelectedType(type)}
            style={styles.chip}
          >
            {type[0]?.toLocaleUpperCase() + type?.slice(1)}
          </Chip>
        ))}
      </View>
      <ScrollView
        style={[styles.container, { backgroundColor: colors?.background }]}
        contentContainerStyle={styles.content}
      >
        {filteredQuizzes?.map((quiz, index) => (
          <Card
            onPress={() => navigation.navigate("Quiz", { quizId: quiz.id })}
            key={index}
            style={styles.card}
          >
            <Card.Title title={quiz.title} />
            <Card.Content style={styles.cardContent}>
              <View style={styles.infoContainer}>
                <Text style={styles.infoText}>
                  Attempts:{" "}
                  <Text style={styles.infoHighlight}>{quiz.attempts}</Text>
                </Text>
                {quiz.status === "attempted" ? (
                  <Text style={styles.infoText}>
                    Score:{" "}
                    <Text style={styles.infoHighlight}>
                      {quiz.score
                        ? `${quiz.score}/${quiz.totalQuestions}`
                        : "N/A"}
                    </Text>
                  </Text>
                ) : (
                  <Text style={styles.infoText}>
                    Status :{" "}
                    <Text style={styles.infoHighlight}>Unattempted</Text>
                  </Text>
                )}
              </View>
              <View style={styles.infoContainer}>
                <Text style={styles.infoText}>
                  Difficulty:{" "}
                  <Text style={styles.infoHighlight}>{quiz.difficulty}</Text>
                </Text>
                <Text style={styles.infoText}>
                  Time:{" "}
                  <Text style={styles.infoHighlight}>{quiz.time} min</Text>
                </Text>
              </View>
            </Card.Content>
            <Card.Actions>
              <Button style={styles.button}>
                {quiz.status === "Attempted" ? "Retake" : "Start Quiz"}
              </Button>
            </Card.Actions>
          </Card>
        ))}
      </ScrollView>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  content: {
    padding: 4,
    position: "relative",
    flex: 1,
  },
  title: {
    paddingTop: 30,
    paddingBottom: 10,
    paddingHorizontal: 8,
    fontWeight: "semibold",
    fontSize: 24,
  },
  preference: {
    alignItems: "center",
    flexDirection: "row",
    paddingVertical: 12,
    paddingHorizontal: 8,
  },
  chip: {
    margin: 4,
  },
  container: {
    flex: 1,
  },
  card: {
    margin: 4,
  },
  description: {
    fontSize: 16,
  },
  cardContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 16,
    alignItems: "flex-end",
    paddingVertical: 12,
    marginTop: 10,
  },
  infoContainer: {
    flexDirection: "column",
    alignItems: "flex-start",
    justifyContent: "center",
  },
  infoText: {
    fontSize: 14,
    marginBottom: 4,
  },
  infoHighlight: {
    fontWeight: "bold",
  },
  button: {
    marginLeft: "auto",
  },
});

export default QuizzesList;
