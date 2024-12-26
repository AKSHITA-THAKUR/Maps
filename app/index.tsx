import React, { useEffect, useState, useRef } from "react";
import MapView, {
  Marker,
  PROVIDER_GOOGLE,
  Region,
  Polyline,
  Circle,
  Polygon,
} from "react-native-maps";
import { StyleSheet, View, Button, Text, Switch } from "react-native";
import * as Location from "expo-location";
import {
  SanJoseRegion,
  Stanford,
  PaloAlto,
  polygonCoordinates,
} from "@/constant/Region";

export default function App() {
  const mapRef = useRef<MapView>(null);
  const [showMarkers, setShowMarkers] = useState(false);
  const [markers, setMarkers] = useState<{ latitude: number; longitude: number }[]>([]);
  const [region, setRegion] = useState<Region | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const toggleSwitch = () => {
    setShowMarkers((previousState) => {
      const newState = !previousState;
      if (!newState) {
        setMarkers([]); // If  i turned off switch, clear markers
      }
      return newState;
    });
  };

  const gotoSanjose = () => {
    mapRef.current?.animateToRegion(SanJoseRegion, 3 * 1000); //Animate the user to new region.  takes 2 parameter , region and time to Complete this animation
  };

  const fetchUserLocation = async () => {  //Function to fetc userLocation initially
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      setErrorMsg("Permission to access location was denied");
      return;
    }
    try {
      let location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });
      setRegion({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.1,
      });
      console.log(
        "Location:",
        location.coords.latitude,
        location.coords.longitude
      );
    } catch (error) {
      setErrorMsg("Error fetching location");
      console.error(error);
    }
  };

  const handleUserPress = (event:any) =>{
    const newPoint = event.nativeEvent.coordinate;
    setMarkers((prevMarkers) => [...prevMarkers, newPoint]); //Add new point to markers array
  }
  useEffect(() => {
    fetchUserLocation();
  }, []);

  return (
    <View style={styles.container}>
      <View style={{ flexDirection: "row", gap: 10 }}>
        <Text style={{ marginTop: 15 }}>Turn on to point merkers on map</Text>
        <Switch
          trackColor={{ false: "#767577", true: "#81b0ff" }}
          onValueChange={toggleSwitch}
          value={showMarkers}
        />
      </View>

      {region ? (
        <MapView
          ref={mapRef}
          region={region}
          style={styles.map}
          showsUserLocation
          onPress={showMarkers ? handleUserPress : undefined} 
          >
          { showMarkers && markers.map((points , index)=>(
            <Marker 
              key={index}
              coordinate={points}
              title={`Point ${index+1}`}
            />
          ))}
          {/* Chnge the color of the marker */}
          <Marker
            pinColor="yellow"
            coordinate={{
              latitude: region.latitude,
              longitude: region.longitude,
            }}
            title="My Location"
          />
          <Polyline
            coordinates={[Stanford, PaloAlto]}
            strokeColor={"#000"}
            strokeWidth={3}
          />
          {/* Create a line between Stanford and PaloAlto */}
          <Marker //Chnge the color of the marker
            pinColor="green"
            coordinate={{
              latitude: 37.36787931793023,
              longitude: -122.03485848886174,
            }}
            title="My First marker"
            description="This is just to test this description"
          />
          <Marker //Added image in the marker
            image={require("../assets/images/hotels.png")}
            coordinate={{
              latitude: 37.35372687747386,
              longitude: -121.9579436257094,
            }}
            title="This is a hotel"
          />
          <Polygon
            coordinates={polygonCoordinates} // Added Polygon Component
            strokeWidth={2}
            strokeColor="blue"
            fillColor="rgba(0, 255, 0, 0.3)"
          />
          <Circle              //Added circle component
            center={{
              latitude: 37.36787931793023,
              longitude: -122.03485848886174,
            }}
            radius={1000} // Radius in meters
            strokeWidth={2}
            strokeColor="red"
            fillColor="rgba(255, 0, 0, 0.3)"
          />
        </MapView>
      ) : (
        <Text>Loading map...</Text>
      )}
      {errorMsg && <Text>{errorMsg}</Text>}

      <Button onPress={() => gotoSanjose()} title="Go To SanJose" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  map: {
    width: "90%",
    height: "80%",
  },
});
