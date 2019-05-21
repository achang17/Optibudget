import React from 'react';
import { Button, FlatList, AsyncStorage, ScrollView, StyleSheet, Text, TouchableOpacity, View, } from 'react-native';
import {NavigationEvents} from "react-navigation";
import {ListItem} from "react-native-elements";

export default class ViewSpendingScreen extends React.Component {
  static navigationOptions = {
    title: 'View Your Spending History',
  };

  constructor() {
    super();

    this.state = {
    }
  }

  getAllStoredData = async () => {
    console.log("in getAllStoredData in ViewSpendingScreen.js Line 18");

    let keys = {};
    let data = {};

    try {
      keys = await AsyncStorage.getAllKeys();
      data = await AsyncStorage.multiGet(keys);

      console.log("KEYS");
      console.log(keys);

      console.log("Logging data line 27 of ViewSpendingScreen.js");
      console.log(data);

      if (data.length !== 0) {
        console.log("data");
        console.log(data[0]);

        console.log("log parse data");
        console.log(JSON.parse(data[0][1]));
        data = JSON.parse(data[0][1]);
        await this.setState({
          data: data,
        });

        console.log(this.state.data);
      }

      // console.log("logging parsed data line 30");
      // console.log(JSON.parse(data));

      //      console.log(JSON.parse(data));
      //await this.setState({data: keys});
    }
    catch(e) {
      // read key error
    }

    console.log("logging keys");
    console.log(keys);
    // example console.log result:
    // ['@MyApp_user', '@MyApp_key']
  };

  handleDelete = async () => {
      console.log("-------PRINTING KEYS BEFORE DELETE-------------");
      const keys = await AsyncStorage.getAllKeys();
      console.log(keys);

      try {
          await AsyncStorage.removeItem('spendings-data');
          console.log("-------PRINTING KEYS AFTER DELETE-------------");
          const keysAfterDelete = await AsyncStorage.getAllKeys();
          console.log(keyAfterDelete);
          return true;
      }
      catch(exception) {
          return false;
      }

  };

  render() {

      if (this.state.data && this.state.data.length !== 0) {
          const data = this.state.data;
          console.log(data);
          const rev_data = data.reverse();
          console.log(rev_data);
      }

      return (
        <View style={styles.container}>
          <NavigationEvents
              onWillFocus={
                (payload) => {
                  this.getAllStoredData();
                }
              }
          />
          <Text>Your Spending History</Text>
            <View style={{backgroundColor: 'indianred', borderRadius: 5, paddingHorizontal: 10, alignSelf: 'stretch', justifyContent: 'center', marginTop: 10, marginBottom: 10,}}>
                <Button title="DELETE ALL"
                        color="white"
                        onPress={() => this.handleDelete()}
                />
            </View>
          <FlatList
              style={styles.listEntry}
              data={(this.state.data)}
              renderItem={( {item} ) => (
                  <TouchableOpacity>
                    <ListItem
                        title={item.title}
                        subtitle={item.category}
                        style={styles.listEntry}
                        rightElement={<Text>${item.amount}</Text>}
                    />
                  </TouchableOpacity>
              )}
              keyExtractor={(item, index) => index.toString()}
          />
        </View>

    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 15,
    backgroundColor: 'rgba(255, 235, 153, 0.5)',
  },
  listEntry: {
    borderRadius: 5,
    borderColor: 'silver',
    borderWidth: 0.5,
  },
});
