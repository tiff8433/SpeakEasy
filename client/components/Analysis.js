var React = require('react');
var Graph = require('./Graph.js');
var helpers = require('../config/helper.js');
var VideoPlayer = require("./VideoPlayer.js");
var Navbar = require('./Navbar.js');

var Analysis = React.createClass({

  getInitialState: function(){
    return {
      videoSource: '',
      analysis: {}
    }
  },

  componentDidMount: function(){
    var that = this;
    helpers.getVideoAnalysis(this.props.params.videoID)
      .then(function(response){
        var analysis = JSON.parse(response.data.videoEmotionAnalysis).frames;
        var videosource = "https:" + response.data.videoUrl;
        var analysisData = helpers.getEmotionData(analysis);
        //analysisData.attentionData
        this.setState({
          videoSource: videosource,
          analysis: {
            series:[{
              data: analysisData.attentionData,
              name: 'attention'
            },
            {
              data: analysisData.negativeData,
              name: 'negative'
            },
            {
              data: analysisData.smileData,
              name: 'smile'
            },
            {
              data: analysisData.surpriseData,
              name:'surprise'
            }]
          }
        }) 
      }.bind(this))
  },
  render: function() {
    return (
      <div>
      <Navbar />
        <div className="container">
          <div className="row">
            <div className="col s8">
                <VideoPlayer data={this.state.videoSource} /> 
                <div className="graph">
                  <Graph data={this.state.analysis}/>
                </div>
            </div>
            <div className="col s4"> 
              <div className="video-info">
                <h4>Project Title</h4>
                <p>Date updated: January 22, 2016</p>
              </div>
            </div>
          </div>
    
        </div>
      </div>
    )
  }
});

module.exports = Analysis;