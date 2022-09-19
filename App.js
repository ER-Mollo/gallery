import { StatusBar } from 'expo-status-bar';
import { Button, StyleSheet, Text, View, SafeAreaView, Image} from 'react-native';
import { Camera } from 'expo-camera';
import { useEffect, useRef,useState } from 'react';
import * as MediaLibrary from 'expo-media-library';

export default function App() {

  let cameraRef = useRef();
  const [hasCameraPermission, setHasCameraPermission] = useState();
  const [hasMediaLibrary,setHasMediaLibrary] = useState();
  const [photo,setPhoto] = useState();

  useEffect(()=>{
    (async()=>{
      const CameraPermission = await Camera.requestCameraPermissionsAsync();
      const MediaLibraryPermission = await MediaLibrary.requestPermissionsAsync();

      setHasCameraPermission(CameraPermission.status=== "granted");
      setHasMediaLibrary(MediaLibraryPermission.status=== "granted");
    })();
  },[]);

  if (hasCameraPermission === undefined){
    return<Text>Requesting permission...</Text>
  }else if(!hasCameraPermission){
    return(
      <Text>permissionf for camera not granted</Text>
    )
  }

  let takePic = async() => {
    let options ={
      quality:1,
      base64:true,
      exif: false
    };

    let newPhoto = await cameraRef.current.takePictureAsync(options);
    setPhoto(newPhoto);
  }

  if (photo) {
    let savePhoto =() => {
      MediaLibrary.saveToLibraryAsync(photo.uri).then(() =>{
        setPhoto(undefined);
      });
    };
    return(
      <SafeAreaView style={styles.container}>
        <Image style={styles.preview} source = {{uri:"data:image/jpg;base64" + photo.base64}}/>
        {hasMediaLibrary ? <Button title='save' onPress={savePhoto}/>: undefined}
        <Button title='Discard' onPress={()=> setPhoto(undefined)}/>
      </SafeAreaView>
    )
  }

  return (
    <Camera style={styles.container} ref={cameraRef}>
      <View style={styles.buttonContainer}>
        <Button title='take pic' onPress={takePic}/>
      </View>
      <StatusBar style="auto" />
    </Camera>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonContainer:{
    backgroundColor:'#fff',
    alignSelf: 'flex-end',
  },
  preview:{
    alignSelf: 'stretch',
    flex: 1
  }

});
