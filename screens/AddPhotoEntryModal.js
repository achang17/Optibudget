import React from 'react';
import {AsyncStorage, Image, ScrollView, StyleSheet, TouchableOpacity, Text, View, Button,} from 'react-native';

export default class AddModal extends React.Component {
    static navigationOptions = {
        title: "New Receipt Spending Entry",
    };

    constructor() {
        super();

        this.state = {
            category: "",
            photoURI: "",
        }
    }

    componentDidMount() {
        this.setState({
            photoUri: this.props.navigation.getParam('photoURI', '____DEFAULT_PHOTO_URI____'),
        })
    }

    render() {
        return (
            <ScrollView style={styles.container}>
                <View>
                    {console.log("------------------GETTING PARAMS-------------------------")}
                    {console.log(this.props.navigation.getParam("photoURI"))}

                    <View style={{justifyContent: 'center', alignItems: 'center',}}>
                        <Text> This is the photo receipt selected: </Text>
                        <Image source={{uri: this.props.navigation.getParam("photoURI")}}
                               style={{marginBottom: 20, height: 300, width: 300,}}
                        />
                        <Text> The total spending amount we parsed is: {this.props.navigation.getParam("total")}</Text>

                        <Text> Is this amount correct?</Text>
                        <View style={styles.button}>
                            <Button title="Yes"
                                    color="white"
                                    onPress={() => this.props.navigation.push("AddModal", {total: this.props.navigation.getParam("total"), data: this.props.navigation.getParam("data", ["1"]),parsedTotals: this.props.navigation.getParam("parsedTotals", ["1"])})}
                            />
                        </View>
                        <View style={styles.button}>
                            <Button title="No"
                                    color="white"
                                    onPress={() => this.props.navigation.push("AddModal", {data: this.props.navigation.getParam("data", ["1"]), parsedTotals: this.props.navigation.getParam("parsedTotals", ["1"])})}
                            />

                        </View>
                    </View>
                </View>
            </ScrollView>

        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 15,
        backgroundColor: 'rgb(255,255,255)',
        paddingHorizontal: 10,
    },
    tagMenuContainer: {
        borderColor: 'lightgray',
        borderWidth: 1,
        borderRadius: 5,
        height: 40,
        paddingHorizontal: 10,
        marginBottom: 10,
        justifyContent: 'center'
    },
    inputIOS: {
        fontSize: 16,
        paddingVertical: 12,
        paddingHorizontal: 10,
        borderWidth: 1,
        borderColor: 'gray',
        borderRadius: 4,
        color: 'black',
        paddingRight: 30, // to ensure the text is never behind the icon
    },
    button: {
        backgroundColor: 'rgb(255, 204, 0)',
        borderRadius: 5,
        paddingHorizontal: 10,
        marginBottom: 10,
        alignSelf: 'stretch',
    },
});
