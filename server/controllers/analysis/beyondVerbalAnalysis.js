var Promise = require('bluebird');
var apiKeys = require('../../config/config.js');
var request = require('request-promise');
var path = require('path');
var querystring = require('querystring');
var requests = require('request');

/*
  http://www.beyondverbal.com/api-quick-integration-guide/
  Beyond Verbal Analysis includes:
    Temper value & group
    Valence value & group
    Arousal value & group
    Audio quality value & group
    Mood w/ phraseID & mood group
    Composit Mood w/ phraseID & composite mood group
*/
//test file
var recID = '65506cb3-49e1-402b-aca5-9bd83051d6f8';
var audioFile = path.join(__dirname + '/wavFiles/' + 'file.wav');
var options = {
  url: {
    tokenUrl: 'https://token.beyondverbal.com/token',
    serverUrl: 'https://apiv3.beyondverbal.com/v3/recording/'
  },
  apiKey: apiKeys.beyondVerbalKey,
  token: '7OFVcy-MdLXexCJstYnZIDJRXlPfQPHq58-jYC3uPjoOdafTT39LxsMJRpllQ5HX6kpzU5ggfJm7bykIptq4Iwzx7En4fe014Ltt25zEbmI3PMprPDJHAymgb5Xa36NqZolSsq5EfWlJgoJCMG9HvHqxhPVsVW9QNE0-Ys2JyxsUTeYnPC3N7QsezQfpTYaStX1twqrGR9Wp9S-39sH7vt2y4izJtYsy5vOrLLV2M__zy_wY42hI-S7eJjvTK6RLMjafSKZyqGZG0_fEMIDLIVns8WtTdCD-oBhy-UAs1dOAkzlCkGnwEk5RlpZ-fFU8CbmxfpgccrXs3yDUy_Kq-ozgCGpP6NvNEFlIEPjYwsRLynH3BniKH_4osbcL3QFkfQaMYIvDpzwR7XL6Qrci5cZEMUtCDtnsOT3XDAIHk4ut7w4XayIjd37ayNsfztDXVxwPcj9tgM5kS0gwJ1B0IEcC-AdAxbfAVZ2IeEOHiV6bG5nnmGqjipjZ-hVVFbQB-WULmJKDGYKenGONrIP4EzZNAfEtRrsilyqSX9T2wcn5ndxv6ImynDeNjMRVkuyv9xqoI9Gq3rRis2cpWPHt88ql6eXcvgz3b50t3VZXM16hPSIDC_DFCWl_GY5HMuwcGPpT_oKvUC3KDUavW6KgamHrpPGQ6Y4VSsiuZiw74Re9RyFnGWMUwb3fXvu0B_pSNsSGyNBrhQRs3tGWfEvf-l28S0hYmny9PB9Jq_HthjRxVbVvH4lbrkakINsuqFmTxx7LE_BK9iWhQsJk7lULtP3XNgphdbZIxVf6gjm6japK16kS',
  // token: 'AsbAg64di-pPw9sE16_W7zOXCIXCPue2g8asZj-ep05uSzuifEgEW2jJhaSikdawd9YYRP7YWBeQIgncCPlSXA_UFqgQR_EH7MWMfQ7rTS_6TMZnM3EbyFhvyESfh9NsTPGWF-2GoN5MdD4j6jj6Uk7j5DAYb8AAHTYzSYOFnQOzErD8UutJoxDbfaJOtw8vo-8pNhkX4Qf80Mac3dRa12CM36esylvziqhjN0063T1axc0iSOnbIPTyqloYw68AVoz10xoouYvy-yq-mFqKUeHt-J_0M6miAm5-VCfFknhRVu6hxtrlDMirEVvpuO5p3fL3uyQCJzKu9XPdQAaHc37rWb9c3N1ugvy5gNIOchZuEv27eE3CQYltdt1UNrd9LFl3St4K_SwNrQDqFCeojTBDnteXhuh-6XsCxqYleh3VuQRiTqwJwwV3OU-THOp0obxtQIKxQatH9yhfpoh_Now3myLjheivHW6oNtFf7OL9DotBVz2A2dk_Vhne1uFkG2zBVXC4me06xmD4C3bsOcPLURuq7IETq4a_j8idhhB7psHJIbPeE3YOpjntbIM7UkBCFPevKjpyFI06wQsD6CRQTAoB00mUKefMh5zgcNy2_UC-XeTXp4xzuhOu4ibzQLwOtZhQyaLVqYrTTgXkbcAABemvmThmlaNfskBgY3SKRJs7iHigJ5esQQf-3fj37EXF17paMniTNRxjDW-ohZR1-XApgLW50kYbdZtxoCPbCkq048iecHDuPO3vsbMjah_hIAVTvehFWf_FgSiauAZZ1JPPDrhfWKEs1GvM9WWuWvQZ',
  interval: 0
};
// 1. Authentication POST request w/ API key to get auth token
function authenticate() {
  console.log('authenticate line 29 called');
  console.log('url token: ', options.url.tokenUrl);

  var optionsAuth = {
    method: 'POST',
    url: options.url.tokenUrl,
    headers: {'Content-Type': 'application/x-www-form-urlencoded'},
    body: querystring.stringify({
      grant_type: "client_credentials",
      apiKey: options.apiKey
    })
  }
  request(optionsAuth)
    .then(function(data, err) {
      if (err) { console.log('error', err) };
      var token = JSON.parse(data);
      console.log('token', token);
      analyzeFile(options.apiKey, audioFile, token, 7000);
    });
};
//2. Start POST request w/ auth token to initialize analysis session
function analyzeFile(apiKey, content, token, interval) {
  console.log('analyzeFile line 49 called');
  var startUrl = options.url.serverUrl + "start";
  // console.log('url: ' + startUrl + ' token: ' + options.token);
  console.log(startUrl, 'startUrl');

  var optionsAF = {
    method: 'POST',
    url: startUrl,
    headers: {
      'Authorization': "Bearer " + options.token
    },
    body: {
      dataFormat: { type: "WAV" },
    },
    json: true
  }

  request(optionsAF)
    .then(function(data, err) {
      if (err) { console.log('Error: ', err) }
      var recID = data.recordingId ? data.recordingId : JSON.parse(data).recordingId;
      upstreamRequest(recID, content);
    })

}
//3. if response.status is 'success' then Upstream POST request w/ 
//   auth token and wav file to get response(response.analysisSegments)
function upstreamRequest(recID, wavFile) {
  console.log('line 67 upstreamRequest called');
  // recID = '65506cb3-49e1-402b-aca5-9bd83051d6f8'
  console.log('recid: ' + recID);
  var upstreamUrl = options.url.serverUrl + recID;
  var optionsUR = {
    method: 'POST',
    url: upstreamUrl,
    headers: { 'Authorization': "Bearer " + options.token },
    body: querystring.stringify({
      data: wavFile,
    })
  }
  request(optionsUR)
    .then(function(data, err) {
      if (err) { console.log('Error: ', err) }
        console.log(data, 'data');
      // getAnalysis(recID);
    })
}
// 4. Analysis GET request w/ auth token and recording id to get full analysis
function getAnalysis(recID) {
  console.log('getAnalysis line 88 called');
  var pTimer = null;
  var analysisUrl = options.url.serverUrl + recID + '/analysis?fromMs=' + options.interval;
  var optionsGA = {
    method: 'GET',
    url: analysisUrl,
    headers: { 'Authorization': "Bearer " + options.token },
  }

  pTimer = setInterval(function() {
    console.log('pTimer interval started line 98')
    request(optionsGA)
      .then(function(res, err) {
        console.log('line 101', res);
        if (res.result.sessionStatus === "Done") {
          if (pTimer) {
            clearInterval(pTimer);
          }
        }
        //TODO: save to results to db
      }, interval);
  });
}

module.exports.beyondVerbalAnalysis = function(audioFile) {
  console.log('beyondVerbalAnalysis called line 119');
  // authenticate()
  // analyzeFile(options.apiKey, audioFile, options.token, 7000);
  upstreamRequest(recID, audioFile);
}

module.exports.beyondVerbalAnalysis(audioFile);






