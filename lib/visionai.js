import * as FileSystem from "expo-file-system";
import { GOOGLE_VISION_API_KEY } from "../config";

const API_URL = `https://vision.googleapis.com/v1/images:annotate?key=${GOOGLE_VISION_API_KEY}`;

// Generate request body for Google Vision API
function generateBody(image) {
  return {
    requests: [
      {
        image: {
          content: image,
        },
        features: [
          {
            type: "TEXT_DETECTION",
            maxResults: 1,
          },
        ],
      },
    ],
  };
}

// Perform text detection using Google Vision API
async function callGoogleVisionAsync(image) {
  try {
    // Read image file as base64 data
    const base64Data = await FileSystem.readAsStringAsync(image, {
      encoding: FileSystem.EncodingType.Base64,
    });

    // Generate request body
    const body = generateBody(base64Data);

    // Send request to Google Vision API
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      console.log(response.status, response.statusText);
      throw new Error("Failed to call Google Vision API");
    }

    const result = await response.json();
    const detectedText = result.responses[0]?.fullTextAnnotation?.text;
    console.log("Detected text:", detectedText);

    return detectedText ? detectedText : "This image doesn't contain any text!";
  } catch (error) {
    console.error(error);
    throw new Error(`Error calling Google Vision API: ${error.message}`);
  }
}

export { callGoogleVisionAsync };
