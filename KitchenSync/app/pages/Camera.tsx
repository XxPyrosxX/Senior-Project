import { CameraType, CameraView, useCameraPermissions } from "expo-camera";
import { useRef, useState, useEffect } from "react";
import { Button, Pressable, StyleSheet, Text, View, TouchableOpacity, Image as RNImage } from "react-native";
import { Image } from "expo-image";
import { FontAwesome6 } from "@expo/vector-icons";
import { PinchGestureHandler, PinchGestureHandlerEventPayload, State, GestureHandlerRootView, PanGestureHandler } from "react-native-gesture-handler";
import { useNavigation } from "@react-navigation/native";
import * as ImageManipulator from 'expo-image-manipulator';
import {addItemToPantry} from './PantryUtils';

export default function ReceiptCamera() {
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef<CameraView>(null);
  const [uri, setUri] = useState<string | null>(null);
  const [facing, setFacing] = useState<CameraType>("back");
  const [zoom, setZoom] = useState(0);
  const [imageDimensions, setImageDimensions] = useState({ width: 0, height: 0 });
  const [containerDimensions, setContainerDimensions] = useState({ width: 0, height: 0 });
  const baseZoomRef = useRef(zoom);
  const navigation = useNavigation();
  
  const [cropRect, setCropRect] = useState({
    x: 100,
    y: 100,
    width: 200,
    height: 200,
  });
  const [activeHandle, setActiveHandle] = useState<string | null>(null);

  // Get image dimensions when uri changes
  useEffect(() => {
    if (uri) {
      RNImage.getSize(uri, (width, height) => {
        setImageDimensions({ width, height });
      });
    }
  }, [uri]);

  if (!permission) return null;

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

  const addNewItem = async (itemsDict: Record<string, number>) => {
    try {
      for (const [itemName, count] of Object.entries(itemsDict)) {
        const newItem = await addItemToPantry(itemName, count.toString());
        console.log('Added item:', newItem);
      }
    } catch (error) {
      console.error('Failed to add item:', error);
    }
  };
  const sendImageToServer = async (imageUri: string) => {
    try {
      const formData = new FormData();
      formData.append('file', {
        uri: imageUri,
        name: 'image.jpg',
        type: 'image/jpeg',
      } as any);

      // Change to your corresponding IP Address
      // Don't forget to start the python server to send images
      const response = await fetch('http://10.75.142.174:8000/ocr', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Server error:', response.status, errorText);
      } else {
        const itemsDict = await response.json();
      console.log('Items Dictionary:', itemsDict);

      await addNewItem(itemsDict);
      }
    } catch (error) {
      console.error('Error sending image:', error);
    }
  };

  const cropAndSendImage = async () => {
    if (!uri || imageDimensions.width === 0 || imageDimensions.height === 0 || containerDimensions.width === 0 || containerDimensions.height === 0) return;
  
    try {
      // Calculate scaling factors
      const scaleX = imageDimensions.width / containerDimensions.width;
      const scaleY = imageDimensions.height / containerDimensions.height;
      const yOffsetCorrection = 50;

      // Scale cropRect to actual image size
      const scaledCropRect = {
        originX: cropRect.x * scaleX,
        originY: (cropRect.y + yOffsetCorrection) * scaleY,
        width: cropRect.width * scaleX,
        height: cropRect.height * scaleY,
      };

      // Ensure crop rectangle is within image bounds
      scaledCropRect.originX = Math.max(0, Math.min(scaledCropRect.originX, imageDimensions.width - scaledCropRect.width));
      scaledCropRect.originY = Math.max(0, Math.min(scaledCropRect.originY, imageDimensions.height - scaledCropRect.height));
      scaledCropRect.width = Math.min(scaledCropRect.width, imageDimensions.width - scaledCropRect.originX);
      scaledCropRect.height = Math.min(scaledCropRect.height, imageDimensions.height - scaledCropRect.originY);

      const croppedImage = await ImageManipulator.manipulateAsync(
        uri,
        [{ crop: scaledCropRect }],
        { compress: 1.0, format: ImageManipulator.SaveFormat.JPEG }
      );
      await sendImageToServer(croppedImage.uri);
    } catch (error) {
      console.error('Error cropping image:', error);
    }
  };

  const takePicture = async () => {
    const photo = await cameraRef.current?.takePictureAsync();
    if (photo?.uri) {
      setUri(photo.uri);
      setCropRect({ x: 100, y: 100, width: 200, height: 200 });
    } else {
      setUri(null);
    }
  };

  const toggleFacing = () => {
    setFacing((prev) => (prev === "back" ? "front" : "back"));
  };

  const handlePinchGesture = (event: { nativeEvent: PinchGestureHandlerEventPayload }) => {
    const factor = 0.5;
    let newZoom = baseZoomRef.current + (event.nativeEvent.scale - 1) * factor;
    newZoom = Math.max(0, Math.min(newZoom, 1));
    setZoom(newZoom);
  };

  const handlePinchStateChange = (event: { nativeEvent: any }) => {
    if (event.nativeEvent.oldState === State.ACTIVE) {
      baseZoomRef.current = zoom;
    }
  };

  const handlePanGesture = (event: any) => {
    const sensitivityFactor = 3;
    const dx = event.nativeEvent.translationX / sensitivityFactor;
    const dy = event.nativeEvent.translationY / sensitivityFactor;

    if (activeHandle === 'move') {
      setCropRect(prev => {
        const newX = Math.max(0, Math.min(prev.x + dx, containerDimensions.width - prev.width));
        const newY = Math.max(0, Math.min(prev.y + dy, containerDimensions.height - prev.height));
        return { ...prev, x: newX, y: newY };
      });
    } else if (activeHandle) {
      setCropRect(prev => {
        switch (activeHandle) {
          case 'topLeft':
            return {
              ...prev,
              x: Math.max(0, Math.min(prev.x + dx, prev.x + prev.width - 50)),
              y: Math.max(0, Math.min(prev.y + dy, prev.y + prev.height - 50)),
              width: Math.max(50, prev.width - dx),
              height: Math.max(50, prev.height - dy),
            };
          case 'topRight':
            return {
              ...prev,
              y: Math.max(0, Math.min(prev.y + dy, prev.y + prev.height - 50)),
              width: Math.max(50, Math.min(prev.width + dx, containerDimensions.width - prev.x)),
              height: Math.max(50, prev.height - dy),
            };
          case 'bottomLeft':
            return {
              ...prev,
              x: Math.max(0, Math.min(prev.x + dx, prev.x + prev.width - 50)),
              width: Math.max(50, prev.width - dx),
              height: Math.max(50, Math.min(prev.height + dy, containerDimensions.height - prev.y)),
            };
          case 'bottomRight':
            return {
              ...prev,
              width: Math.max(50, Math.min(prev.width + dx, containerDimensions.width - prev.x)),
              height: Math.max(50, Math.min(prev.height + dy, containerDimensions.height - prev.y)),
            };
          default:
            return prev;
        }
      });
    }
  };

  const handlePanStateChange = (event: any, handle: string) => {
    if (event.nativeEvent.state === State.BEGAN) {
      setActiveHandle(handle);
    }
    if (event.nativeEvent.state === State.END || event.nativeEvent.state === State.CANCELLED) {
      setActiveHandle(null);
    }
  };

  const renderPicture = () => {
    return (
      <View 
        style={styles.previewContainer}
        onLayout={(event) => {
          const { width, height } = event.nativeEvent.layout;
          setContainerDimensions({ width, height });
        }}
      >
        <Image
          source={{ uri: uri! }}
          style={styles.previewImage}
          onLoad={(e) => {
            const { width, height } = e.source;
            setImageDimensions({ width, height });
          }}
        />
        <View style={[styles.cropRectangle, {
          left: cropRect.x,
          top: cropRect.y,
          width: cropRect.width,
          height: cropRect.height,
        }]}>
          <PanGestureHandler
            onGestureEvent={handlePanGesture}
            onHandlerStateChange={(e) => handlePanStateChange(e, 'move')}
          >
            <View style={styles.moveHandle} />
          </PanGestureHandler>
          <PanGestureHandler
            onGestureEvent={handlePanGesture}
            onHandlerStateChange={(e) => handlePanStateChange(e, 'topLeft')}
          >
            <View style={[styles.resizeHandle, styles.topLeft]} />
          </PanGestureHandler>
          <PanGestureHandler
            onGestureEvent={handlePanGesture}
            onHandlerStateChange={(e) => handlePanStateChange(e, 'topRight')}
          >
            <View style={[styles.resizeHandle, styles.topRight]} />
          </PanGestureHandler>
          <PanGestureHandler
            onGestureEvent={handlePanGesture}
            onHandlerStateChange={(e) => handlePanStateChange(e, 'bottomLeft')}
          >
            <View style={[styles.resizeHandle, styles.bottomLeft]} />
          </PanGestureHandler>
          <PanGestureHandler
            onGestureEvent={handlePanGesture}
            onHandlerStateChange={(e) => handlePanStateChange(e, 'bottomRight')}
          >
            <View style={[styles.resizeHandle, styles.bottomRight]} />
          </PanGestureHandler>
        </View>
        <View style={styles.previewButtons}>
          <Button onPress={() => setUri(null)} title="Retake" />
          <Button onPress={cropAndSendImage} title="Send Cropped" />
        </View>
      </View>
    );
  };
  
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
              <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                <Text style={styles.backText}>Back</Text>
              </TouchableOpacity>
              <Text style={styles.zoomIndicator}>
                Zoom: {Math.round(zoom * 100)}%
              </Text>
              <View style={styles.shutterContainer}>
                <Pressable onPress={takePicture}>
                  <View style={styles.shutterBtn}>
                    <View style={[styles.shutterBtnInner, { backgroundColor: "white" }]} />
                  </View>
                </Pressable>
              </View>
            </CameraView>
          </View>
        </PinchGestureHandler>
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
  cropRectangle: {
    position: 'absolute',
    borderWidth: 2,
    borderColor: 'red',
    backgroundColor: 'rgba(255, 0, 0, 0.2)',
  },
  moveHandle: {
    position: 'absolute',
    width: 40,
    height: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    borderRadius: 20,
    top: '50%',
    left: '50%',
    transform: [{ translateX: -20 }, { translateY: -20 }],
  },
  resizeHandle: {
    position: 'absolute',
    width: 20,
    height: 20,
    backgroundColor: 'white',
    borderWidth: 2,
    borderColor: 'red',
    borderRadius: 10,
  },
  topLeft: {
    top: -10,
    left: -10,
  },
  topRight: {
    top: -10,
    right: -10,
  },
  bottomLeft: {
    bottom: -10,
    left: -10,
  },
  bottomRight: {
    bottom: -10,
    right: -10,
  },
  previewButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    padding: 20,
  },
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
    bottom: 44,
    left: 20,
    backgroundColor: "rgba(0,0,0,0.5)",
    color: "white",
    padding: 5,
    borderRadius: 5,
    fontSize: 14,
    zIndex: 2,
  },
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
  backButton: {
    position: 'absolute',
    top: 50,
    left: 15,
    padding: 5,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 5,
    zIndex: 10,
  },
  backText: {
    fontSize: 16,
    color: "#fff",
  },
});