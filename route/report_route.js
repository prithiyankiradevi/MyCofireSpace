const route=require('express').Router()
const { Router } = require('express')
const report=require('../controller/report_controller')

route.post('/create',report.createReport)
route.get('/getAllReportList',report.getAllReport)
// route.delete('/deleteReport/:reportId',report.deleteReport)



route.post('/create/review/:spaceId',report.createReview)
route.get('/getAllReviewForSpace/:spaceId',report.getAllReviewForSpace)



module.exports=route