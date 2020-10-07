import React, { Component } from 'react';
import { FlatList, View, Text } from 'react-native';
import { ListItem } from 'react-native-elements';
import { connect } from 'react-redux';
import { Loading } from './LoadingComponent';
import { baseUrl } from '../shared/baseUrl';
import Swipeout from 'react-native-swipeout';
import { deleteCart } from '../redux/ActionCreators';

const mapStateToProps = state => {
    return {
        paintings: state.paintings,
        carts: state.carts
    };
};

const mapDispatchToProps = {    
    deleteCart: paintingId => (deleteCart(paintingId))
};

class ShoppingCart extends Component {

    static navigationOptions = {
        title: 'My Shopping Cart'
    }

    render() {
        const { navigate } = this.props.navigation;
        const renderCartItem = ({item}) => {
            const rightButton = [
                {
                    text: 'Delete',
                    type: 'delete',
                    onPress: () => this.props.deleteCart(item.id)
                }
            ];

            return (
                <Swipeout right={rightButton} autoClose={true}>
                    <ListItem
                        title={item.name}
                        subtitle={item.price}
                        leftAvatar={{source: {uri: baseUrl + item.image}}}
                        onPress={() => navigate('PaintingInfo', {paintingId: item.id})}
                    />
                </Swipeout>
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
                data={this.props.paintings.paintings.filter(
                    painting => this.props.carts.includes(painting.id)
                )}
                renderItem={renderCartItem}
                keyExtractor={item => item.id.toString()}
            />
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ShoppingCart);