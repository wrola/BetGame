import React from 'react';
import ReactDOM from 'react-dom';
require("../sass/main.scss");


class Header extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <div className='header'>
                <h1>The Bet Game</h1>

                <p>Score</p>
            </div>
        )
    }
}
class Main extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            team: '',
            currentOponentTeam: '',
            options: [],
            oponents: [],
            tableLeague: [],
            stake: 0,
            bet: 0,
            dateOfTheMatch: '',
            newItem: '',
            list: []
        }
    }

    componentDidMount = () =>{
        fetch('http://api.football-data.org/v1/competitions/398/teams', {
            headers: {'X-Auth-Token': '405e8d17c66e46e284d542c0fb7aacd5'},
            dataType: 'json'
        }).then(r => r.json()).then(data => {
            const chances = ((Math.random() * 10) + 1).toFixed(2);
            if(toString(chances).length > 4){
                Math.round(chances)
            };
            // console.log(chances)
            this.setState({
                options: data.teams,
                stake: chances
            })
        }).catch(e => {
            console.log('Błąd!!!!', e)
        });

    }

    handleOption = (event) =>{
        // console.log(event.target.value);
        this.state.options.forEach((elem,i)=>{
                if(elem.name === event.target.value){
                    this.fetchOpponentsFromAPI(elem._links.fixtures.href);
                }

            },this.setState({
                team : event.target.value,
            })
        )
    }

    fetchOpponentsFromAPI = (url) =>{
        fetch(url,{
                headers: {'X-Auth-Token': '405e8d17c66e46e284d542c0fb7aacd5'},
                dataType: 'json'
            }).then(r => r.json()).then(data => {
                data.fixtures.map((elem, i) => {
                    // console.log(new Date(elem.date) > Date.now());
                    if (new Date(elem.date) > Date.now()) {
                        if (this.state.team === elem.awayTeamName) {
                            this.setState({
                                dateOfTheMatch: new Date(elem.date),
                                oponents: elem.homeTeamName,
                            })
                        } else {
                            this.setState({
                                dateOfTheMatch: new Date(elem.date),
                                oponents: elem.awayTeamName,
                            })
                        }
                    }
                // this.setState({
                //     oponents: data.fixtures,
                // })
                console.log(this.state.oponents);
                    console.log(this.state.dateOfTheMatch);
            }).catch(e => {
                console.log('Błąd!!!!', e)
            });
        })
    }
    handleBet = (e) => {
        const chances = ((Math.random() * 6) + 1).toFixed(2);
        const result =(Math.abs(e.currentTarget.value * chances)).toFixed(2);
        this.setState({
            bet: result
        })
    }
    updateInput = (key, value) => {
        const chances = ((Math.random() * 6) + 1).toFixed(2);
        const result =(Math.abs(value * chances)).toFixed(2);
        this.setState({
            [key]: result
        });
        localStorage.setItem(key, value)
    }
    addItem = () => {
        // create a new item
        const newItem = {
            id: 1 + Math.random(),
            team: this.state.team,
            oponent: this.state.oponents,
            date: this.state.dateOfTheMatch,
            value: this.state.newItem.slice(),
        };

        // copy current list of items
        const list = [...this.state.list];

        // add the new item to the list
        list.push(newItem);

        // update state with new list, reset the new item input
        this.setState({
            list,
            newItem: ""
        });
    }
    handleSubmit = (e) => {
        e.preventDefault();

        this.setState({

            }
        )
    }

    render() {
        return (
            <div className="main">
                <form type="submit" >
                    <label>Team</label>
                        <select onChange={(e) => {this.handleOption(e)}} onSelect={(e) => {this.checkTheCurrentOponent(e)}}>
                        <option>Choose a team</option>
                        {this.state.options.map((elem, i) => <option key={i}>{elem.name}</option>)}
                        </select>
                <h2>Oponents</h2>
                    {/*{this.state.oponents.map((elem, i) => {*/}
                        {/*// console.log(new Date(elem.date) > Date.now());*/}
                        {/*if (new Date(elem.date) > Date.now()) {*/}
                            {/*// console.log(elem.awayTeamName);*/}
                            {/*return <p className='currentOponent'>*/}
                                {/*<span>*/}
                                    {/*{this.state.team === elem.awayTeamName ? elem.homeTeamName : elem.awayTeamName}*/}
                                {/*</span>*/}
                            {/*</p>*/}
                        {/*}*/}
                    {/*})*/}
                    {/*}*/}
                    <input type='text'  onChange={e=> this.updateInput('newItem', e.target.value)}/>
                    <button type='button' onClick={()=>this.addItem()}>BET</button>
                </form>
                <ul>
                    {this.state.list.map(item => {
                        return (
                            <li key={item.id}>

                                 I bet {item.value} for win {item.team} in game with {item.oponent} on {item.date}


                            </li>
                        );
                    })}
                </ul>
            </div>
        )
    }
}

class Body extends React.Component{
    constructor(props){
        super(props);
    }
    render() {

        return (
            <div className='container'>
                <Header/>
                <Main/>
            </div>
        )
    }
}
class App extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <Body/>
        )
    }
}
document.addEventListener('DOMContentLoaded', function() {
    ReactDOM.render(
        <App/>,
        document.getElementById('app')
    );
})