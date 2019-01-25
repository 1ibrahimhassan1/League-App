import React from 'react'
import Result from '../result/result'

class Base extends React.Component{
    constructor(){
        super()
        this.state = {
            value: [],
            inGame: [],
            noOfInputs: 1,
            arrOfInputs: [],
            renderResult: false,
            renderRetry: false
        }
        this.updateSummoner = this.updateSummoner.bind(this);
        this.updateNoOfInputs = this.updateNoOfInputs.bind(this);
        this.generateInputs = this.generateInputs.bind(this);
        this.displayResult = this.displayResult.bind(this);
        this.backToParent = this.backToParent.bind(this);
        this.sendRequest = this.sendRequest.bind(this);
        this.retrySearch = this.retrySearch.bind(this);
        this.refillInputArray = this.refillInputArray.bind(this);
    }

    componentDidMount(){
        console.log('in mount')
        this.setState({
            arrOfInputs: [<input id='0' key='0' className='form-control' type='text' value={this.state.summonerName} onChange={this.updateSummoner} required/>]
        })
    }

    updateSummoner(event){      
        let preArr = Array.from(this.state.value);
        preArr[event.target.id] = event.target.value;

        this.setState({value: preArr})
    }

    updateNoOfInputs(event){
        this.setState({noOfInputs: event.target.value})
    }

    generateInputs(event){
        event.preventDefault();

        this.setState({arrOfInputs: []})

        let postArr, preArr = new Array(this.state.noOfInputs);
        let resArr = new Array(this.state.noOfInputs);
        //for some reason, new Array(this.state.noOfInputs).fill(whatever) doesn't work, 
        //but assigning the values manually in a for loop does

        for(let i = 0; i < this.state.noOfInputs; i++){
            preArr[i] = i;
            resArr[i] = {};
        }

        postArr = preArr.map((pre) => <input id={pre.toString()} key={pre.toString()} className='form-control' type='text' value={this.state.summonerName} onChange={this.updateSummoner} required/>);

        this.setState({
            inGame: resArr,//done here to intialize array size to match size of noOfInputs (so that it is easier to iterate through?)
            value: preArr.fill(''),
            arrOfInputs: postArr
        });
    }

    displayResult(event){
        event.preventDefault();
        var promArr = new Array(this.state.noOfInputs);

        for(let i = 0; i < this.state.noOfInputs; i++){
            promArr[i] = this.sendRequest(i);
        }

        Promise.all(promArr)
        .then(summonersStatus => {
            let preArr = [];
            summonersStatus.forEach((summoner) => {
                preArr.push(summoner);
            })
            return preArr;
        })
        .then((preArr) => {
            this.setState({
                inGame: preArr,
                renderResult: true
            })
        })
        .catch(err => {
            console.log(err)
        })
    }

    sendRequest(index){
        return fetch('/submitSumm', {
            method: 'POST',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-type': 'application/json'
            },
            body: JSON.stringify({summonerID: this.state.value[index]})
        })
        .then(res => res.json())
        .then(data => data)
    }

    backToParent() {
        this.setState({
            value: [],
            inGame: [],
            noOfInputs: 1,
            arrOfInputs: [<input id='0' key='0' className='form-control' type='text' value={this.state.summonerName} onChange={this.updateSummoner} required/>],
            renderResult: !this.state.renderResult
        }) 
    }

    retrySearch(){
        this.setState({
            renderResult: !this.state.renderResult}, this.refillInputArray)
    }

    refillInputArray(){
        console.log('in refill')
        let preArr = new Array(this.state.noOfInputs);

        for(let i = 0; i < this.state.noOfInputs; i++){
            let idx = new Number(i).toString();
            preArr[i] = <input id={idx} key={idx} className='form-control' type='text' defaultValue={this.state.value[i]} onChange={this.updateSummoner} required/>
        }

        this.setState({arrOfInputs: preArr})
    }

    render(){
        return !this.state.renderResult ? (
            <div className='container-fluid'>
                <div className='col-md-4 col-md-offset-4'>  
                    <form onSubmit={this.displayResult}>
                        <h2 className='text-center'>Is summoner in game?</h2>
                        {this.state.arrOfInputs}
                        <br></br>
                        <input className='form-control btn-primary' type='submit' value='Check Summoner (may take a few seconds)' />
                    </form>
                </div>
                <div className='pull-right'>
                    <form onSubmit={this.generateInputs}>
                        <label>Multi-Search</label>
                            <select value={this.state.noOfInputs} className='pull-right' onChange={this.updateNoOfInputs}>
                                <option value='1'>1</option>
                                <option value='2'>2</option>
                                <option value='3'>3</option>
                                <option value='4'>4</option>
                                <option value='5'>5</option>
                            </select>

                            <input value='Change Search Amount' type='submit' className='form-control'/>
                    </form>
                </div>
            </div>
            
        ) : <Result summoners={this.state.inGame} backToParent={this.backToParent} retry={this.retrySearch}/>
    }
}

export default Base;

//{this.state.arrOfInputs.length > 0 ? this.state.arrOfInputs : <input id='0' key='0' className='form-control' type='text' value={this.state.summonerName} onChange={this.updateSummoner} required/>}