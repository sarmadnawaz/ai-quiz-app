import React from "react";
import { ScrollView, StyleSheet, View, Image } from "react-native";
import { Text, Button, TextInput } from "react-native-paper";
import { Formik } from "formik";
import * as yup from "yup";
import ScreenWrapper from "../components/ScreenWrapper";
import RadioGroup from "../components/RadioGroup";
import Camera from "../components/Camera";
import { useState } from "react";
import generateQuiz from "../lib/generateQuiz";

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

const GenerateQuiz = () => {
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [images, setImages] = useState([]);

  const handleGenerateQuiz = async (values) => {
    const data = await generateQuiz({
      images,
      description: values.description,
      difficulty: values.difficulty,
      duration: values.duration,
    });
    console.log(data);
  };

  if (isCameraOpen) {
    return (
      <ScreenWrapper
        keyboardShouldPersistTaps="always"
        removeClippedSubviews={false}
        contentContainerStyle={styles.wrapper}
      >
        <Camera
          onComplete={(image) => {
            setImages([...images, image]);
            setIsCameraOpen(false);
            return;
          }}
          onClose={() => setIsCameraOpen(false)}
        />
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper
      keyboardShouldPersistTaps="always"
      removeClippedSubviews={false}
      contentContainerStyle={styles.wrapper}
    >
      <ScrollView style={styles.container}>
        <Formik
          initialValues={{
            title: "",
            difficulty: "easy",
            duration: "2",
            description: "",
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
          }) => (
            <View style={styles.formContainer}>
              <Text style={styles.title}>Generate Quiz</Text>
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
              <Text style={styles.label}>Select Difficulty</Text>
              <RadioGroup
                options={difficultyOptions}
                value={values.difficulty}
                onChange={handleChange("difficulty")}
              />
              {touched.difficulty && errors.difficulty && (
                <Text style={styles.error}>{errors.difficulty}</Text>
              )}
              <Text style={styles.label}>Select Duration</Text>
              <RadioGroup
                options={durationOptions}
                value={values.duration}
                onChange={handleChange("duration")}
              />
              {touched.duration && errors.duration && (
                <Text style={styles.error}>{errors.duration}</Text>
              )}
              <View style={styles.inputContainer}>
                <TextInput
                  mode="outlined"
                  label="Description your quiz content here"
                  multiline
                  placeholder="e.g. Generate a quiz on inheritance in OOP"
                  style={styles.descriptionInput}
                />
                <Text style={styles.label}>Add Images (Optional)</Text>
                <View style={styles.imageContainer}>
                  {images.map((image, index) => (
                    <Image
                      key={index}
                      source={{ uri: image }}
                      style={styles.image}
                    />
                  ))}
                </View>
                <Button
                  icon="image"
                  onPress={() => setIsCameraOpen(true)}
                  mode="outlined"
                  style={styles.imageButton}
                >
                  <Text>Add Images</Text>
                </Button>
              </View>
              <Button
                style={styles.generateButton}
                mode="contained"
                onPress={handleSubmit}
              >
                Generate Quiz
              </Button>
            </View>
          )}
        </Formik>
      </ScrollView>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  wrapper: { flex: 1, paddingTop: 30 },
  formContainer: { flex: 1, padding: 8 },
  title: { fontSize: 24, fontWeight: "bold", marginVertical: 10 },
  textInput: { marginVertical: 10 },
  label: { marginTop: 16, fontSize: 16, fontWeight: "bold" },
  inputContainer: { marginVertical: 10 },
  descriptionInput: { height: 150 },
  imageButton: { marginVertical: 16 },
  imageContainer: { flexDirection: "row", flexWrap: "wrap" },
  image: { width: "25%", aspectRatio: 1 },
  generateButton: { marginTop: 16 },
  error: { color: "red" },
});

export default GenerateQuiz;
