import { CameraType, CameraView, useCameraPermissions} from "expo-camera";
import { useRef, useState } from "react";
import { Button, Pressable, StyleSheet, Text, View, } from "react-native";
import { Image } from "expo-image";
import { FontAwesome6 } from "@expo/vector-icons";
import { PinchGestureHandler, PinchGestureHandlerEventPayload, State, GestureHandlerRootView} from "react-native-gesture-handler";

export default function ReceiptCamera() {
  // Request camera permissions
  const [permission, requestPermission] = useCameraPermissions();
  // Reference to the CameraView
  const cameraRef = useRef<CameraView>(null);
  // State for captured image URI, camera facing, and zoom level
  const [uri, setUri] = useState<string | null>(null);
  const [facing, setFacing] = useState<CameraType>("back");
  const [zoom, setZoom] = useState(0);
  // Ref to store the base zoom value when starting a pinch gesture
  const baseZoomRef = useRef(zoom);

  // While permissions are loading, render nothing.
  if (!permission) {
    return null;
  }

  // If permissions are not granted, display a message with a button.
  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>
          We need your permission to use the camera.
        </Text>
        <Button onPress={requestPermission} title="Grant permission" />
      </View>
    );
  }

  // Capture a picture.
  const takePicture = async () => {
    const photo = await cameraRef.current?.takePictureAsync();
    setUri(photo?.uri ?? null);
  };

  // Toggle between front and back cameras.
  const toggleFacing = () => {
    setFacing((prev) => (prev === "back" ? "front" : "back"));
  };

  // Handle pinch gesture events for zooming.
  const handlePinchGesture = (event: { nativeEvent: PinchGestureHandlerEventPayload }) => {
    // event.nativeEvent.scale is relative to 1.
    const factor = 0.5; // Adjust sensitivity if needed.
    let newZoom = baseZoomRef.current + (event.nativeEvent.scale - 1) * factor;
    newZoom = Math.max(0, Math.min(newZoom, 1)); // Clamp newZoom between 0 and 1.
    setZoom(newZoom);
  };

  // When the pinch gesture ends, store the current zoom as the new base.
  const handlePinchStateChange = (event: { nativeEvent: any }) => {
    if (event.nativeEvent.oldState === State.ACTIVE) {
      baseZoomRef.current = zoom;
    }
  };

  // Render the captured image preview using expo-image.
  const renderPicture = () => {
    return (
      <View style={styles.previewContainer}>
        <Image
          source={{ uri: uri! }}
          contentFit="contain"
          style={styles.previewImage}
        />
        <Button onPress={() => setUri(null)} title="Take another picture" />
      </View>
    );
  };

  // Render the live camera view with pinch-to-zoom, a zoom indicator, and bottom controls.
  const renderCamera = () => {
    return (
      <View style={styles.cameraContainer}>
        <PinchGestureHandler
          onGestureEvent={handlePinchGesture}
          onHandlerStateChange={handlePinchStateChange}
        >
          <View style={{ flex: 1 }}>
            <CameraView
              style={styles.camera}
              ref={cameraRef}
              mode="picture"
              facing={facing}
              mute={false}
              zoom={zoom}
              responsiveOrientationWhenOrientationLocked
            >
              {/* Zoom indicator overlay positioned at bottom left */}
              <Text style={styles.zoomIndicator}>
                Zoom: {Math.round(zoom * 100)}%
              </Text>
              {/* Shutter container with the take-picture button centered */}
              <View style={styles.shutterContainer}>
                <Pressable onPress={takePicture}>
                  <View style={styles.shutterBtn}>
                    <View
                      style={[
                        styles.shutterBtnInner,
                        { backgroundColor: "white" },
                      ]}
                    />
                  </View>
                </Pressable>
              </View>
            </CameraView>
          </View>
        </PinchGestureHandler>
        {/* Toggle facing button container positioned at bottom right */}
        <View style={styles.facingButtonContainer}>
          <Pressable onPress={toggleFacing}>
            <FontAwesome6 name="rotate-left" size={32} color="white" />
          </Pressable>
        </View>
      </View>
    );
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={styles.container}>
        {uri ? renderPicture() : renderCamera()}
      </View>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  message: {
    textAlign: "center",
    paddingBottom: 10,
    fontSize: 16,
    color: "#000",
  },
  cameraContainer: {
    flex: 1,
    width: "100%",
  },
  camera: {
    flex: 1,
    width: "100%",
  },
  zoomIndicator: {
    position: "absolute",
    bottom: 44, // Aligned with the other bottom controls
    left: 20,
    backgroundColor: "rgba(0,0,0,0.5)",
    color: "white",
    padding: 5,
    borderRadius: 5,
    fontSize: 14,
    zIndex: 2,
  },
  // Shutter container centers the shutter button at the bottom
  shutterContainer: {
    position: "absolute",
    bottom: 44,
    left: 0,
    right: 0,
    alignItems: "center",
    justifyContent: "center",
  },
  shutterBtn: {
    backgroundColor: "transparent",
    borderWidth: 5,
    borderColor: "white",
    width: 85,
    height: 85,
    borderRadius: 45,
    alignItems: "center",
    justifyContent: "center",
  },
  shutterBtnInner: {
    width: 70,
    height: 70,
    borderRadius: 50,
  },
  // Facing button container positioned at bottom right
  facingButtonContainer: {
    position: "absolute",
    bottom: 44,
    right: 20,
    zIndex: 3,
  },
  previewContainer: {
    flex: 1,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#000",
  },
  previewImage: {
    width: "100%",
    height: "80%",
    marginBottom: 20,
  },
});
