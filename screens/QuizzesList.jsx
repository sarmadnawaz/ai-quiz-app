import * as React from "react";
import { useMemo } from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import { Text, Chip, useTheme, Card, Button } from "react-native-paper";
import ScreenWrapper from "../components/ScreenWrapper";

const types = ["All", "Unattempted", "Attempted"];

const quizzes = [
  {
    title: "Object Oriented Programming",
    questions: 10,
    time: 10,
    difficulty: "Easy",
    attempts: 2,
    score: 7,
    status: "Attempted",
    description:
      "This is a quiz on OOPs concepts, inheritance, and polymorphism in Java.",
  },
  {
    title: "Data Structures",
    questions: 15,
    time: 15,
    difficulty: "Medium",
    attempts: 0,
    score: 0,
    status: "Unattempted",
    description: "This is a quiz on Data Structures and Algorithms.",
  },
];

const QuizzesList = () => {
  const { colors } = useTheme();
  const [selectedType, setSelectedType] = React.useState(types[0]);

  const filteredQuizzes = useMemo(() => {
    return selectedType === "All"
      ? quizzes
      : quizzes.filter((quiz) => {
          if (selectedType === "Unattempted") {
            return quiz.status === "Unattempted";
          }
          return quiz.status === "Attempted";
        });
  }, [selectedType, quizzes]);

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
            {type}
          </Chip>
        ))}
      </View>
      <ScrollView
        style={[styles.container, { backgroundColor: colors?.background }]}
        contentContainerStyle={styles.content}
      >
        {filteredQuizzes?.map((quiz, index) => (
          <Card key={index} style={styles.card}>
            <Card.Title title={quiz.title} />
            <Card.Content>
              <Text style={styles.description}>{quiz.description}</Text>
            </Card.Content>
            <Card.Content style={styles.cardContent}>
              <View style={styles.infoContainer}>
                <Text style={styles.infoText}>
                  Attempts:{" "}
                  <Text style={styles.infoHighlight}>{quiz.attempts}</Text>
                </Text>
                <Text style={styles.infoText}>
                  Score:{" "}
                  <Text style={styles.infoHighlight}>
                    {quiz.score}/{quiz.questions}
                  </Text>
                </Text>
              </View>
              <View style={styles.infoContainer}>
                <Text style={styles.infoText}>
                  Difficulty:{" "}
                  <Text style={styles.infoHighlight}>{quiz.difficulty}</Text>
                </Text>
                <Text style={styles.infoText}>
                  Time:{" "}
                  <Text style={styles.infoHighlight}>{quiz.time} mins</Text>
                </Text>
              </View>
            </Card.Content>
            <Card.Actions>
              <Button style={styles.button}>
                {quiz.status === "Attempted" ? "Retake" : "Attempt Quiz"}
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
