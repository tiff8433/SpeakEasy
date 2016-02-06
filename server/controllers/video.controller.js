var Analysis = require('../models/analysis.model.js');
var mongoose = require('mongoose');

var updateVideo = function(data) {
 var videoId = data.videoId;
 var update = { isPrivate: data.isPrivate };
 Analysis.findByIdAndUpdate(videoId, update, {new: true}, function(err, model) {
   if(err) {console.log('Error updating model: ', err.message)} 
    console.log('Updated Video Privacy to: ', model.isPrivate)
 });
};

var getPublicVideos = function(req, response) {
  Analysis.find({ isPrivate: false }, 
    '_id videoUrl date title thumbnail_url description isPrivate username')
    .then(function (data) {
      var publicVideos = JSON.stringify(data);
      response.status(200).send(publicVideos);
    })
};

var getComments = function(videoId, response) {
  Analysis.find({ _id: videoId },
  '_id videoUrl date title thumbnail_url description username comments')
  .then(function(data) {
    var commentData = JSON.stringify(data);
    response.status(200).send(commentData);
  })
};

var addComment = function(data) {
  console.log(data.videoId,'videoId');
  console.log(data.text, 'text');
  console.log(data.username, 'username');
  //TODO: save to database with date
  // var update = {}
  // Analysis.findbyIdAndUpdate({ _id: videoId }, {new: true}, function(err, model) {
  //   if (err) {console.log('Error adding comment: ', err.message)}

  // });
}



module.exports = {
  updateVideo: updateVideo,
  getPublicVideos: getPublicVideos,
  getComments: getComments,
  addComment: addComment
}
