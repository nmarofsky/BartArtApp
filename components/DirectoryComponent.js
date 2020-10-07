import React, { Component } from 'react';
import { View, FlatList, Text } from 'react-native';
import { Tile } from 'react-native-elements';
import { connect } from 'react-redux';
import { baseUrl } from '../shared/baseUrl';
import Loading from './LoadingComponent';
import * as Animatable from 'react-native-animatable';

const mapStateToProps = state => {
    return {
        paintings: state.paintings
    };
};

class Directory extends Component {

    static navigationOptions = {
        title: 'Bartwork'
    };

    render() {
        const { navigate } = this.props.navigation;
        const renderDirectoryItem = ({item}) => {
            return (
                <Animatable.View animation='fadeInRightBig' duration={2000}>
                    <Tile
                        title={item.name}
                        caption={item.description}
                        featured
                        onPress={() => navigate('PaintingInfo', { paintingId: item.id })}
                        imageSrc={{uri: baseUrl + item.image}}
                    />
                </Animatable.View>
            );
        };

        if (this.props.paintings.isLoading) {
            return <Loading />;
        }
        if (this.props.paintings.errMess) {
            return (
                <View>
                    <Text>{this.props.paintings.errMess}</Text>
               </View>
            );
        }
        return (
            <FlatList       
                data={this.props.paintings.paintings}
                renderItem={renderDirectoryItem}
                keyExtractor={item => item.id.toString()}
            />
        );
    }
}

export default connect(mapStateToProps)(Directory);