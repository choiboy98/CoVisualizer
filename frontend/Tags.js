import { StatusBar } from 'expo-status-bar';
import React, { Component } from 'react';
import { StyleSheet, TouchableOpacity, Text, View } from 'react-native';
import Tags from 'react-native-tags';
import { getTag, createTag, deleteTag } from './utility/ApiWrapper';

class Tag extends Component {

  constructor(props) {
    super(props);
    this.state = {
      initialTags: ['Infected', 'Avoid!'],
      initialText: '',
      currPath: this.props.route.params.path,
      tagIds: []
    };
  }

  async componentDidMount() {
    // getTag(null, this.state.currPath)
    result = await getTag(null, this.state.path)

    // if (result.type == "GET_TAG_SUCCESSFUL") {
    //   data = this.state.initialTags;
    //   console.log(data)
    //   this.setState({
    //     initialTags: data,
    //     tagIds : initialTags
    //   });
    // }
  }

  renderTag = ({ tag, index, onPress, deleteTagOnPress, readonly }) => {
    // console.log(tag)
    // createTag(this.state.currPath, null, tag)
    // response should object with tag id 
    // add tag -> this.state.tagIds
    //          this.setState({
    return (
      <TouchableOpacity
        key={`${tag}-${index}`}
        onPress={onPress}
        style={styles.tag}>
        <Text style={styles.textTag}>{tag}</Text>
      </TouchableOpacity>
    );
  };

  render() {
    return (
      <View style={styles.screen}>
        <Tags
          containerStyle={styles.container}
          initialText={this.state.initialText}
          textInputProps={{
            placeholderTextColor: '#D6D6D6',
            placeholder: 'Add Tag [Space to create]',
          }}
          inputStyle={styles.input}
          initialTags={this.state.initialTags}
          onChangeTags={this.onChangeTags}
          onTagPress={this.onTagPress}
          renderTag={this.renderTag}
        />
      </View>
    );
  }

  onTagPress = (index, tagLabel, event, deleted) => {
    // deleteTag(this.state.tagIds[index], this.state.currPathCoord)
    console.log(index, tagLabel, event, deleted ? 'deleted' : 'not deleted');
  };

  onChangeTags = tags => {
    this.setState({ initialTags: tags });
  };
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#FFEFEF',
  },
  container: {
    margin: 10,
    borderRadius: 10,
    backgroundColor: '#ECB249',
    justifyContent: 'flex-start',
  },
  tag: {
    backgroundColor: '#499BEC',
    borderRadius: 10,
    padding: 10,
    margin: 10,
  },
  textTag: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  input: {
    backgroundColor: '#FFFFFF',
    color: '#606060',
    fontWeight: 'bold',
    padding: 9,
  },
});

export default Tag;