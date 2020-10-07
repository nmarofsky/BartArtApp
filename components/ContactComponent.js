import React, { Component } from 'react';
import { ScrollView, Text} from 'react-native';
import { Card, Button, Icon } from 'react-native-elements';
import * as Animatable from 'react-native-animatable';
import * as MailComposer from 'expo-mail-composer';

class Contact extends Component {

    static navigationOptions = {
        title: 'Contact Us'
    }

    sendMail() {
        MailComposer.composeAsync({
            recipients: ['bartart@gmail.com'],
            subject: 'Inquiry',
            body: 'To whom it may concern:'
        })
    }

    render() {
        return (
            <ScrollView>
                <Animatable.View animation='fadeInDown' duration={2000} delay={1000}>
                    <Card
                    title={'Contact Infomation'}>
                        <Text
                            wrapperStyle={{margin: 20}}>
                            1 Bart Way
                        </Text>
                        <Text>
                            Rehobeth Beach, DE 19958
                        </Text>
                        <Text
                            style={{marginBottom: 10}}>
                            U.S.A.
                        </Text>
                        <Text>
                            Phone: (717) 451-8742
                        </Text>
                        <Text>
                            Email: bartart@gmail.com
                        </Text>
                        <Button
                            title="Send Email"
                            buttonStyle={{backgroundColor: '#dab3e0', margin: 40}}
                            icon={<Icon
                                name='envelope-o'
                                type='font-awesome'
                                color='#fff'
                                iconStyle={{marginRight: 10}}
                            />}
                            onPress={() => this.sendMail()}
                        />
                    </Card>
                </Animatable.View>
            </ScrollView>
        );
    }
}

export default Contact;