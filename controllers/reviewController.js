var ReviewModal = require('../models/reviewModel')
var async = require('async')
var reviewController = {
  //
  // ──────────────────────────────────────────────────────────────────── I ──────────
  //   :::::: A D D   R E V I E W D A T A : :  :   :    :     :        :          :
  // ──────────────────────────────────────────────────────────────────────────────
  //


  addReview: function(request_data, callback) {
    async.waterfall([
      addReview
    ], function(err, response) {
      if (err) {
        callback({
          sucess: false,
          message: err
        })
      } else {
        callback({
          sucess: true,
          data: response,
          message: 'added successfully'
        })
      }
    })

    function addReview(callback) {
      var ReviewData = new ReviewModal({
        comment: request_data.comment,
        rating: request_data.rating,
        userid: request_data.userid,
        vendorid: request_data.vendorid
      })
      ReviewData.save(function(err, response) {
        if (err) {
          callback(err)
        } else {
          callback(null, response)
        }
      })
    }
  },
  //
  // ──────────────────────────────────────────────────────────────────── II ──────────
  //   :::::: G E T   R E V I E W D A T A : :  :   :    :     :        :          :
  // ──────────────────────────────────────────────────────────────────────────────
  //

  getReview: function(request_data, callback) {
    async.waterfall([
      getReviewData
    ], function(err, response) {
      if (err) {
        callback({
          sucess: false,
          message: err
        })
      } else {
        callback({
          sucess: true,
          data: response,
          message: 'fetch successfully'
        })
      }

    })


    function getReviewData(callback) {
      ReviewModal.find({
        vendorid: request_data._id
      }).
      populate({
          path: 'userid vendorid'
        })
        .sort('-date').exec(function(err, response) {

          if (err) {
            callback(err)
          } else {
            callback(null, response)
          }
        })
    }
  },


}
module.exports = reviewController