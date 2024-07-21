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
    "ABD abd abd",

];

let shipping_address = customer_details;
const url = {

  callback: "https://rejected.us",
  response: "https://www.success.com"
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
  callback: "https://rejected.us",
  return: "https://www.success.com"
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

// Start the server
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
