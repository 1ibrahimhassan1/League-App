import React from 'react';

class Result extends React.Component {
    render(){
        let result = (res) => {
            switch (res){
                case 0:
                    return ' was not found'
                case 10: 
                    return ' is not in game'
                case 20:
                    return ' is in game'
                default:
                    return;
            } 
        }
        let preArr = this.props.summoners.map((summoner) => {
            return (
                <div>
                    <h4 key={summoner.summonerInQuestion} className='text-center'>
                        {summoner.summonerInQuestion} 
                        {result(summoner.result)}
                    </h4>                    
                    <hr></hr>
                </div>
            )
        })
        return (
            <div className='col-md-4 col-md-offset-4'>
                
                   {preArr} 
                
                <button className='btn btn-warning btn-block' onClick={this.props.backToParent}>Search Again</button>
                <button className='btn btn-primary btn-block' onClick={this.props.retry}>Retry Search</button>
            </div>
        )
    }
}

export default Result;