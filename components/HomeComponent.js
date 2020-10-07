import React, { Component } from 'react';
import { View, Text, ScrollView, Image } from 'react-native';
import { Tile, Card } from 'react-native-elements';
import { connect } from 'react-redux';
import Loading from './LoadingComponent';
import { Block, theme } from 'galio-framework';
import * as Animatable from 'react-native-animatable';

const mapStateToProps = state => {
    return {
        paintings: state.paintings,
        promotions: state.promotions,
        partners: state.partners
    };
};

function RenderItem(props) {
    const {item} = props;

    if (props.isLoading) {
        return <Loading />;
    }
    if (props.errMess) {
        return (
            <View>
                <Text>{props.errMess}</Text>
            </View>
        );
    }
    if (item) {
        return (
            <Block flex>
                <Tile
                    imageSrc={require('./images/logo_transparent.png')}>
                </Tile>
            </Block>
        );
    }
    return <View />;
}

class Home extends Component {

    static navigationOptions = {
        title: 'Home'
    }

    render() {
        return (
            <ScrollView>
                <Animatable.View animation='fadeInDown' duration={2000}>
                    <RenderItem
                        item={this.props.paintings.paintings.filter(painting => painting.featured)[0]}
                        isLoading={this.props.paintings.isLoading}
                        errMess={this.props.paintings.errMess}
                    />
                    <Card title={'Upcoming Event'}>
                        <Text
                            wrapperStyle={{margin: 20}}>
                            When: September 12th, 2020 4:00 - 8:00pm / September 13th, 2020 12:00 - 7:00pm
                        </Text>
                        <Text>
                            Where: Chez Mansion de moi
                        </Text>
                        <Text>
                            Theme: BACK TO THE GARDEN
                        </Text>
                    </Card>
                </Animatable.View>
            </ScrollView>
        );
    }
}

export default connect(mapStateToProps)(Home);