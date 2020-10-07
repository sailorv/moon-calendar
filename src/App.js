import React, { Component } from 'react';

import Calendar from './components/calendar/';

const style = {
  position: "relative",
  margin: "50px auto"
}

class App extends Component {
  onDayClick = (e, day) => {
    alert(day);
  }
  
  render() {
    return (
      <div className="App">
      <Calendar style={style}
        onDayClick={(e, day)=> this.onDayClick(e, day)}/>
      </div>
    );
  }
}

export default App;
