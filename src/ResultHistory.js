import './App.css';
import React from "react";
import axios from "axios";
import SelectLeague from "./SelectLeague";
class ResultHistory extends React.Component {

    state= {
        result : [] , arrayWithSort :[] , maxRound : "" , minRound : 0 , minChose :0
    }

    findResult = (id) =>{
        let theResult = []
        let i=0
        let k=0
        let m=0
        let roundMax =0
        axios.get('https://app.seker.live/fm1/history/' + id).then((response) => {
            while (i<response.data.length) {
                let group1 =response.data[k].homeTeam.name
                let group2 =response.data[k].awayTeam.name
                let point1 = this.sumGoals(response ,m)
                m++
                let point2 = response.data[k].goals.length - point1
                let round = response.data[k].round
                if (round> roundMax) {
                    roundMax =round
                    this.setState( {
                        maxRound : roundMax
                    })
                }
                let game = {group1 , point1 , group2 , point2 , round }
                theResult.push(game)
                this.setState( {
                    result: theResult,
                })
                i++
                k++
            }

        })
    }
    sumGoals= (response,m) =>{
        let j=0
        let count =0
        while (j <response.data[m].goals.length) {
            if (response.data[m].goals[j].home) {
                count++
            }
            j++
        }
        return count;
    }

    sortByRound = () => {
        let j = 0;
        let arraySort = []
        let min = document.getElementById("min").value;
        if (min === "") {
            min=this.state.minRound
        }
        let max = document.getElementById("max").value;
        if (max === ""){
            max = this.state.maxRound
        }

        while (j < this.state.result.length) {
            if (this.state.result[j].round >= min && this.state.result[j].round<= max) {
                arraySort.push(this.state.result[j])
            }
            j++
        }
        this.setState( {
            arrayWithSort : arraySort
        })
    }


    componentDidMount() {
        this.findResult()
    }

    render() {
        return (
            <div className="ResultHistory">
                <SelectLeague responseClick = {this.findResult.bind(this)} ></SelectLeague>
                <div id={"minText"}> min</div>
                <input id={"min"} type={"number"} min={this.state.minChose} max={this.state.maxRound}/>
                <div id={"maxText"}> max</div>
                <input id={"max"} type={"number"} min={this.state.minChose} max={this.state.maxRound}/>
                <button id={"okButton"} onClick={this.sortByRound}> OK</button>
                <table>
                    {
                        this.state.arrayWithSort.map((item)=>{
                            return(
                                <tr>
                                    <td>
                                        {item.group1 + "  " + item.point1  +" - "+item.point2 + "  " + item.group2 }
                                    </td>
                                </tr>
                            )
                        })
                    }
                </table>

            </div>


        )
    }

}

export default ResultHistory;