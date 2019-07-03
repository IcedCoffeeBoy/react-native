import {
    Platform,
} from 'react-native';
import ImagePicker from 'react-native-image-picker';
import firebase from 'firebase';
import Firebase from '../../firebase/Firebase'
import RNFetchBlob from 'react-native-fetch-blob';

// Blob support
const Blob = RNFetchBlob.polyfill.Blob;
const fs = RNFetchBlob.fs
window.XMLHttpRequest = RNFetchBlob.polyfill.XMLHttpRequest;
window.Blob = Blob;

export const uploadImage = (uri, path = 'users/' + firebase.auth().currentUser.uid + '/profile', mime = 'application/octet-stream') => {
    return new Promise((resolve, reject) => {
        let uploadUri = Platform.OS === 'ios' ? uri.replace('file://', '') : uri
        let uploadBlob = null
        let imageRef = firebase.storage().ref().child('images/' + path);

        fs.readFile(uploadUri, 'base64')
            .then((data) => {
                return Blob.build(data, { type: `${mime};BASE64` })
            })
            .then((blob) => {
                uploadBlob = blob
                return imageRef.put(blob, { contentType: mime })
            })
            .then(() => {
                uploadBlob.close()
                return imageRef.getDownloadURL()
            })
            .then((url) => {
                resolve(url)
            })
            .catch((error) => {
                console.log(error)
                alert(error)
                reject(error)
            })
    })
}

export const getImage = (title = "Select Profile Picture") => {
    return new Promise((resolve, reject) => {
        var options = {
            title: title,
            storageOptions: {
                skipBackup: true,
                path: 'images'
            },
            maxWidth:200,
        };
        ImagePicker.showImagePicker(options, (response) => {
            console.log('Response = ', response);
            if (response.didCancel) {
                console.log('User cancelled image picker');
                reject(response.didCancel);
            } else if (response.error) {
                console.log('ImagePicker Error: ', response.error);
                reject(response.error);
            } else {
                resolve(response.uri);
            }
        });
    })
}

export const getImageFromLibrary = (title = "Select Image") => {
    return new Promise((resolve, reject) => {
        var options = {
            title: title,
            storageOptions: {
                skipBackup: true,
                path: 'images'
            },
            maxWidth:200,
        };
        ImagePicker.launchImageLibrary(options, (response) => {
            console.log('Response = ', response);
            if (response.didCancel) {
                console.log('User cancelled image picker');
                reject(response.didCancel);
            } else if (response.error) {
                console.log('ImagePicker Error: ', response.error);
                reject(response.error);
            } else {
                resolve(response.uri);
            }
        });
    })
}

export const getUserProfilePic = () => {
    return new Promise((resolve, reject) => {
        let userPath = "images/" + firebase.auth().currentUser.uid;
        let downloadRef = firebase.storage().ref(userPath).child("profile");
        downloadRef.getDownloadURL()
            .then((url) => {
                resolve(url);
            })
            .catch((error) => {
                switch (error.code) {
                    case 'storage/object_not_found':
                        break;
                    case 'storage/unauthorized':
                        reject(error.code);
                        Alert.alert("Proffer", "User doesn't have permission to access the object.");
                        break;
                    case 'storage/canceled':
                        // User canceled the upload
                        break;
                    case 'storage/unknown':
                        reject(error.code);
                        Alert.alert("Proffer", "Unexpected error has occurred.");
                        break;
                }
            });
    });
}

export const downloadImage = (path) => {
    return new Promise((resolve, reject) => {
        let downloadRef = firebase.storage().ref(path);
        downloadRef.getDownloadURL()
            .then((url) => {
                resolve(url);
            })
            .catch((error) => {
                reject(error.code);
                switch (error.code) {
                    case 'storage/object-not-found':
                        break;
                    case 'storage/unauthorized':
                       
                        Alert.alert("Proffer", "User doesn't have permission to access the object.");
                        break;
                    case 'storage/canceled':
                        // User canceled the upload
                        break;
                    case 'storage/unknown':
                        Alert.alert("Proffer", "Unexpected error has occurred.");
                        break;
                }
            });
    });
}

export const deleteImage = (path) => {
    return new Promise((resolve, reject) => {
        let downloadRef = firebase.storage().ref(path);
        downloadRef.getDownloadURL()
            .then((url) => {
                // URL Exists, can delete
                resolve(downloadRef.delete())
            })
            .catch((error) => {
                // For some reason cannot delete, so just ignore
                reject(error.code);
                switch (error.code) {
                    case 'storage/object-not-found':
                        break;
                    case 'storage/unauthorized':
                       
                        Alert.alert("Proffer", "User doesn't have permission to access the object.");
                        break;
                    case 'storage/canceled':
                        // User canceled the upload
                        break;
                    case 'storage/unknown':
                        Alert.alert("Proffer", "Unexpected error has occurred.");
                        break;
                }
            });
    });
}