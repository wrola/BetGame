import React, {Component} from "react";
import Slider from './Slider.jsx';

class Main extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            team: '',
            options: [],
            dateOfTheMatch: '',
            newItem: '',
            list: []
        }
    }

    componentDidMount = () => {
        fetch('https://api.football-data.org/v1/competitions/398/teams', {
            headers: {'X-Auth-Token': '405e8d17c66e46e284d542c0fb7aacd5'},
            dataType: 'json'
        }).then(r => r.json()).then( data => {
            const chances = ((Math.random() * 10) + 1).toFixed(2);
            if (toString(chances).length > 4) {
                Math.round(chances)
            }
            ;
            this.setState({
                options: data.teams,
            })

        }).catch(e => {
            console.log('Błąd!!!!', e)
        });
        this.updateStateWithLocalStorage()
    }
    handleOption = (event) => {
        this.state.options.forEach((elem, i) => {
                if (elem.name === event.target.value) {
                    this.fetchOpponentsFromAPI(elem._links.fixtures.href);
                }
            },
            this.setState({
                team: event.target.value,
            })
        )
    }
    fetchOpponentsFromAPI = (url) => {
        fetch(url, {
            headers: {'X-Auth-Token': '405e8d17c66e46e284d542c0fb7aacd5'},
            dataType: 'json'
        }).then(r => r.json()).then(data => {
            data.fixtures.map((elem, i) => {
                if (new Date(elem.date) > Date.now()) {
                    if (this.state.team === elem.awayTeamName) {
                        this.setState({
                            dateOfTheMatch: elem.date,
                            oponent: elem.homeTeamName,
                        })
                    } else {
                        this.setState({
                            dateOfTheMatch: elem.date,
                            oponent: elem.awayTeamName,
                        })
                    }
                }
            }).catch(e => {
                console.log('Błąd!!!!', e)
            });
        })
    }

    updateInput = (key, value) => {
        const chances = ((Math.random() * 6) + 1).toFixed(2);
        const result = (Math.abs(value * chances)).toFixed(2);
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
            oponent: this.state.oponent,
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

        //upadate localStorage
        localStorage.setItem('list', JSON.stringify(list));
        localStorage.setItem('newItem', '');
    }

    deleteItem(id) {
        // copy current list of items
        const list = [...this.state.list];
        // filter out the item being deleted
        const updatedList = list.filter(item => item.id !== id);

        this.setState({
            list: updatedList
        });

        // update localStorage
        localStorage.setItem("list", JSON.stringify(
            updatedList
        ));
    }

    updateStateWithLocalStorage = () => {
        for (let key in this.state) {
            if (localStorage.hasOwnProperty(key)) {
                let value = localStorage.getItem(key);
                try {
                    value = JSON.parse(value);
                    this.setState({
                        [key]: value
                    })
                } catch (e) {
                    this.setState({
                        [key]: value
                    })
                }
            }
        }
    }
    render() {
            return(
        <div className="main">
            <form type="submit" className='main-form'>
                    <p>
                        Choose a team
                    </p>
                <Slider options={this.state.options} selectedTeam={this.handleOption}/>

                <p>Oponents</p>

                <input className='main-form-input' type='text'
                       onChange={e => this.updateInput('newItem', e.target.value)}/>
                <button className='main-form-btn btn' type='button' onClick={() => this.addItem()}>BET</button>
            </form>
            {console.log(this.state.img)}
            <section className="main-banner">
                    {this.state.list.map(item => {
                        return (
                            <div className='main-banner-el' key={item.id}>
                                <div className="main-banner-el-title">Bet ticket
                                fooball game </div>
                                <div className="main-banner-el-section">
                                        <p>{item.team} VS {item.oponent}</p>
                                        <button className='main-banner-btn btn' onClick={() => this.deleteItem(item.id)}>
                                        Remove
                                        </button>
                                </div>
                                <div className="main-banner-el-footer">
                                <p>
                                    {item.date}
                                </p>
                                    <p>
                                        Total value {item.value}
                                    </p>
                                </div>

                        </div>
                    );
                })}
            </section>
        </div>
            )
    }
}

export default Main;
