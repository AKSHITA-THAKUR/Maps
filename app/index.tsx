import React, { useEffect, useState , useRef } from "react";
import MapView, { Marker, PROVIDER_GOOGLE, Region , Polyline} from "react-native-maps";
import { StyleSheet, View, Button, Text } from "react-native";
import * as Location from "expo-location";
import { SanJoseRegion , Stanford , PaloAlto } from "@/constant/Region";

export default function App() {
  const mapRef = useRef<MapView>(null);

  const [region, setRegion] = useState<Region | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

const gotoSanjose = () =>{
mapRef.current?.animateToRegion(SanJoseRegion , 3*1000)     //Animate the user to new region.  takes 2 parameter , region and time to Complete this animation 

}

  const fetchUserLocation = async () => {
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

  useEffect(() => {
    fetchUserLocation();
  }, []);

  return (
    <View style={styles.container}>
      {region ? (
        <MapView
        ref={mapRef}
          region={region}
          style={styles.map}
          onRegionChangeComplete={(region) => setRegion(region)}
          showsMyLocationButton
          showsUserLocation
        >
          <Polyline coordinates={[Stanford , PaloAlto]} strokeColor={"#000"} strokeWidth={3}/>   {/* Create a line between Stanford and PaloAlto */}
          <Marker   //Chnge the color of the marker
            pinColor="green"
            coordinate={{
              latitude: 37.36787931793023,
              longitude: -122.03485848886174,
            }}
          />
          <Marker    //Added image in the marker
            image={require("../assets/images/hotels.png")}
            coordinate={{
              latitude: 37.35372687747386,
              longitude: -121.9579436257094,
            }}
          />
        </MapView>
      ) : (
        <Text>Loading map...</Text>
      )}
      {errorMsg && <Text>{errorMsg}</Text>}

      <Button onPress={()=> gotoSanjose()} title="Go To SanJose"/>
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
