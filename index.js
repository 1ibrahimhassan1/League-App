const express = require('express');
const fetch = require('node-fetch');
const bodyParser = require('body-parser')

const app = express();

app.use(bodyParser.json());

var summonerName = ''; //recieved from post request

//connecting to server
const apiKey = '?api_key=RGAPI-c8f56c6c-882d-4c92-8aad-5485e497453';//key needs to be replaced every 24h
const riotUrl = 'https://na1.api.riotgames.com'

//routes
const getSummonerInfo = `/lol/summoner/v4/summoners/by-name/`;
const getActiveGame = `/lol/spectator/v4/active-games/by-summoner/`; //ends with {encryptedSummonerId}

app.get('/searchSumm', (req, res) => { //send API request to riot for current game
  let summonerName = req.query.summonerName;
  
  console.log('searching for: ' + summonerName + "'s current game")
  try{
  fetch(riotUrl + getSummonerInfo + summonerName + apiKey)
  .then(res => res.json())
  .then((data) => {
    return fetch(riotUrl + getActiveGame + data.id + apiKey)
  })
  .catch((err) => {//if any of the api calls fail, they will be redirected here and this will end the try/catch block
    res.json({result: 10, summonerInQuestion: summonerName})
  })
  .then(res => res.json())
  .then((data) => {return new Promise((resolve,reject) => {
        if(data.status){
          data.status.message === 'Data not found' ? data.result = 10 : data.result = 0;
          data.summonerInQuestion = summonerName;
          reject(data); 
        } else{
          //since, on success, a status code isn't shipped as part of the
          //object, we add it here. 10 is a failure, 20 is success.
          //totally arbitrary numbers, btw
          data.result = 20;
          data.summonerInQuestion = summonerName;
          resolve(data);
        }
      }
    )}
  )
  .then((resolvedData) => {
    console.log('Found ' + summonerName + "'s game! The result code is: " + resolvedData.result)//time accessed with resolvedData.gameLength
    res.json(resolvedData)
  })
  .catch((rejectedData) => {
    console.log('Could not find ' + summonerName + "'s game. The result code is: " + rejectedData.result)
    res.json(rejectedData)
  })

} catch(err) {
  console.log(err);
}

})

app.post('/submitSumm', (req, res) => { //recieves summoner from front-end
  // summonerName = req.body.summonerID;
  // console.log(summonerName);
  //console.log('summonerID: ' + req.body.summonerID);
  res.redirect('/searchSumm?summonerName=' + req.body.summonerID);
})

app.listen('3001', () => console.log('listening to server on port: 3001'))

/* 
todo: done
    - basic front end is complete, both components work with each other
    - server makes calls to riot's api properly, just need to communicate 
      further and make the extra api call for the current game information
    - then configure the fetch requests from the front-end's side to make
      the proper requests from this backend
*/

/*
todo: done
    -state of inGame isn't resetting properly. once this is done, the basic
    functionality of the app is complete. from here, it will only be bonus styling
*/

/*
todo:
    - because the state of the app won't update until the entire fetch is completed
      there is a bit of lag on the front end. As such, consider implementing a 
      "loading screen" to distract user from the fact that the app is taking a bit 
      of time for the response to come through.
    - once styling is complete, attempt to implement functionality that allows for
      multi searches
*/
