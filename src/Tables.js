import React from "react";
import axios from "axios";
import SelectLeague from "./SelectLeague";


class Tables extends React.Component {
    state = {
        groups: [], current : "none", value:0 , players : [] , result : [] , winnerArray : [] , GroupId: "none"
        , differenceCurrent : " " , Equality :0 , lose :0 , win : 3 , equal : 1 , winner:2
    }
    findNameGroup = (id) => {
        axios.get('https://app.seker.live/fm1/teams/' + id ).then((response) => {
            this.setState({
                groups: response.data ,
                current : id,
                winnerArray : [] ,
                result : [],
                players : []
            })
        })

        this.findWinner(id)

    }
    findPlayers = (id) =>{
        let i=0
        let thePlayers = []
        axios.get('https://app.seker.live/fm1/squad/'+ this.state.current+ "/" + id).then((response) => {
            while (i< response.data.length) {
                let firstName = response.data[i].firstName;
                let lastName = response.data[i].lastName;
                let player = {firstName,lastName }
                thePlayers.push(player)
                i++
            }
            this.setState( {
                players : thePlayers
            })
        })

        this.findResult(id)
    }

    addPoints = (name, id , pointToAdd , difference) => {
        let arrayOfWins = this.state.winnerArray
        let ifExist = false
        for (let j = 0; j <arrayOfWins.length ; j++) {
            if (arrayOfWins[j].name === name) {
                ifExist = true
                arrayOfWins[j].win += pointToAdd
            }
        }
        if (!ifExist) {
            arrayOfWins.push({name,id,win: pointToAdd ,difference})
        }
        arrayOfWins.sort((a,b)=> {
            let sortByScorer = (b.win - a.win)
            if (sortByScorer===this.state.Equality) {
                let sortByDifference = (b.difference - a.difference)
                if (sortByDifference===this.state.Equality) {
                    return (a.name.localeCompare(b.name))
                }
                return sortByDifference
            }
            return sortByScorer
        })

        this.setState( {
            winnerArray : arrayOfWins
        })
    }



    findWinner = () =>{
        let i=0
        let k=0
        let m =0
        let j =0
        axios.get('https://app.seker.live/fm1/history/'+ this.state.current+ "/" ).then((response) => {
            while (i<response.data.length) {
                let group1 =response.data[k].homeTeam.name
                let group2 =response.data[k].awayTeam.name
                let id1 = response.data[k].homeTeam.id
                let id2 = response.data[k].awayTeam.id
                let point1 = this.sumGoals(response ,m)
                m++
                let point2 = response.data[k].goals.length - point1
                let name = group1
                let countGoal = this.sumGoals(response,m)
                let countRival =0
                while (j < response.data.length){
                    for (let l = 0; l < response.data[j].goals.length; l++) {
                        if (name === response.data[j].homeTeam.name){
                            if (!response.data[j].goals[l].home){

                                countRival++
                            }
                        }
                        if (name === response.data[j].awayTeam.name){
                            if (response.data[j].goals[l].home){

                                countRival++
                            }
                        }
                    }
                    j++
                }
                name = group2
                countGoal = this.sumGoals(response,m)
                countRival =0
                while (j < response.data.length){
                    for (let l = 0; l < response.data[j].goals.length; l++) {
                        if (name === response.data[j].homeTeam.name){
                            if (response.data[j].goals[l].home){
                                countRival++
                            }
                        }
                        if (name === response.data[j].awayTeam.name){
                            if (!response.data[j].goals[l].home){

                                countRival++
                            }
                        }
                    }
                    j++
                }

                let difference = countGoal-countRival



                let array = [this.state.lose,this.state.equal,this.state.win]
                if (point1 > point2) {
                    this.addPoints(group1,id1, array[this.state.winner],difference)
                    this.addPoints(group2,id2, array[this.state.lose],difference)
                }
                if (point1 < point2) {
                    this.addPoints(group2,id2,array[this.state.winner],difference)
                    this.addPoints(group1,id1,array[this.state.lose],difference)
                }
                if (point1 === point2) {
                    let name = group1
                    this.addPoints(name,id1,array[this.state.equal],difference)
                    name = group2
                    this.addPoints(name,id2,array[this.state.equal],difference)
                }
                i++
                k++

            }
        })

    }





    findResult = (id) =>{
        let theResult = []
        let i=0
        let k=0
        let m =0
        let countCurrentGroup =0
        let countRivals = 0
        let nameGroup;
        axios.get('https://app.seker.live/fm1/history/'+ this.state.current+ "/" + id).then((response) => {
            while (i<response.data.length) {
                let group1 = response.data[k].homeTeam.name
                let group2 = response.data[k].awayTeam.name
                let point1 = this.sumGoals(response, m)
                m++
                let point2 = response.data[k].goals.length - point1
                let round = response.data[k].round
                let id1 = response.data[k].homeTeam.id
                let id2 = response.data[k].awayTeam.id
                let game = {group1, point1, group2, point2, round}
                this.setState({
                    result: theResult
                })
                if (id === id1 ) {
                    countCurrentGroup += point1
                    countRivals += point2
                    nameGroup = group1

                }
                if (id === id2 ) {
                    countCurrentGroup += point2
                    countRivals += point1
                    nameGroup = group2
                }
                theResult.push(game)
                theResult.sort()
                this.setState({
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



    render() {
        return (
            <div className="Tables">
                <SelectLeague responseClick = {this.findNameGroup.bind(this)} ></SelectLeague>
                <table id={"tablesId"} >
                    {
                        this.state.winnerArray.map((item, index)=>{
                            return(
                                <tr className={"emphasis league-table-tr " + ((index === this.state.lose) ? "top" : ((index >= (this.state.winnerArray.length - this.state.win)) ? "lower" : ""))}>
                                    <td id={"T1"}  onClick={() => this.findPlayers(item.id)} >
                                        {item.name + "  "  +item.win}
                                    </td>
                                </tr>
                            )
                        })
                    }
                    {
                        this.state.result.map((item)=>{
                            return(
                                <tr>
                                    <td id={"T2"}>
                                        {item.group1 + "  " + item.point1  +" - "+item.point2 + "  " + item.group2}
                                    </td>
                                </tr>
                            )
                        })
                    }
                    {
                        this.state.players.map((item)=>{
                            return(
                                <tr>
                                    <td id={"T3"}>
                                        {item.firstName + "  "  +item.lastName}
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

export default Tables;