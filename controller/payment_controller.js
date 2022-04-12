const razorpay=require('razorpay')

const createPayment=(req,res)=>{
    var instance = new razorpay({ key_id: 'rzp_test_1M3l9kHH6n1AEt', key_secret: 'LM5Lel1dcVMYcvTKnFUFXbG8' })

  var options = {
    amount: 50000,  // amount in the smallest currency unit
    currency: "INR",
    receipt: "order_rcptid_11"
  };
  instance.orders.create(options, function(err, order) {
    console.log(order);
    res.send(order)
  });
}

module.exports={
    createPayment
}