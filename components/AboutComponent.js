import React, { Component } from 'react';
import { ScrollView, Text, FlatList, Image, View, StyleSheet } from 'react-native';
import { Card, ListItem } from 'react-native-elements';
import { connect } from 'react-redux';
import { baseUrl } from '../shared/baseUrl';
import Loading from './LoadingComponent';
import * as Animatable from 'react-native-animatable';

const mapStateToProps = state => {
    return {
      partners: state.partners
    };
};

class About extends Component {

    static navigationOptions = {
        title: 'About Dan'
    }

    render() {
        const renderPartner = ({ item }) => {
            return (
                <ListItem
                    title={item.name}
                    subtitle={item.description}
                    leftAvatar={{source: {uri: baseUrl + item.image}}}
                />
            );
        };

        if (this.props.partners.isLoading) {
            return (
                <ScrollView>
                    <Mission />
                    <Card
                        title='Community Partners'>
                        <Loading />
                    </Card>
                </ScrollView>
            );
        }
        if (this.props.partners.errMess) {
            return (
                <ScrollView>
                    <Animatable.View animation='fadeInDown' duration={2000} delay={1000}>
                        <Mission />
                        <Card
                            title='Community Partners'>
                            <Text>{this.props.partners.errMess}</Text>
                        </Card>
                    </Animatable.View>
                </ScrollView>
            );
        }
            return (
                <ScrollView>
                    <Animatable.View animation='fadeInDown' duration={2000} delay={1000}>
                        <Mission />
                        <Card title="Community Partners">
                            <FlatList
                                data={this.props.partners.partners}
                                renderItem={renderPartner}
                                keyExtractor={item => item.id.toString()}
                            />
                        </Card>
                    </Animatable.View>
                </ScrollView>
            );
        }
    }

        function Mission() {
            return (
              <Card title="The Great Repair" wrapperStyle={{ margin: 20 }}>
                <Text>
                    Bartasavich’s multiyear project is focused on inspirations from found objects. He sees new life for items found on beach cleanups or bound for the trash.
                </Text>
                <Text>
                    Kintsugi is the Japanese art of putting broken pottery back together. Bartasavich uses this idea, along with his love of materials, to embrace their flaws and imperfections. He believes that with this metaphor, a person can create an even stronger, more beautiful piece of art.
                </Text>
                <View style={styles.container}>
                    <Image source={require('./images/DanBart.jpg')} style={{borderRadius: 110}} />
                </View>
              </Card>
            )
          }

          const styles = StyleSheet.create({
            container: {
              paddingTop: 35,
              paddingLeft: 25
            },
          });

export default connect(mapStateToProps)(About);