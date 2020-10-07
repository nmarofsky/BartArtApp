import React, { Component } from 'react';
import { Text, View, ScrollView, StyleSheet, Picker, Switch, Button, Alert } from 'react-native';
import DatePicker from 'react-native-datepicker';
import * as Animatable from 'react-native-animatable';
import * as Permissions from 'expo-permissions';
import { Notifications } from 'expo';

class Reservation extends Component {

    constructor(props) {
        super(props);

        this.state = {
            painters: 1,
            legalAge: false,
            date: '',
            showModal: false
        };
    }

    static navigationOptions = {
        title: 'Reserve A Lesson'
    }

    toggleModal() {
        this.setState({showModal: !this.state.showModal});
    }

    handleReservation() {
        console.log(JSON.stringify(this.state));
        this.toggleModal();
    }

    resetForm() {
        this.setState({
            painters: 1,
            legalAge: false,
            date: '',
            showModal: false
        });
    }

    async obtainNotificationPermission() {
        const permission = await Permissions.getAsync(Permissions.USER_FACING_NOTIFICATIONS);
        if (permission.status !== 'granted') {
            const permission = await Permissions.askAsync(Permissions.USER_FACING_NOTIFICATIONS);
            if (permission.status !== 'granted') {
                Alert.alert('Permission not granted to show notifications');
            }
            return permission;
        }
        return permission;
    }

    async presentLocalNotification(date) {
        const permission = await this.obtainNotificationPermission();
        if (permission.status === 'granted') {
            Notifications.presentLocalNotificationAsync({
                title: 'Your Lesson Reservation Search',
                body: 'Search for ' + date + ' requested'
            });
        }
    }
    
    render() {
        return (
            <ScrollView>
                <Animatable.View animation='zoomIn' duration={2000} delay={1000}>
                    <View style={styles.formRow}>
                        <Text style={styles.formLabel}>Number of Painters</Text>
                        <Picker
                            style={styles.formItem}
                            selectedValue={this.state.painters}
                            onValueChange={itemValue => this.setState({painters: itemValue})}>
                            <Picker.Item label='1' value='1' />
                            <Picker.Item label='2' value='2' />
                            <Picker.Item label='3' value='3' />
                            <Picker.Item label='4' value='4' />
                            <Picker.Item label='5' value='5' />
                            <Picker.Item label='6' value='6' />
                            <Picker.Item label='7' value='7' />
                            <Picker.Item label='8' value='8' />
                        </Picker>
                    </View>
                    <View style={styles.formRow}>
                        <Text style={styles.formLabel}>Are you old enough to drink?</Text>
                        <Switch
                            style={styles.formItem}
                            value={this.state.legalAge}
                            trackColor={{true: '#5637DD', false: null}}
                            onValueChange={value => this.setState({legalAge: value})}>
                        </Switch>
                    </View>
                    <View style={styles.formRow}>
                        <Text style={styles.formLabel}>Date</Text>
                        <DatePicker
                            style={{flex: 2, marginRight: 20}}
                            date={this.state.date}
                            format='YYYY-MM-DD'
                            mode='date'
                            placeholder='Select Date'
                            minDate={new Date().toISOString()}
                            confirmBtnText='Confirm'
                            cancelBtnText='Cancel'
                            customStyles={{
                                dateIcon: {
                                    position: 'absolute',
                                    left: 0,
                                    top: 4,
                                    marginLeft: 0
                                },
                                dateInput: {
                                    marginLeft: 36
                                }
                            }}
                            onDateChange={date => {this.setState({date: date})}}
                        />
                    </View>
                    <View style={styles.formRow}>
                        <Button
                            onPress= {() => {
                                Alert.alert(
                                    'Begin Search?',
                                    'Number of Painters: ' + this.state.painters + '\n'
                                    + 'Legal Age? ' + this.state.legalAge + '\n'
                                    + 'Date: ' + this.state.date,
                                    [
                                        { 
                                            text: 'Cancel', 
                                            onPress: () => this.resetForm()
                                        },
                                        {
                                            text: 'OK',
                                            onPress: () => {
                                                this.presentLocalNotification(this.state.date);
                                                this.resetForm();
                                            }
                                        }
                                    ],
                                    { cancelable: false }
                                );
                            }
                        }
                            title='Search'
                            color='#5637DD'
                            accessibilityLabel='Tap me to search for available lessons to reserve'
                        />
                    </View>
                </Animatable.View>
            </ScrollView>
        );
    }
}

const styles = StyleSheet.create({
    formRow: {
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
        flexDirection: 'row',
        margin: 20
    },
    formLabel: {
        fontSize: 18,
        flex: 2
    },
    formItem: {
        flex: 1
    },
    modal: { 
        justifyContent: 'center',
        margin: 20
    },
    modalTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        backgroundColor: '#dab3e0',
        textAlign: 'center',
        color: '#fff',
        marginBottom: 20
    },
    modalText: {
        fontSize: 18,
        margin: 10
    }
});

export default Reservation;