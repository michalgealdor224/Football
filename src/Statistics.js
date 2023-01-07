import React from "react";
import axios from "axios";
import SelectLeague from "./SelectLeague";

class Statistics extends React.Component {
    state = {
        half1: "", half2: "", goals: [] , earliestGoal : "" , latestGoal : "" , arrayRound : []
        , roundMax : "" , roundMin :"" , max: "" , min : "" , half :45 , start :0
    }

    findGoals = (id) => {
        let i = 0
        let j = 0
        let goalsArray = []
        axios.get('https://app.seker.live/fm1/history/' + id).then((response) => {
            while (i < response.data.length) {
                while (j < response.data[i].goals.length) {
                    let minute = response.data[i].goals[j].minute
                    let name = response.data[i].goals[j].scorer.firstName + " "
                        + response.data[i].goals[j].scorer.lastName
                    let goal = {name, minute}
                    goalsArray.push(goal)
                    j++
                }
                i++
                j = 0
                this.setState({
                    goals: goalsArray
                })
            }
        })
        this.findHalf(id)
    }

    findHalf = (id) => {
        let i = 0
        let j = 0
        let countHalf1 = 0
        let countHalf2 = 0
        let earliest=90
        let latest=0
        axios.get('https://app.seker.live/fm1/history/' + id).then((response) => {
            while (i < response.data.length) {
                while (j < response.data[i].goals.length) {
                    if (response.data[i].goals[j].minute <= this.state.half) {
                        countHalf1++
                    } else {
                        countHalf2++
                    }

                    if (response.data[i].goals[j].minute < earliest) {
                        earliest = response.data[i].goals[j].minute
                    }

                    if (response.data[i].goals[j].minute > latest) {
                        latest = response.data[i].goals[j].minute
                    }
                    j++

                }
                i++
                j = 0
            }

            this.setState({
                half1: countHalf1,
                half2: countHalf2,
                earliestGoal : earliest,
                latestGoal : latest
            })

        })
        this.goalByRound(id)
    }


    goalByRound = (id) => {
        let array = []
        let i=0
        let j=0
        let sum =0
        axios.get('https://app.seker.live/fm1/history/' + id).then((response) => {
            while (i < response.data.length) {
                let round = response.data[i].round
                while (j < response.data.length) {
                    if (round === response.data[j].round){
                        sum += response.data[j].goals.length
                    }
                    j++
                }
                let sumOfRound = {round , sum}
                let ifExist = false
                for (let k = 0; k < array.length; k++) {
                    if (sumOfRound.round === array[k].round) {
                        ifExist = true
                    }
                }
                if (!ifExist) {
                    array.push(sumOfRound)
                    this.setState( {
                        arrayRound : array
                    })
                }
                i++
                j=0
                sum=0
            }
            let max =0
            let roundMax;
            let min = array[this.state.start].sum
            let roundMin;
            debugger
            for (let k = 0; k <array.length ; k++) {
                debugger
                if (array[k].sum > max) {
                    max = array[k].sum
                    roundMax = array[k].round
                }
                if (array[k].sum < min) {
                    min = array[k].sum
                    roundMin = array[k].round
                }
                debugger
            }
            this.setState({
                roundMax : roundMax,
                roundMin : roundMin,
                max: max , min:min

            })
        })

    }






    render() {
        return (
            <div className="Statistics">
                <SelectLeague responseClick = {this.findGoals.bind(this)} ></SelectLeague>
                <h2> {
                    "first half: ," + this.state.half1 + " second half: " + this.state.half2
                }

                    <br/>
                    {
                        " earliest goal: ," +this.state.earliestGoal + " latest goal : " + this.state.latestGoal
                    }
                    <br/>
                    {
                        " round max: " + this.state.roundMax + " sum: ," + this.state.max + " round min: " + this.state.roundMin + " sum:" + this.state.min
                    }
                </h2>
                }






            </div>
        )
    }


}
export default Statistics;