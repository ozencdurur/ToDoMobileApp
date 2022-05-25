import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  SafeAreaView,
  TouchableOpacity,
  FlatList,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const App = () => {
  const [textInput, setTextInput] = useState('');
  const [toDos, setToDos] = useState([]);
  //
  useEffect(() => {
    getToDosFromUserDevice();
  }, []);
  useEffect(() => {
    saveToDoToUserDevice(toDos);
  }, [toDos]);
  const ListItem = ({toDo}) => {
    return (
      <View style={styles.listItem}>
        <View style={{flex: 1}}>
          <Text
            style={{
              fontWeight: 'bold',
              fontSize: 15,
              color: '#1C6DD0',
              textDecorationLine: toDo?.completed ? 'line-through' : 'none',
            }}>
            {toDo?.task}
          </Text>
        </View>
        {!toDo?.completed && (
          <TouchableOpacity
            style={styles.actionIcon}
            onPress={() => markToDoComplete(toDo?.id)}>
            <Icon name="done" size={20} color="white" />
          </TouchableOpacity>
        )}

        <TouchableOpacity
          style={[styles.actionIcon, {backgroundColor: 'red'}]}
          onPress={() => deleteToDo(toDo?.id)}>
          <Icon name="delete" size={20} color="white" />
        </TouchableOpacity>
      </View>
    );
  };
  const saveToDoToUserDevice = async toDos => {
    try {
      const stringifyToDos = JSON.stringify(toDos);
      await AsyncStorage.setItem('toDos', stringifyToDos);
    } catch (error) {
      console.log(error);
    }
  };
  const getToDosFromUserDevice = async () => {
    try {
      const toDos = await AsyncStorage.getItem('toDos');
      if (toDos != null) {
        setToDos(JSON.parse(toDos));
      }
    } catch (error) {
      console.log(error);
    }
  };
  const addToDo = () => {
    if (textInput == '') {
      Alert.alert('Error', 'Please input');
    } else {
      const newToDo = {
        id: Math.random(),
        task: textInput,
        completed: false,
      };
      setToDos([...toDos, newToDo]);
      setTextInput('');
    }
  };
  const markToDoComplete = toDoId => {
    const newToDos = toDos.map(item => {
      if (item.id == toDoId) {
        return {...item, completed: true};
      }
      return item;
    });
    setToDos(newToDos);
  };
  const deleteToDo = toDoId => {
    const newToDos = toDos.filter(item => item.id != toDoId);
    setToDos(newToDos);
  };
  const clearToDos = () => {
    Alert.alert('Confirm', 'Clear All To Do?', [
      {
        text: 'Yes',
        onPress: () => setToDos([]),
      },
      {text: 'No'},
    ]);
  };
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>TO DO APP</Text>
        <Icon name="delete" size={25} color="red" onPress={clearToDos} />
      </View>
      <FlatList
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{padding: 20, paddingBottom: 100}}
        data={toDos}
        renderItem={({item}) => <ListItem toDo={item} />}
      />
      <View style={styles.footer}>
        <View style={styles.inputContainer}>
          <TextInput
            style={{color: '#1C6DD0'}}
            placeholder="Add To Do"
            placeholderTextColor="#1C6DD0"
            value={textInput}
            onChangeText={text => setTextInput(text)}
          />
        </View>
        <TouchableOpacity onPress={addToDo}>
          <View style={styles.iconContainer}>
            <Icon name="add" color={'#92B4EC'} size={30} />
          </View>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 25,
    color: '#1C6DD0',
  },
  inputContainer: {
    backgroundColor: '#FFD24C',
    elevation: 40,
    flex: 1,
    height: 50,
    marginVertical: 20,
    marginRight: 30,
    borderRadius: 30,
  },
  iconContainer: {
    height: 50,
    width: 50,
    backgroundColor: '#FFD24C',
    borderRadius: 25,
    elevation: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listItem: {
    padding: 20,
    backgroundColor: '#FFD24C',
    flexDirection: 'row',
    elevation: 12,
    borderRadius: 7,
    marginVertical: 10,
  },
  actionIcon: {
    height: 25,
    width: 25,
    backgroundColor: 'green',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 5,
    borderRadius: 3,
  },
});

export default App;
