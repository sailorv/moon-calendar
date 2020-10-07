import React from 'react';
import moment from 'moment';
import './calendar.css';

export default class Calendar extends React.Component {

  state = {
    dateContext: moment(),
    today: moment(),
    showMonthPopup: false,
    showYearPopup: false
  }

  constructor(props) {
    super(props);
    this.width = props.width || "350px";
    this.style = props.style || {};
    this.style.width = this.width;
  }

  weekdays = moment.weekdays();
  weekdaysShort = moment.weekdaysShort();
  months = moment.months();

  year = () => {
    return this.state.dateContext.format("Y");
  }
  month = () => {
    return this.state.dateContext.format("MMMM");
  }
  daysInMonth = () => {
    return this.state.dateContext.daysInMonth();
  }
  currentDate = () => {
    return this.state.dateContext.get("date");
  }
  currentDay = () => {
    return this.state.dateContext.format("D");
  }
  firstDayOfMonth = () => {
    let dateContext = this.state.dateContext;
    let firstDay = moment(dateContext).startOf("month").format("d"); // Day of week as number
    return firstDay;
  }

  setMonth = (month) => {
    let monthNo = this.months.indexOf(month);
    let dateContext = Object.assign({}, this.state.dateContext);
    dateContext = moment(dateContext).set("month", monthNo);
    this.setState({
      dateContext: dateContext
    });
  }

  onSelectChange = (e, data) => {
    this.setMonth(data);
    this.props.onMonthChange && this.props.onMonthChange();
  }

  SelectList = (props) => {
    let popup = props.data.map((data) => {
      return (
        <div key={data}>
          <a href="#" onClick={(e)=> {this.onSelectChange(e, data)}}>
          {data}
          </a>
        </div>
      )
    });
    return (
      <div className="month-popup">
        {popup}
      </div>
    );
  }

  onChangeMonth = (e, month) => {
    this.setState({
      showMonthPopup: !this.state.showMonthPopup
    });
  }

  MonthNav = () => {
    return (
      <span className="label-month-nav"
        onClick={(e) => {this.onChangeMonth(e, this.month())}}>
        {this.month()}
        {this.state.showMonthPopup &&
          <this.SelectList data={this.months} />
        }
      </span>
    );
  }

  showYear = () => {
    return (
      <span className="year">{this.year()}</span>
    );
  }

  showMoonPhase = () => {
    let thisDay = moment().format("YYYY-MM-DD");
    let lunarDays = "29.53";
    let sinceFirstMoonDays = moment().diff("2019-12-26", "days");
    let calcMoonPhase = sinceFirstMoonDays / lunarDays;
    let calcMoonPhase2 = calcMoonPhase - Math.floor(calcMoonPhase);
    let calcMoonPhase3 = Math.ceil(calcMoonPhase2 * lunarDays);

    if (calcMoonPhase3 <= 1){ // New Moon
       var moonPhaseName = "New Moon";
    } else if (calcMoonPhase3 > 1 && calcMoonPhase3 <= 7){  // Waxing Crescent
       var moonPhaseName = "Waxing Crescent";
    } else if (calcMoonPhase3 == 8){  // First Quarter
       var moonPhaseName = "First Quarter";
    } else if (calcMoonPhase3 <= 22 && calcMoonPhase3 >= 15){
       var moonPhaseName = "Waning Gibbous";
    } else {
      var moonPhaseName = "Calculating..."
    }
    return (
      <span className={moonPhaseName}>Today's moon is a {moonPhaseName} moon.</span>
    );
  }


  onDayClick = (e, day) => {
    this.props.onDayClick && this.props.onDayClick(e, day);
  }

  render() {
    // Map the weekdays as a list
    let weekdays = this.weekdaysShort.map((day) => {
      return (
        <li key={day} className="week-day">{day}</li>
      )
    });

    let blanks = [];
    for (let i = 0; i < this.firstDayOfMonth(); i++) {
      blanks.push(<li key={i*80} className="emptySlot">
        {""}
        </li>
      );
    }

    console.log("blanks: ", blanks);

    let daysInMonth = [];
    for (let d = 1; d <= this.daysInMonth(); d++) {
      let className = (d == this.currentDay() ? "day current-day": "day");

      daysInMonth.push(
        <li key={d} className={className} >
        <span>{d}</span>
        </li>
      );
    }

    console.log("days: ", daysInMonth);

    var totalSlots = [...blanks, ...daysInMonth];
    let rows = [];
    let cells = [];

    totalSlots.forEach((row, i) => {
      if((i % 7) !== 0) {
        cells.push(row);
      } else {
        let insertRow = cells.slice();
        rows.push(insertRow);
        cells = [];
        cells.push(row);
      }
      if (i === totalSlots.length - 1) {
        let insertRow = cells.slice();
        rows.push(insertRow);
      }
    });

    let trElems = rows.map((d, i) => {
      return (
        <div key={i*100} className="calendar-row">
          {d}
        </div>
      );
    })

    return (
    <div className="calendar-phase-wrapper">
      <div className="calendar-container">
        <h2>{this.month()} {this.year()}</h2>
        <div className="monthNavigation">
          <this.MonthNav />
        </div>
        <div className="calendar-weekdays-container">
          <ul className="calendar-weekdays">
            {weekdays}
          </ul>
        </div>
        <div>
          {trElems}
        </div>
      </div>
      <div className="phase-container">
        <div className="moonPhase">
        <h2>Today is</h2>
        <this.showMoonPhase />
        </div>
      </div>
    </div>
    );

  }
}
