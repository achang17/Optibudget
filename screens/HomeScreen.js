import React from 'react';
import {
  Button,
  Dimensions,
  Image,
  StatusBar,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { width, height, totalSize } from 'react-native-dimension';
import { ScreenOrientation } from 'expo';

export default class HomeScreen extends React.Component {
  static navigationOptions = {
    title: "Home",
  };

  constructor () {
    super();
    this.state = {
      width: Dimensions.get("window").width,
      height: Dimensions.get("window").height,
    };
    this.onLayout = this.onLayout.bind(this);

    console.log(this.state);
  }

  componentDidMount() {
    this.handleChangeScreenOrientation();
  }

  onLayout(e) {
    this.setState({
      width: Dimensions.get('window').width,
      height: Dimensions.get('window').height,
    });
  }

  handleChangeScreenOrientation() {
    ScreenOrientation.allowAsync(ScreenOrientation.Orientation.ALL);
  }

  testRegex() {
    var str = "test/abcd{string1}test{string2}test";
    var description = "HOWDY BURGER\n625 E GREENST\nCHAMPAIGN, It 61820\n217819115\nORDER: 20\nCashier. Shalik\n12 Apr 2019 11 01:43A\nTransaction 100706\n2 Signature Burge\n$8.00\nDining Option: To Go S0.00\nSubtotal\nHooked 2 X $4\nTax\n$8.00\n$2.00\nS0 57\n$6.57\n$6.57\nTotal\nDEBIT CARD SALE\n12-Apr-2019 11:0201A\n$6.57 Method: EMV\nUS DEBIT XXXXXXXXXXXX9822\nAN CHI CHANG\nRef # 9102005710811 Auth # 110726\nMID:3889\nAID: A0000000980840\nAthNtwkNm: VISA\nRtind:CREDIT\nHow are we doing\nText \"idq/yq\" to 73752\nto send us your feedback\nOnline https/clover.com/p\n/WWM4BFW2BZG6E\nOrder 8ECG9CO7VA09R\n";

    var receipt = "<1><Brek Wrap Combo /A><-20.76>\n" +
        "<1><Bacon-wrap><3.79>\n" +
        "<1><Grilled><10.00>\n" +
        "<1><5 Pieces Bacon-wrap><0.00>\n" +
        "<1><Orange><12.40>\n" +
        "<1><Deposit><0.10>";
    //var parsed = str.match(/^\s*[0-9].*\$\K[0-9.]+/g);
    var parsed = description.match(/^(\d+)\s+(.*?)\s+\(?\$(\d+\.\d+)/gm);
    let parse2 = receipt.match(/[0-9]*\.[0-9]*/gm);
    var parsetotal = Math.max(...parse2);

    console.log("printing parse with regex:");
    console.log(parsed);
    console.log(parse2);
    console.log(parsetotal);
  }


  renderImage() {
    return (
        <Image source={require('../resources/logo.png')}
               style={{marginBottom: 20, height: 300, width: 300,}}
        />
    );
  }

  render() {
    const screenOrientation = this.state.height > this.state.width ? 'portrait' : 'landscape';

    return(
        <View onLayout={this.onLayout} style={styles.container}>
          {this.testRegex()}
            <StatusBar hidden={screenOrientation === 'landscape' ? true : false}/>
            <ScrollView>
              {this.renderImage()}
              <View style={{ alignItems: 'center', justifyContent: 'center'}}>
               <Text style={{fontSize: 25,}}> Welcome! </Text>
              </View>

              <View style={{backgroundColor: 'rgb(255, 204, 0)', textColor: 'black', borderRadius: 5, width: 300, marginTop: 20, marginBottom: 20,}}>
                <Button title="Add Spending"
                        color="white"
                        onPress={() => {this.props.navigation.navigate('AddSpending')}}
                />
              </View>

              <View style={{backgroundColor: 'rgb(255, 204, 0)', textColor: 'black', borderRadius: 5, width: 300, }}>
                <Button title="View Spending"
                        color="white"
                        onPress={() => {this.props.navigation.navigate('ViewSpending')}}
                />
              </View>
            </ScrollView>
        </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(255, 235, 153, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
