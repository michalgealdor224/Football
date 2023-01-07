import React from "react";
import axios from "axios";
import SelectLeague from "./SelectLeague";

class TopScorers extends React.Component {
    state = { scoring : [] , topThree : [] , first : "" , theFirst : 0 , theThird:3

    }

    findWhoTopScores  = (id) => {
        let j =0;
        let i=0
        let k =0
        let m =0;
        let count =0
        let thePlayer = []
        axios.get('https://app.seker.live/fm1/history/' + id).then((response) => {
            while (m<response.data.length) {

                while (k < response.data[m].goals.length){

                    let currentPlayer = response.data[m].goals[k].scorer.id

                    while (j< response.data.length) {

                        while (i < response.data[j].goals.length) {

                            if (currentPlayer === response.data[j].goals[i].scorer.id) {
                                count++
                            }
                            i++
                        }
                        i=0;
                        j++
                    }
                    let name = response.data[m].goals[k].scorer.firstName + response.data[m].goals[k].scorer.lastName
                    const player = {name , count }
                    let ifExist =false
                    for (let l = 0; l < thePlayer.length; l++) {
                        if (player.name=== thePlayer[l].name){
                            ifExist =true
                        }
                    }
                    if (!ifExist){
                        thePlayer.push(player)
                    }
                    ifExist = false
                    this.setState( {
                        scoring : thePlayer ,
                        topThree : this.state.scoring.sort((a, b) => b.count - a.count).slice(this.state.theFirst,this.state.theThird),
                    })
                    i++
                    k++
                    count=0
                    j=0
                }
                k=0
                m++
            }
        })
    }

    render() {
        return (
            <div className="ResultHistory">
                <SelectLeague responseClick = {this.findWhoTopScores.bind(this)} ></SelectLeague>
                <table>
                    {
                        this.state.topThree.map((item) => {
                            return (
                                <tr id={"topTable"}>
                                    <td>
                                        {item.name + " " + item.count}
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

export default TopScorers;