const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const path = require('path');
const paytabs = require('paytabs_pt2');
const app = express();
const port = 3000;


let profileID = "147514";
let serverKey = "SBJ9TLHG2L-JJLNNTR9JR-ZZKWDNKNTT";
let region = "JOR";

paytabs.setConfig(profileID, serverKey, region);

let paymentMethods = ["all"];
let transaction = {
  type:"sale",
  class:"ecom"
};
let transaction_details = [
    transaction.type,
    transaction.class
];

let customer_details = [
    "",

];

let shipping_address = customer_details;
const url = {

  callback: "http://localhost:3000/sucsses",
  response: "https://rejected.us"
};
let response_URLs = [
    url.response,
    url.callback
];

let lang = "ar";



let frameMode = false;

// Set up body-parser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Set up EJS
app.set('view engine', 'ejs');

// Serve static files
app.use(express.static(path.join(__dirname)));

// Route to display the form
app.get('/', (req, res) => {
  res.render('index.ejs');
});
app.get('/sucsses', (req, res) => {
  res.render('sucsses.ejs');
});

app.post("/", (req, res) => {
  console.log(req.body);
let amuont
if(req.body.choice==0){
amuont=req.body.donationamount;
}else{
  amuont=req.body.choice
}
const cart = {

  id: "4244b9fd-c7e9-4f16-8d3c-4fe7bf6c48ca",
  description: "Dummy Order 35925502061445345",
  currency: "JOD",
  amount:amuont,
  callback: "http://localhost:3000/sucsses",
  return: "https://rejected.us"
};
let cart_details = [
    cart.id,
    cart.currency,
    cart.amount,
    cart.description
];

  let paymentPageCreated = function ($results) {
    console.log($results);
    res.redirect($results.redirect_url);
  }


  console.log("this work");

  try {
    paytabs.createPaymentPage(
      paymentMethods,
      transaction_details,
      cart_details,
      customer_details,
      shipping_address,
      response_URLs,
      lang,
      paymentPageCreated,
      frameMode                       
       // boolean expected
  );

    // Example code to send a POST request using request module
    
  } catch (error) {
    console.error("Failed to make request:", error.message);
    res.render("solution.ejs", {
      error: "No activities that match your criteria.",
    });
  }
});

app.post('/sucsses', (req, res) =>{
  const paymentData = req.body;

  // Log the payment data received from PayTabs
  console.log('Payment Callback Received:', paymentData);
console.log("kdkdkdkrkgm");
  // Handle the callback data (e.g., update order status, notify the user)
  if (paymentData.response_code === '100') {
      // Payment was successful
      console.log('Payment Successful:', paymentData);
      // Perform actions like updating the order status in the database
  } else {
      // Payment failed or was canceled
      console.log('Payment Failed or Canceled:', paymentData);
      // Handle failure (e.g., log the error, retry payment, notify the user)
  }

  // Respond to PayTabs to confirm receipt of the callback
  res.sendStatus(200);
});
// Start the server
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
