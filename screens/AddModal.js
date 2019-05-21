import React from 'react';
import {AsyncStorage, FlatList, ScrollView, StyleSheet, TouchableOpacity, Text, View, Button,} from 'react-native';
import GenerateForm from 'react-native-form-builder';
import {ListItem} from "react-native-elements";


export default class AddModal extends React.Component {
    static navigationOptions = {
        title: "New Spending Entry",
    };

    constructor() {
        super();

        this.state = {
            category: "",
        }
    }

    handleStorage = async (data) => {
        try {
            var existingDataString = await AsyncStorage.getItem('spendings-data');
            console.log("Printing existing data string");
            console.log(existingDataString);

            let newData;
            if (!existingDataString) {
                console.log("IF");
                newData = [data];

                console.log("printing new data");
                console.log(newData);
                console.log("Printing existing data string");
                console.log(existingDataString);
            }else{
                console.log("else");

                console.log("EXISTINGDATASTRING");
                console.log(existingDataString);

                const existingData = JSON.parse(existingDataString);
                console.log("EXISTINGDATA");
                console.log(existingData);

                existingData.push(data);
                newData = existingData;
            }
            AsyncStorage.setItem('spendings-data', JSON.stringify(newData));

        } catch(e) {
            // save error
            console.log("Error in handleStorage()");
            console.log(e);
        }

        console.log('Done with handleStorage()');
    };

    handleSubmit = async () => {
        console.log("IN HANDLE SUBMIT LINE 24");

        if (this.refs) {
            console.log("IN ADDMODAL.JS HANDLESUBMIT FUNCTION LNE 94");
            console.log(this.formGenerator.getValues());

            const data = this.formGenerator.getValues();
            console.log("printing data");
            console.log(data.amount);
            console.log(data.category);
            if (data.amount === "") {
                data.amount = this.props.navigation.getParam("total", "0.00");
            }
            console.log("printing data after edit amount:");
            console.log(data.amount);

            await this.handleStorage(data);
            this.props.navigation.navigate('ViewSpending', {data: data});
        } else {
            console.log("Error obtaining form data");
        }
    };

    handleFillInFormTitle = async (str) => {
        this.formGenerator.setValues({"title": str});
    };

    handleFillInFormAmount = async (str) => {
        this.formGenerator.setValues({"amount": str});
    };

    render() {
        const fields = [
            {
                type: 'text',
                name: 'title',
                required: true,
                label: 'Title',
            },
            {
                type: 'number',
                name: 'amount',
                required: true,
                label: this.props.navigation.getParam("total", "Amount"),
            },
            {
                type: 'picker',
                name: 'category',
                mode: 'dialog',
                label: 'Select a Category...',
                defaultValue: '',
                options: ['Groceries', 'Bills', 'Dining Out', 'Shopping'],
            },
        ];

        let data = this.props.navigation.getParam("data", []);
        if (data.length !== 0) {
            data = data.split("\n");
            console.log("split data by newline");
            console.log(data);

            data = data.slice(0,5);
            console.log("slice data to 5 entries");
            console.log(data);
        }

        let parsedTotals = this.props.navigation.getParam("parsedTotals", ["1"]);
        console.log("printing parsedTotals in AddModal");
        console.log(parsedTotals);
        parsedTotals = parsedTotals.filter((val,id,array) => array.indexOf(val) == id);

        if (parsedTotals.length !== 0) {
            parsedTotals = parsedTotals.slice(0,5);
            console.log("slice data to 5 entries");
            console.log(parsedTotals);
        }

        return (
            <View style={styles.container}>
                <ScrollView>
                <View styles={{flex: 1, }}>
                    <GenerateForm
                        ref={(c) => {
                            this.formGenerator = c;
                        }}
                        fields={fields}
                    />

                    <View style={{paddingHorizontal: 5, backgroundColor: 'rgba(255, 204, 0, 0.25)', borderRadius: 15, flex: 1, marginTop: 5, marginBottom: 5,}}>
                        <Text style={styles.parseContainer}> Possible Titles We See: </Text>
                        { this.props.navigation.getParam("data") && this.props.navigation.getParam("data").length !== 0 &&
                            <View>
                                {data.map(item => <TouchableOpacity onPress={() => this.handleFillInFormTitle(item)} key={item}><Text
                                    key={item} style={{marginBottom: 8, marginLeft: 10,}}> {item} </Text></TouchableOpacity>)}
                            </View>
                        }
                    </View>

                    <View style={{paddingHorizontal: 5, backgroundColor: 'rgba(255, 204, 0, 0.5)', borderRadius: 15, flex: 1, marginTop: 5, marginBottom: 5,}}>
                        <Text style={styles.parseContainer}> Possible Total Amounts We See: </Text>
                        { this.props.navigation.getParam("parsedTotals") && this.props.navigation.getParam("parsedTotals").length !== 0 &&
                        <View>
                            {parsedTotals.map((item, _idx) => <TouchableOpacity onPress={() => this.handleFillInFormAmount(item)} key={_idx}>
                                <Text style={{marginBottom: 8, marginLeft: 10,}}> {item} </Text>
                            </TouchableOpacity>)}
                        </View>
                        }
                    </View>  

                    <View style={{backgroundColor: 'rgb(255, 204, 0)', borderRadius: 5, paddingHorizontal: 10, alignSelf: 'stretch', justifyContent: 'center', marginBottom: 25}}>

                        <Button title="Add Spending"
                                color="white"
                                onPress={() => this.handleSubmit()}
                        />
                    </View>
                </View>
                </ScrollView>
            </View>
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
    parseContainer: {
        fontSize: 20,
        fontWeight: 'bold',
        marginTop: 5,
    }
});
