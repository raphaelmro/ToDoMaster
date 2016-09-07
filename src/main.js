import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableOpacity,
  ScrollView,
  AsyncStorage
} from 'react-native';

module.exports = React.createClass({
  getInitialState() {
    return ({
      tasks: [],
      completedTasks: ['Play Guitar', 'Learn French', 'Wash Faella\'s car'],
      task: '',
      completedCounter: 0,
    })
  },

  componentWillMount() {
    AsyncStorage.getItem('tasks')
      .then((response) => {
        this.setState({tasks: JSON.parse(response)})
      });
    AsyncStorage.getItem('completedTasks')
      .then((response) => {
        this.setState({completedTasks: JSON.parse(response)})
      });
    // AsyncStorage.getItem('completedCounter')
    //   .then((response) =>{
    //     this.setState({completedCounter: response})
    //   })
  },

  componentDidUpdate() {
    this.setStorage();
  },

  setStorage() {
    AsyncStorage.setItem('tasks', JSON.stringify(this.state.tasks));
    AsyncStorage.setItem('completedTasks', JSON.stringify(this.state.completedTasks));
  },

  renderList(tasks) {
    // return individual Views or rows based on the argued tasks
    return (
      tasks.map((task, index) => {
        return (
          <View key={task} style={styles.task}>
            <Text>
              {task}
            </Text>
            <TouchableOpacity
              onPress={()=>this.completeTask(index)}
            >
              <Text>
                &#10003;
              </Text>
            </TouchableOpacity>
          </View>
        )
      })
    )
  },

  renderCompleted(tasks) {
    return (
      tasks.map((task, index) => {
        return (
          <View key={task} style={styles.task}>
            <Text style={styles.completed}>
              {task}
            </Text>
            <TouchableOpacity
              onPress={()=>this.deleteTask(index)}
            >
              <Text>
                &#10005;
              </Text>
            </TouchableOpacity>
          </View>
        )
      })
    )
  },

  deleteTask(index) {
    let completedTasks = this.state.completedTasks;
    completedTasks = completedTasks.slice(0, index).concat(completedTasks.slice(index+1));
    this.setState({completedTasks});
    this.setStorage();
  },

  completeTask(index) {
    let tasks = this.state.tasks;
    tasks = tasks.slice(0, index).concat(tasks.slice(index+1));

    let completedTasks = this.state.completedTasks;
    completedTasks = completedTasks.concat([this.state.tasks[index]]);

    this.setState({
      tasks,
      completedTasks
    });

    this.setStorage();
    this.state.completedCounter  = this.state.completedCounter + 1;
  },

  addTask() {
    let tasks = this.state.tasks.concat([this.state.task]);
    this.setState({tasks});
    this.setStorage();
  },

  clearAll(){
    let completedTasks = this.state.completedTaskss;
    completedTasks = [];
    this.setState({completedTasks});
    this.setStorage();
  },

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.header}>
          To-Do Master
        </Text>
        <TextInput
          style={styles.input}
          placeholder='Add a task...'
          onChangeText={(text) => {
            this.setState({task: text});
          }}
          onEndEditing={()=>this.addTask()}
        />
        <View style={styles.featuresContainer}>
          <TouchableOpacity onPress={()=>{this.clearAll()}}>
            <Text style={styles.clearAll}>Clear completed</Text>
          </TouchableOpacity>
          <Text style={styles.completedCounter}>
            Completed tasks:
            <Text style={styles.counter}>{this.state.completedCounter}</Text>
          </Text>
        </View>

        <ScrollView>
          {this.renderList(this.state.tasks)}
          {this.renderCompleted(this.state.completedTasks)}
        </ScrollView>
      </View>
    )
  }
})

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    margin: 30,
    marginTop: 40,
    textAlign: 'center',
    fontSize: 18
  },
  task: {
    flexDirection: 'row',
    height: 60,
    borderBottomWidth: 1,
    borderColor: 'black',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20
  },
  input: {
    height: 60,
    borderWidth: 1,
    borderRadius: 5,
    borderColor: 'black',
    textAlign: 'center',
    margin: 10
  },
  completed: {
    color: '#555',
    textDecorationLine: 'line-through'
  },
  featuresContainer:{
    flexDirection: 'row'
  },
  clearAll:{
    textDecorationLine: 'underline',
    marginLeft: 10
  },
  completedCounter: {
    textAlign: 'right',
    marginLeft: 100
  },
  counter:{
    color: 'green',
    margin: 50
  }
})
