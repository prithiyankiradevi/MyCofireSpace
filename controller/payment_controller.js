const razorpay = require('razorpay')
const payment = require('../model/payment_model')
const space = require('../model/space_model')
const user = require('../model/user_model')
const moment=require('moment')
const { default: mongoose } = require('mongoose')

const createOrderId = (req, res) => {
  var instance = new razorpay({ key_id: 'rzp_test_1M3l9kHH6n1AEt', key_secret: 'LM5Lel1dcVMYcvTKnFUFXbG8' })

  var options = {
    amount: 50000,  // amount in the smallest currency unit
    currency: "INR",
    receipt: "order_rcptid_11"
  };
  instance.orders.create(options, function (err, order) {
    if (err) {
      res.status(401).send({ success: 'false', message: 'failed' })
    } else {
      req.body.orderId = order.id,
        // req.body.paymentPersonId = req.params.userId
      payment.order.create(req.body, (err, data) => {
        if (err) { throw err }
        else { res.status(200).send({ success: 'true', message: 'successfully generated orderId', data }) }
      })

    }

  });
}


const createPaymentDetails =async(req, res)=>{  
  try{
    const alreadyExists=await payment.transcation.aggregate([{$match:{"userId":req.params.userId}}])
    if(alreadyExists.length!=0){

      const userData=await user.aggregate([{$match:{"_id":new mongoose.Types.ObjectId(req.params.userId)}}])
      
      const oldDate=new Date(userData[0].subscriptionEndDate)
      const currentDate=new Date()
      const differInDays=moment(oldDate).diff(moment(currentDate),'days')

      if(req.body.subscriptionPlan=='1 month'){
       
        req.body.validityDays=30+differInDays
        req.body.subscriptionEndDate=moment(new Date()).add(30+differInDays,'days').toISOString()
          }
      if(req.body.subscriptionPlan=='3 month'){
        req.body.validityDays=60+differInDays
        req.body.subscriptionEndDate=moment(new Date()).add(90+differInDays,'days').toISOString()
          }
      if(req.body.subscriptionPlan=='6 month'){
          req.body.validityDays=180+differInDays
          req.body.subscriptionEndDate=moment(new Date()).add(180+differInDays,'days').toISOString()
          }
      if(req.body.subscriptionPlan=='1 year'){
            req.body.validityDays=360+differInDays
            req.body.subscriptionEndDate=moment(new Date()).add(360+differInDays,'days').toISOString()
          }
          req.body.userId=req.params.userId
          const createPaymentAgain=await payment.transcation.create(req.body)

    } 

    else{
      req.body.userId=req.params.userId
      const paymentCreated=await payment.transcation.create(req.body)
      console.log(paymentCreated)

      if(paymentCreated.subscriptionPlan=='1 month'){
        req.body.subscriptionEndDate=moment(paymentCreated.createdAt).add(30,'days').toISOString()
        console.log(req.body.subscriptionEndDate)
        req.body.validityDays=30
          }

      if(paymentCreated.subscriptionPlan=='3 month'){
        req.body.subscriptionEndDate=moment(paymentCreated.createdAt).add(90,'days').toISOString()
        req.body.validityDays=60
          }

      if(paymentCreated.subscriptionPlan=='6 month'){
          req.body.subscriptionEndDate=moment(paymentCreated.createdAt).add(180,'days').toISOString()
        req.body.validityDays=180
          }

      if(paymentCreated.subscriptionPlan=='1 year'){
          req.body.subscriptionEndDate=moment(paymentCreated.createdAt).add(360,'days').toISOString()
            req.body.validityDays=360
          }
          
        req.body.subscriptionStartDate=paymentCreated.createdAt
        req.body.orderId=paymentCreated.orderId
        req.body.paymentStatus='paid'
        req.body.interest=true
    
  }

    const userUpdate = await user.findByIdAndUpdate(req.params.userId, req.body, { new: true })

    res.status(200).send({success:'true',message:'payment created successfully'})

  } catch(e){
    res.status(500).send({message:'internal server error'})

  } 
       
}


module.exports = {
  createOrderId,
  createPaymentDetails
}