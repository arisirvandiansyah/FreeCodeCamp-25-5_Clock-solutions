import { useRef, useState } from "react";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import { HiMiniPlayPause } from "react-icons/hi2";
import { LuTimerReset } from "react-icons/lu";

function App() {
  let timerCount = useRef(null);

  const [state, setState] = useState({
    breakLength: 5,
    sessionLength: 25,
    sessionMinute: 25,
    sessionSecond: "00",
    sessionMode: "Session",
  });
  const [isPaused, setIsPaused] = useState(true);

  const breakIncrement = () => {
    // Add condition to prevent update break state
    if (!isPaused || state.breakLength >= 60) return;
    // Set break increment required state
    setState({
      ...state,
      breakLength: state.breakLength + 1,
      sessionMinute:
        state.sessionMode === "Break"
          ? state.breakLength + 1
          : state.sessionLength,
      sessionSecond: "00",
    });
  };

  const breakDecrement = () => {
    // Add condition to prevent update break state
    if (!isPaused || state.breakLength <= 1) return;
    // Set break decrement required state
    setState({
      ...state,
      breakLength: state.breakLength - 1,
      sessionMinute:
        state.sessionMode === "Break"
          ? state.breakLength - 1
          : state.sessionLength,
      sessionSecond: "00",
    });
  };

  const sessionIncrement = () => {
    // Add condition to prevent update session state
    if (!isPaused || state.sessionLength >= 60) return;
    // Add condition how the session displayed in #time-left
    if (state.sessionLength < 9)
      setState({
        ...state,
        sessionLength: state.sessionLength + 1,
        sessionMinute: "0" + parseInt(state.sessionLength + 1),
      });
    else
      setState({
        ...state,
        sessionLength: state.sessionLength + 1,
        sessionMinute: state.sessionLength + 1,
        sessionSecond: "00",
      });
  };

  const sessionDecrement = () => {
    // Add condition to prevent update session state
    if (!isPaused || state.sessionLength <= 1) return;
    // Add condition how the session displayed in #time-left
    if (state.sessionLength <= 10)
      setState({
        ...state,
        sessionLength: state.sessionLength - 1,
        sessionMinute: "0" + parseInt(state.sessionLength - 1),
      });
    else
      setState({
        ...state,
        sessionLength: state.sessionLength - 1,
        sessionMinute: state.sessionLength - 1,
        sessionSecond: "00",
      });
  };

  const countDown = () => {
    // Add condition to check if the timer is on pause state or not
    if (isPaused) {
      // Clear the timer & set pause state to false
      clearInterval(timerCount.current);
      setIsPaused(false);
      // Count required time to second
      const secondSet =
        state.sessionMinute * 60 + parseInt(state.sessionSecond);
      const timeNow = Date.now();
      const timeThen = timeNow + secondSet * 1000;
      // Start the countdown
      timerCount.current = setInterval(() => {
        // Set time for timer
        let timeLeft = Math.round((timeThen - Date.now()) / 1000);
        // Add condition if the timer run 0
        if (timeLeft < 1) {
          document.getElementById("beep").play();
          if (state.sessionMode === "Session") breakCount();
          if (state.sessionMode === "Break") sessionCount();
        }
        // Call finction to display counter in browser
        countDisplay(timeLeft);
      }, 1000);
    } else {
      // clear counter to pause the timer - set pause state to true - set session state to before timer paused
      clearInterval(timerCount.current);
      setIsPaused(true);
      setState({
        ...state,
        sessionMinute: state.sessionMinute,
        sessionSecond: state.sessionSecond,
      });
    }
  };

  const sessionCount = () => {
    clearInterval(timerCount.current);
    setIsPaused(true);
    setTimeout(() => {
      state.sessionMinute = state.sessionLength;
      state.sessionSecond = "00";
      state.sessionMode = "Session";
      countDown();
    }, 3000);
  };

  const breakCount = () => {
    clearInterval(timerCount.current);
    setIsPaused(true);
    setTimeout(() => {
      state.sessionMinute = state.breakLength;
      state.sessionSecond = "00";
      state.sessionMode = "Break";
      countDown();
    }, 3000);
  };

  const countDisplay = (time) => {
    // Calculate Minute
    let minute = Math.floor(time / 60);
    // Calculate seconds
    let second = time % 60;

    // Add condition how the time dispalyed in #time-left
    if (minute < 10) {
      if (minute == 0)
        document.querySelector(".timer-wrapper").style.color = "red";
      if (minute > 0)
        document.querySelector(".timer-wrapper").style.color = "white";
      setState({
        ...state,
        sessionMinute: "0" + parseInt(minute),
        sessionSecond: second < 10 ? "0" + parseInt(second) : parseInt(second),
      });
    } else {
      setState({ ...state, sessionMinute: minute, sessionSecond: second });
    }
  };

  const reset = () => {
    // Reset audio
    document.getElementById("beep").pause();
    document.getElementById("beep").currentTime = 0;
    // Reset timer color (the timer color is red if the timer is under 1 minutes)
    document.querySelector(".timer-wrapper").style.color = "white";
    // Clear the timer & set pause state to true
    clearInterval(timerCount.current);
    setIsPaused(true);
    // Reset state to default
    setState({
      ...state,
      breakLength: 5,
      sessionLength: 25,
      sessionMinute: 25,
      sessionSecond: "00",
      sessionMode: "Session",
    });
  };

  return (
    <div className="container">
      <div className="wrapper">
        <div className="app-label">
          <h1>Workout Clock</h1>
        </div>
        <div className="control-wrapper">
          <div className="control-item">
            <div className="control-label">
              <h3 id="break-label">Break Length</h3>
            </div>
            <div className="control-setting">
              <button
                id="break-decrement"
                className="btn-control"
                onClick={breakDecrement}
              >
                <FaChevronDown />
              </button>
              <div id="break-length" className="control-text">
                {state.breakLength}
              </div>
              <button
                id="break-increment"
                className="btn-control"
                onClick={breakIncrement}
              >
                <FaChevronUp />
              </button>
            </div>
          </div>
          <div className="control-item">
            <div className="control-label">
              <h3 id="session-label">Session Length</h3>
            </div>
            <div className="control-setting">
              <button
                id="session-decrement"
                className="btn-control"
                onClick={sessionDecrement}
              >
                <FaChevronDown />
              </button>
              <div id="session-length" className="control-text">
                {state.sessionLength}
              </div>
              <button
                id="session-increment"
                className="btn-control"
                onClick={sessionIncrement}
              >
                <FaChevronUp />
              </button>
            </div>
          </div>
        </div>
        <div className="timer-wrapper">
          <h3 id="timer-label">{state.sessionMode}</h3>
          <div id="time-left">
            {state.sessionMinute}:{state.sessionSecond}
          </div>
        </div>
        <div className="timer-control">
          <button id="start_stop" className="btn-control" onClick={countDown}>
            <HiMiniPlayPause />
          </button>
          <button id="reset" className="btn-control" onClick={reset}>
            <LuTimerReset />
          </button>
        </div>
      </div>
      <audio
        src="https://cdn.freecodecamp.org/testable-projects-fcc/audio/BeepSound.wav"
        id="beep"
        preload="auto"
      ></audio>
      <div className="tag-name">
        <p>
          By <a href="#">Aris Irvandiansyah</a>
        </p>
      </div>
    </div>
  );
}

export default App;
