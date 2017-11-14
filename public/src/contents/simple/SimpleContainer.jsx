import React from "react";
import ReactDom from "react-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { isJson } from "../../common/jsUtil.js";
import { createGearHUDComponent } from "../../common/gearHUDComponent.jsx";
import simpleStyle from "./simple.css";
import rankIcon from "../../image/rank.png";
import lapIcon from "../../image/lap.png";
import timeIcon from "../../image/time.png";
import fuelIcon from "../../image/fuel.png";

class SimpleContent extends React.Component {
  constructor(props) {
    super(props)
  }

  createGear() {
    const telemetryData = this.props.telemetryData;
    if (!isJson(telemetryData)) {
      return <div></div>;
    }

    const carState = telemetryData.carState; 

    const gearHUDComponent = createGearHUDComponent({
      cx: 50,
      cy: 50,
      radius: 50,
      gear: carState.gear,
      speed: carState.speed,
      rpm: carState.rpm,
      maxRpm: carState.maxRpm,
      throttle: carState.throttle,
      brake: carState.brake,
      clutch: carState.clutch,
      isMeter: this.props.isMeter
    });

    return (
      <svg className={simpleStyle.gear} preserveAspectRatio="xMidYMid meet" viewBox="0 0 100 100">
        {gearHUDComponent}
      </svg>
    );
  }

  createData() {
    const telemetryData = this.props.telemetryData;
    const timingsData = this.props.timingsData;
    const raceData = this.props.raceData;
    if (!isJson(telemetryData) || !isJson(timingsData) || !isJson(raceData)) {
      return <div></div>;
    }

    const carState = telemetryData.carState; 
    const participant = timingsData.formatParticipants[telemetryData.participantInfo.viewedParticipantIndex];

    const eventTimeRemaining = timingsData.eventTimeRemaining;
    const isTimedSessions = (eventTimeRemaining !== "--:--:--.---"); 
    const lapsInEvent = (raceData.lapsInEvent > 0)
      ? participant.currentLap + "/" + raceData.lapsInEvent
      : participant.currentLap; 
    const sessionText = (isTimedSessions)
      ? eventTimeRemaining
      : lapsInEvent

    return (
      <div className={simpleStyle.table}>
        <div className={simpleStyle.record}>
          <div className={simpleStyle.iconCell}>
            <div>
              <img src={rankIcon} />
            </div>
          </div>
          <div className={simpleStyle.valueCell}>
            <div>
              <span>{participant.racePosition}/{timingsData.numParticipants}</span>
            </div>
          </div>
        </div>
        <div className={simpleStyle.record}>
          <div className={simpleStyle.iconCell}>
            <div>
              <img src={lapIcon} />
            </div>
          </div>
          <div className={simpleStyle.valueCell}>
            <div>
              <span>{sessionText}</span>
            </div>
          </div>
        </div>
        <div className={simpleStyle.record}>
          <div className={simpleStyle.iconCell}>
            <div>
              <img src={timeIcon} />
            </div>
          </div>
          <div className={simpleStyle.currentLap}>
            <div>
              <span>{participant.currentLap}</span>
            </div>
          </div>
          <div className={simpleStyle.currentTime}>
            <div>
              <span>{participant.currentTime}</span>
            </div>
          </div>
        </div>
        <div className={simpleStyle.record}>
          <div className={simpleStyle.iconCell}>
            <div>
              <img src={fuelIcon} />
            </div>
          </div>
          <div className={simpleStyle.valueCell}>
            <div>
              <span>{carState.fuelRemaining}L</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  render() {
    return (
      <div className={simpleStyle.content}>
        {this.createGear()}
        {this.createData()}
      </div>
    );
  }
}

SimpleContent.propTypes = {
  isMeter: PropTypes.bool.isRequired,
  telemetryData: PropTypes.object.isRequired,
  timingsData: PropTypes.object.isRequired,
  raceData: PropTypes.object.isRequired
};

const mapStateToProps = state => {
  const data = state.currentUdpData
  return {
    isMeter: state.options.isMeter,
    telemetryData: data.telemetryData,
    timingsData: data.timingsData,
    raceData: data.raceData
  };
};

const SimpleContainer = connect(
  mapStateToProps
)(SimpleContent);

export default SimpleContainer;
