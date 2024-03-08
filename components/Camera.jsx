import React, { useEffect, useState, useRef } from "react";
import { Camera } from "expo-camera";
import { View, Image, Text, StyleSheet } from "react-native";
import Icon from "react-native-vector-icons/AntDesign";
import { ActivityIndicator, Button } from "react-native-paper";

const ExpoCamera = ({ onComplete = () => {}, onClose = () => {} }) => {
  const [type, setType] = useState(Camera.Constants.Type.back);
  const [hasCameraPermission, setHasCameraPermission] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [image, setImage] = useState(null);
  const cameraRef = useRef(null);

  const flipCamera = () => {
    setType(
      type === Camera.Constants.Type.back
        ? Camera.Constants.Type.front
        : Camera.Constants.Type.back
    );
  };

  const requestCameraPermission = async () => {
    const { status } = await Camera.requestCameraPermissionsAsync();
    if (status === "granted") {
      setHasCameraPermission(true);
    }
  };

  const captureImage = async () => {
    if (cameraRef.current) {
      setIsLoading(true);
      const { uri } = await cameraRef.current.takePictureAsync({
        quality: 1,
        ratio: "1:1",
      });
      setImage(uri);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    requestCameraPermission();
  }, []);

  const retakeImage = () => {
    setImage(null);
  };

  const nextAction = () => {
    onComplete(image);
    setImage(null);
    return;
  };

  if (image) {
    return (
      <View
        style={{
          flex: 1,
          position: "relative",
        }}
      >
        {isLoading && (
          <ActivityIndicator
            animating={true}
            color="#fff"
            size="large"
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: [{ translateX: -20 }, { translateY: -20 }],
            }}
          />
        )}
        <Image
          resizeMode="contain"
          source={{ uri: image }}
          style={{ flex: 1 }}
        />
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            padding: 20,
            position: "absolute",
            bottom: 40,
            width: "100%",
          }}
        >
          <Button mode="outlined" onPress={retakeImage}>
            <Icon name="reload1" size={16} />
            {"   "}
            Retake
          </Button>
          <Button mode="contained" onPress={nextAction}>
            <Icon name="check" size={16} />
            {"   "}
            {isLoading ? "Adding..." : "Add"}
          </Button>
        </View>
      </View>
    );
  }

  if (!hasCameraPermission) {
    return (
      <View marginTop={200} paddingHorizontal={20} style={styles.container}>
        <Text style={styles.textOverlay}>Camera Permission denied</Text>
        <Button margin={20} mode="contained" onPress={requestCameraPermission}>
          Ask for Permission
        </Button>
      </View>
    );
  }

  return (
    <Camera
      style={{
        flex: 1,
        position: "relative",
      }}
      type={type}
      ratio="16:9"
      ref={cameraRef}
    >
      {isLoading && (
        <ActivityIndicator
          animating={true}
          color="#fff"
          size="large"
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: [{ translateX: -20 }, { translateY: -20 }],
          }}
        />
      )}
      <Button
        style={{
          position: "absolute",
          bottom: 10,
          left: "50%",
          transform: [{ translateX: -50 }],
        }}
        marginVertical={20}
        mode="contained"
        onPress={captureImage}
      >
        {isLoading ? "Capturing..." : "Capture"}
      </Button>
      <View style={styles.cameraButtons}>
        <Button onPress={onClose}>
          <Icon name="close" size={32} />
        </Button>
        <Button onPress={flipCamera}>
          <Icon name="reload1" size={32} />
        </Button>
      </View>
    </Camera>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  cameraButtons: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-between",
    paddingTop: 40,
    paddingHorizontal: 20,
    marginLeft: "auto",
  },
  buttonText: {
    fontSize: 18,
    color: "#fff",
  },
  textOverlay: {
    color: "#fff",
    fontSize: 20,
    textAlign: "center",
  },
});

export default ExpoCamera;
