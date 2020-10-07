import React, { Component } from 'react';
import { Text, View, ScrollView, FlatList, Modal, Button, StyleSheet, Alert, PanResponder, Share } from 'react-native';
import { Card, Icon, Rating, Input } from 'react-native-elements';
import { connect } from 'react-redux';
import { baseUrl } from '../shared/baseUrl';
import { postFavorite, postComment, postCart } from '../redux/ActionCreators';
import * as Animatable from 'react-native-animatable';

const mapStateToProps = state => {
    return {
        paintings: state.paintings,
        comments: state.comments,
        favorites: state.favorites,
        carts: state.carts
    };
};

const mapDispatchToProps = {
    postFavorite: paintingId => (postFavorite(paintingId)),
    postCart: paintingId => (postCart(paintingId)),
    postComment: (paintingId, rating, author, text) =>(postComment(paintingId, rating, author, text))
};

function RenderPainting(props) {

    const {painting} = props;

    const view = React.createRef();

    const recognizeDrag = ({dx}) => (dx < -200) ? true : false;

    const recognizeComment = ({dx}) => (dx > 200) ? true : false;

    const panResponder = PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onPanResponderGrant: () => {
            view.current.rubberBand(1000)
            .then(endState => console.log(endState.finished ? 'finished' : 'canceled'));
        },
        onPanResponderEnd: (e, gestureState) => {
            console.log('pan responder end', gestureState);
            if (recognizeDrag(gestureState)) {
                Alert.alert(
                    'Add Favorite',
                    'Are you sure you wish to add ' + painting.name + ' to favorites?',
                    [
                        {
                            text: 'Cancel',
                            style: 'cancel',
                            onPress: () => console.log('Cancel Pressed')
                        },
                        {
                            text: 'OK',
                            onPress: () => props.favorite ?
                                console.log('Already set as a favorite') : props.markFavorite()
                        }
                    ],
                    { cancelable: false }
                );
            }
            else if (recognizeComment(gestureState)) {
                props.onShowModal() 
            }
        }
    });

    const sharePainting = (title, message, url) => {
        Share.share({
            title: title,
            message: `${title}: ${message} ${url}`,
            url: url
        },{
            dialogTitle: 'Share ' + title
        });
    };
    
    if (painting) {
        return (
            <Animatable.View animation='fadeInDown' duration={2000} delay={1000} ref={view} {...panResponder.panHandlers}>
                <Card
                    featuredTitle={painting.name}
                    image={{uri: baseUrl + painting.image}}>
                    <Text style={{margin: 10}}>
                        {painting.description}
                    </Text>
                    <View style={styles.cardRow}>
                        <Icon
                            name={props.favorite ? 'heart' : 'heart-o'}
                            type='font-awesome'
                            color='#FF0000'
                            raised
                            reverse
                            onPress={() => props.favorite ? 
                                console.log('Already set as a favorite') : props.markFavorite()}
                        />
                        <Icon
                            name={'pencil'}
                            type='font-awesome'
                            color='#00FF66'
                            raised
                            reverse
                            onPress={() => props.onShowModal()}
                            style={styles.cardItem}
                        />
                        <Icon
                            name={'share'}
                            type='font-awesome'
                            color='#99CCFF'
                            style={styles.cardItem}
                            raised
                            reverse
                            onPress={() => sharePainting(painting.name, painting.description, baseUrl + painting.image)} 
                        />
                        <Icon
                            name='shopping-cart'
                            type='font-awesome'
                            color='#FFD700'
                            style={styles.cardItem}
                            raised
                            reverse
                            onPress={() => props.markCart()} 
                        />
                    </View>
                </Card>
            </Animatable.View>
        );
    }
    return <View />;
}

function RenderComments({comments}) {

    const renderCommentItem = ({item}) => {
        return (
            <View style={{margin: 10}}>
                <Text style={{fontSize: 14}}>{item.text}</Text>
                <Rating
                    readonly
                    startingValue={item.rating}
                    imageSize={10}
                    style={{paddingVertical: '5%', alignItems: 'flex-start'}}
                />
                <Text style={{fontSize: 12}}>{`-- ${item.author}, ${item.date}`}</Text>
            </View>
        );
    };

    return (
        <Animatable.View animation='fadeInUp' duration={2000} delay={1000}>
            <Card title='Comments'>
                <FlatList
                    data={comments}
                    renderItem={renderCommentItem}
                    keyExtractor={item => item.id.toString()}
                />
            </Card>
        </Animatable.View>
    );
}

class PaintingInfo extends Component {

    constructor(props) {
        super(props);
        this.state = {
            showModal: false,
            rating: '5',
            author: '',
            text: ''
        };
    }

    markCart(paintingId) {
        this.props.postCart(paintingId);
    }
    
    toggleModal() {
        this.setState({showModal: !this.state.showModal});
    }

    handleComment(paintingId) {
        this.props.postComment(paintingId, this.state.rating, this.state.author, this.state.text);
        this.toggleModal();
    }

    resetForm() {
        this.setState({
            showModal: false,
            rating: '5',
            author: '',
            text: ''
        });
    }
    
    markFavorite(paintingId) {
        this.props.postFavorite(paintingId);
    }

    static navigationOptions = {
        title: 'Painting Information'
    };

    render() {
        const paintingId = this.props.navigation.getParam('paintingId');
        const painting = this.props.paintings.paintings.filter(painting => painting.id === paintingId)[0];
        const comments = this.props.comments.comments.filter(comment => comment.paintingId === paintingId);
        return (
            <ScrollView>
                <RenderPainting painting={painting}
                    favorite={this.props.favorites.includes(paintingId)}
                    markFavorite={() => this.markFavorite(paintingId)}
                    onShowModal={() => this.toggleModal()}
                    cart={this.props.carts.includes(paintingId)}
                    markCart={() => this.markCart(paintingId)}
                />
                <RenderComments comments={comments} />
                <Modal
                    animationType={'slide'}
                    transparent={false}
                    visible={this.state.showModal}
                    onRequestClose={() => this.toggleModal()}>
                    <View style={styles.modal}>
                        <Rating
                            showRating
                            startingValue={5}
                            imageSize={40}
                            onFinishRating={(rating)=>this.setState({rating: rating})} 
                            style={{paddingVertical: 10}}
                        />
                        <Input
                            placeholder='Your Name'
                            leftIcon={{type: 'font-awesome', name: 'user-o'}}
                            leftIconContainerStyle={{paddingRight: 10}}
                            onChangeText={author => this.setState({ author: author })}
                            value={this.state.author}               
                        />
                        <Input
                            placeholder='What Do You Think?'
                            leftIcon={{type: 'font-awesome', name: 'comment-o'}}
                            leftIconContainerStyle={{paddingRight: 10}}
                            onChangeText={comment => this.setState({ text: comment })}
                            value={this.state.text}
                        />
                        <View style={{margin: 10}}>
                            <Button
                                onPress={() => {
                                    this.handleComment(paintingId);
                                    this.resetForm();
                                }}
                                color='#dab3e0'
                                title='Submit'
                            />
                        </View>
                        <View style={{margin: 10}}>
                            <Button
                                onPress={() => {
                                    this.toggleModal();
                                    this.resetForm();
                                }}
                                color='#808080'
                                title='Cancel'
                            />
                        </View>
                    </View>
                </Modal>
            </ScrollView>
        );
    }
}

const styles = StyleSheet.create({
    cardRow: {
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
        flexDirection: 'row',
        margin: 20
    },
    cardItem: {
        flex: 1,
        margin: 10
    },
    modal: { 
        justifyContent: 'center',
        margin: 20
    }
});

export default connect(mapStateToProps, mapDispatchToProps)(PaintingInfo);