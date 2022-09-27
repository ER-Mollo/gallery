import { StatusBar } from 'expo-status-bar';
import { Button, StyleSheet, Text, View, SafeAreaView, Image} from 'react-native';
import { Camera } from 'expo-camera';
import { useEffect, useRef,useState } from 'react';
import * as MediaLibrary from 'expo-media-library';
import * as ImagePicker from 'expo-image-picker';

export default function App() {

  let cameraRef = useRef();
  const [hasCameraPermission, setHasCameraPermission] = useState();
  const [hasMediaLibrary,setHasMediaLibrary] = useState();
  const [photo,setPhoto] = useState();
  const [image, setImage] = useState(null);


  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    console.log(result);

    if (!result.cancelled) {
      setImage(result.uri);
    }
  };

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
      console.log(photo);
      MediaLibrary.saveToLibraryAsync(photo.uri).then(() =>{
        setPhoto(undefined);
      });
      
    };
    return(
      <SafeAreaView style={styles.previewcontainer}>
        <Image style={styles.preview} source = {{uri:"data:image/jpg;base64" + photo.base64}}/>
        {/* {hasMediaLibrary ? <Button title='save' onPress={savePhoto}/>: undefined} */}
        <Button title='save' onPress={savePhoto}/>
        <Button title='Discard' onPress={()=> setPhoto(undefined)}/>
        <Button title="Pick an image from camera roll" onPress={pickImage} />
        {image && <Image source={{ uri: image }} style={{ width: 200, height: 200 }} />}
      </SafeAreaView>
    )
  }

 

  return (
    <Camera style={styles.container} ref={cameraRef}>
        <View style={styles.buttonContainer}>
          <Button title='take pic' onPress={takePic}/>
          <Button title='view pic' onPress={takePic}/>
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
    // alignSelf: 'stretch',
    flex: 1,
    width:'100vh',
    height:'50vh'
  }

});
