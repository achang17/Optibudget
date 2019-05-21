import React from 'react';
import {ActivityIndicator, ScrollView, StyleSheet, TouchableOpacity, Text, View, Image,} from 'react-native';
import { ImagePicker, Permissions, } from 'expo';
import Environment from "../config/environment";
import firebase from "../utils/firebase";
import uuid from 'uuid';

export default class AddSpendingScreen extends React.Component {
  static navigationOptions = {
    title: 'Add New Spending',
  };

  constructor() {
    super();

    this.state = {
      image: null,
      apiResponse: null,
      receiptTotal: null,
      loading: null,
      data: null,
      parsedTotals: null,

    };
  }

  async componentDidMount() {
    await Permissions.askAsync(Permissions.CAMERA_ROLL);
    await Permissions.askAsync(Permissions.CAMERA);
  }

  handleTakePhotoWithCamera = async () => {
    let photo = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
    });

    console.log(photo);
    console.log(photo.uri);

    if (!photo.cancelled) {
      console.log(photo.uri);

      const uploadURL = await uploadImageToFirebase(photo.uri);

      this.setState({ image: uploadURL });

      console.log("------------BEFORE: CALLING GOOGLE API--------------");
      await this.handleOCRWithGoogleAPI();
      await this.handleParseAPIResponse();

      console.log("------------AFTER: CALLING GOOGLE API--------------");

      this.props.navigation.push('AddPhotoEntryModal', {photoURI: this.state.image, total: this.state.receiptTotal, data: this.state.data, parsedTotals: this.state.parsedTotals})

    }
  };

  handlePickPhotoFromAlbum = async () => {
      let photo = await ImagePicker.launchImageLibraryAsync({
        allowsEditing: true,
        aspect: [5, 2],
      });

      console.log(photo);
      console.log(photo.uri);

      if (!photo.cancelled) {
        await this.setState({ loading: true, });

        const uploadURL = await uploadImageToFirebase(photo.uri);

        await this.setState({ image: uploadURL, });

        this.renderLoading();

        console.log("------------BEFORE: CALLING GOOGLE API--------------");
        await this.handleOCRWithGoogleAPI();
        await this.handleParseAPIResponse();

        console.log("------------AFTER: CALLING GOOGLE API--------------");
        await this.setState({loading: false});
        this.props.navigation.push('AddPhotoEntryModal', {photoURI: this.state.image, total: this.state.receiptTotal, data: this.state.data, parsedTotals: this.state.parsedTotals})
      }
  };

  handleOCRWithGoogleAPI = async () => {
    console.log("------------START: CALLING GOOGLE API--------------");

    try {
      console.log("---------------PRINTING THIS.STATE.IMAGE-----------------");
      console.log(this.state.image);

      let body = JSON.stringify({
        requests: [
          {
            features: [
              {type: "TEXT_DETECTION", maxResults: 5},
            ],
            image: {
              source: {
                imageUri: this.state.image
              }
            }
          }
        ]});

      console.log("----------------------LOGGING STRINGIFY BODY---------------------");
      console.log(body);

      let response = await fetch(
          "https://vision.googleapis.com/v1/images:annotate?key=" + Environment["GOOGLE_CLOUD_VISION_API_KEY"],
          {
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json"
            },
            method: "POST",
            body: body
          }
      );

      let responseToJson = await response.json();

      await this.setState({
        apiResponse: responseToJson,
      });

    } catch (error) {
      console.log(error);
    }

    console.log("------------FINISH: CALLING GOOGLE API--------------");
  };

  handleParseAPIResponse = async () => {
    const response = this.state.apiResponse.responses;
    if (this.state.apiResponse && this.state.apiResponse.length !== 0 && this.state.apiResponse.responses && this.state.apiResponse.responses.length !== 0) {
      console.log("----------------------LOGGING FIRST DESCRIPTION IN RESPONSE TEXTANNOTATIONS---------------------");
      console.log(this.state.apiResponse.responses[0].textAnnotations[0].description);

      const description = this.state.apiResponse.responses[0].textAnnotations[0].description;
      const parseTotal = description.match(/[0-9]+\.[0-9]*/gm);
      console.log("LOGGING PARSE DATA");
      console.log(parseTotal);
      parseTotal.sort();
      parseTotal.reverse();
      const receiptTotal = parseTotal[0];

      await this.setState({
          receiptTotal: receiptTotal,
          data: description,
          parsedTotals: parseTotal,
        })
    }
  };

  renderLoading = () => {
    console.log("in renderLoading");
    if (this.state.loading) {
      return (
          <View style={styles.loading}>
            <ActivityIndicator color="white" size="large"/>
          </View>
      );
    }
  };

  render() {
    return (
        <View style={styles.container}>
            <TouchableOpacity
                onPress={() => this.props.navigation.push('AddModal',)}
                style={{justifyContent: 'center', alignItems: 'center',}}
            >
              <Text style={{color: 'gray', marginBottom: 8, fontSize: 14}}> Manual entry: Enter spendings info yourself </Text>
                <Image source={require('../resources/Manual_Icon.png')}
                       style={{marginBottom: 20, height: 150, width: 150,}}
                />
            </TouchableOpacity>

            <TouchableOpacity
                onPress={this.handleTakePhotoWithCamera}
                style={{justifyContent: 'center', alignItems: 'center',}}
            >
              <Text style={{color: 'gray', fontSize: 14}}> Camera entry: Take a photo of your receipt </Text>
                <Image source={require('../resources/Camera_Icon.png')}
                       style={{marginBottom: 20, height: 150, width: 150,}}
                />
            </TouchableOpacity>

            <TouchableOpacity
                onPress={this.handlePickPhotoFromAlbum}
                style={{justifyContent: 'center', alignItems: 'center',}}
            >
              <Text style={{color: 'gray', fontSize: 14}}> Picture entry: Select a photo from your phone </Text>
                <Image source={require('../resources/Photos_Icon.png')}
                       style={{marginBottom: 20, height: 150, width: 150,}}
                />
            </TouchableOpacity>
          {this.renderLoading()}
        </View>
    );
  }
}

/**
 * Takes a local image, uploads it to Firebase, and returns a Firebase URL.
 * @param uri This is the local uri to the photo.
 * @returns {Promise<any>}
 */
async function uploadImageToFirebase(uri) {

  console.log("in uploadImageAsync");
  // Why are we using XMLHttpRequest? See:
  // https://github.com/expo/expo/issues/2402#issuecomment-443726662
  const blob = await new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.onload = function() {
      resolve(xhr.response);
    };
    xhr.onerror = function(e) {
      console.log(e);
      reject(new TypeError("Network request failed"));
    };
    xhr.responseType = "blob";
    xhr.open("GET", uri, true);
    xhr.send(null);
  });

  const ref = firebase
      .storage()
      .ref()
      .child(uuid.v4());
  const snapshot = await ref.put(blob);

  // We're done with the blob, close and release it
  blob.close();

  return await snapshot.ref.getDownloadURL();
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 10,
    backgroundColor: 'rgba(255, 235, 153, 0.5)',
    borderColor: 'black',
  },
  loading: {
    ...StyleSheet.absoluteFill,
    backgroundColor: "rgba(0,0,0,0.4)",
    alignItems: "center",
    justifyContent: "center"
  }
});
