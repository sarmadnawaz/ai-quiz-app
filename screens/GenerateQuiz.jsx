import React from "react";
import {
  ScrollView,
  StyleSheet,
  View,
  Image,
  TouchableOpacity,
} from "react-native";
import { Text, Button, TextInput, ActivityIndicator } from "react-native-paper";
import { Formik } from "formik";
import * as yup from "yup";
import ScreenWrapper from "../components/ScreenWrapper";
import RadioGroup from "../components/RadioGroup";
import Camera from "../components/Camera";
import { useState } from "react";
import generateQuiz from "../lib/generateQuiz";
import { createQuiz, addQuestionsToQuiz } from "../lib/database";
import globalStyles from "../styles";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { useQuizzes } from "../context/QuizzesProvider";

const difficultyOptions = [
  { label: "Easy", value: "easy" },
  { label: "Medium", value: "medium" },
  { label: "Hard", value: "hard" },
];

const durationOptions = [
  { label: "2 min", value: "2" },
  { label: "5 min", value: "5" },
  { label: "10 min", value: "10" },
];

const validationSchema = yup.object().shape({
  title: yup.string().required("Title is required"),
  difficulty: yup.string().required("Difficulty is required"),
  duration: yup.string().required("Duration is required"),
});

const GenerateQuiz = ({ navigation }) => {
  const { fetchQuizzes } = useQuizzes();
  const [isCameraOpen, setIsCameraOpen] = useState(false);

  const handleGenerateQuiz = async (values, options) => {
    try {
      const questions = await generateQuiz({
        images: values.images,
        description: values.description,
        difficulty: values.difficulty,
        duration: values.duration,
      });

      // create a new quiz in the database
      const quiz = await createQuiz({
        title: values.title,
        description: values.description,
        difficulty: values.difficulty,
        duration: values.duration,
        attempts: 0,
        status: "unattempted",
        totalQuestions: questions?.length || 0,
      });

      // add questions to the quiz
      await addQuestionsToQuiz(quiz.id, questions);
      await fetchQuizzes();

      options.resetForm();
      navigation.navigate("Home");

      return;
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <ScreenWrapper
      keyboardShouldPersistTaps="always"
      removeClippedSubviews={false}
      contentContainerStyle={styles.wrapper}
    >
      <Formik
        initialValues={{
          title: "",
          difficulty: "easy",
          duration: "2",
          description: "",
          images: [],
        }}
        validationSchema={validationSchema}
        onSubmit={handleGenerateQuiz}
      >
        {({
          handleChange,
          handleBlur,
          handleSubmit,
          values,
          errors,
          touched,
          isSubmitting,
        }) =>
          isCameraOpen ? (
            <Camera
              onComplete={(image) => {
                handleChange("images")(images.concat(image));
                setIsCameraOpen(false);
                return;
              }}
              onClose={() => setIsCameraOpen(false)}
            />
          ) : (
            <ScrollView style={styles.container}>
              <View style={styles.formContainer}>
                {isSubmitting && (
                  <View style={styles.loading}>
                    <ActivityIndicator animating={true} />
                    <Text style={globalStyles.heading}>Generating Quiz...</Text>
                    <Text style={globalStyles.subHeading}>
                      Please wait while we generate a quiz for you.
                    </Text>
                  </View>
                )}
                <Text marginTop={20} style={globalStyles.heading}>
                  Generate New Quiz
                </Text>
                <View style={styles.inputContainer}>
                  <TextInput
                    label="Quiz Title"
                    value={values.title}
                    onChangeText={handleChange("title")}
                    onBlur={handleBlur("title")}
                    style={styles.textInput}
                  />
                  {touched.title && errors.title && (
                    <Text style={styles.error}>{errors.title}</Text>
                  )}
                  <TextInput
                    label="Description your quiz content here"
                    multiline
                    numberOfLines={4}
                    value={values.description}
                    onChangeText={handleChange("description")}
                    onBlur={handleBlur("description")}
                    placeholder="e.g. Generate a quiz on inheritance in OOP"
                    style={styles.descriptionInput}
                  />
                  <Text style={styles.label}>Content Images (Optional)</Text>
                  <View style={styles.imageContainer}>
                    {images.map((image, index) => (
                      <View
                        style={{
                          width: 100,
                          height: 100,
                          aspectRatio: 1,
                          position: "relative",
                        }}
                      >
                        <Image
                          key={index}
                          source={{ uri: image }}
                          style={styles.image}
                        />
                        <TouchableOpacity
                          onPress={() =>
                            handleChange("images")(
                              images.filter((_, i) => i !== index)
                            )
                          }
                          style={styles.closeIcon}
                        >
                          <Icon name="close" size={24} color="red" />
                        </TouchableOpacity>
                      </View>
                    ))}
                  </View>
                  <Button
                    icon="image"
                    onPress={() => setIsCameraOpen(true)}
                    mode="outlined"
                    marginBottom={15}
                  >
                    Add Image
                  </Button>
                </View>
                <View flexDirection="row" gap={8}>
                  <Text style={styles.label}>Difficulty</Text>
                  <RadioGroup
                    options={difficultyOptions}
                    value={values.difficulty}
                    onChange={handleChange("difficulty")}
                  />
                </View>
                <View flexDirection="row" gap={8}>
                  <Text style={styles.label}>Duration</Text>
                  <RadioGroup
                    options={durationOptions}
                    value={values.duration}
                    onChange={handleChange("duration")}
                  />
                </View>
                <Button
                  style={styles.generateButton}
                  mode="contained"
                  onPress={handleSubmit}
                >
                  {isSubmitting ? "Generating" : "Generate Quiz"}
                </Button>
              </View>
            </ScrollView>
          )
        }
      </Formik>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  wrapper: { flex: 1, position: "relative", padding: 8 },
  title: { fontSize: 24, fontWeight: "bold", marginVertical: 10 },
  label: { marginTop: 16, fontSize: 16, fontWeight: "700" },
  imageButton: { marginVertical: 16 },
  imageContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingVertical: 10,
    gap: 10,
  },
  image: { width: 100, height: 100, aspectRatio: 1 },
  generateButton: { marginTop: 16 },
  error: { color: "red" },
  loading: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
    zIndex: 1000,
  },
  closeIcon: {
    position: "absolute",
    top: 0,
    right: 0,
  },
});

export default GenerateQuiz;
