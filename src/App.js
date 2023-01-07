import './App.css';
import React from "react";
import axios from "axios";
import {BrowserRouter, NavLink, Route, Routes} from "react-router-dom";
import Tables from "./Tables";
import ResultHistory from "./ResultHistory";
import TopScorers from "./TopScorers";
import Statistics from "./Statistics";

class App extends React.Component {

  state = {
    leagues: [],current: "none",value:0

  }

  findLeague = () => {
    let array;
    axios.get('https://app.seker.live/fm1/leagues').then((response) => {
      for (let j = 0; j < response.data.length; j++) {
        array += response.data[j].name

      }
      this.setState({
        leagues: array
      })
    });
  }
  componentDidMount() {
    this.findLeague()
  }

  render() {
    return (
        <div className="App">
          <BrowserRouter>
            <NavLink id={"navLink1"} style={{margin: "10px"}} to={"/Tables"}> Tables </NavLink>
            <NavLink id={"navLink2"} style={{margin: "10px"}} to={"/ResultHistory"}> ResultHistory </NavLink>
            <NavLink id={"navLink3"} style={{margin: "10px"}} to={"/TopScorers"}> TopScorers </NavLink>
            <NavLink id={"navLink4"} style={{margin: "10px"}} to={"/Statistics"}> Statistics </NavLink>

            <Routes>
              <Route path={"/ResultHistory"} element={<ResultHistory/>}/>
              <Route path={"/Tables"} element={<Tables/>}/>
              <Route path={"/TopScorers"} element={<TopScorers/>}/>
              <Route path={"/Statistics"} element={<Statistics/>}/>



            </Routes>
          </BrowserRouter>
        </div>
    )
  }
}
export default App;