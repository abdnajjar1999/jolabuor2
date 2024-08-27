const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const request = require('request');
const path = require('path');
const paytabs = require('paytabs_pt2');
const app = express();
const port = 3000;
const cors = require('cors');


app.use(cors({
    origin: 'https://jo-labour.web.app'  // Replace with your app's domain
}));



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
app.post('/initiate-payment', async (req, res) => {
  const { customerName, customerEmail, customerPhone, amount, currency, orderId,nationalNumber } = req.body;

  const url = 'https://secure-jordan.paytabs.com/payment/request';
  const headers = {
    'authorization': 'STJ9TLHGG9-JJRKDN9HRM-ZN2MRRTGTD',
    'Content-Type': 'application/json',
  };
  const body = {
    'profile_id': 150335,
    'tran_type': 'sale',
    'tran_class': 'ecom',
    'cart_id': orderId,
    'cart_description': nationalNumber,
    'cart_currency': currency,
    'cart_amount': amount,
    'callback': `https://jo-labour.web.app?status=failed&id=${orderId}`,
    'return': `https://jo-labour.web.app?status=success&id=${orderId}`,
    'customer_details': {
      'name': customerName,
      'email': customerEmail,
      'phone': customerPhone,
      'street1': 'Address Line 1',
      'city': 'City',
      'state': 'State',
      'country': 'Country',
      'zip': '00000',
    },
    "hide_shipping": true,
    //"hide_billing": true,
  };

  try {
    const response = await axios.post(url, body, { headers });
    if (response.status === 200) {
      res.json({ success: true, redirect_url: response.data.redirect_url, tran_ref: response.data.tran_ref});
      console.log(response.data);
    } else {
      res.status(response.status).json({ success: false, message: 'Failed to initiate payment' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error occurred', error: error.message });
  }
});
app.post('/query', async (req, res) => {
  const { tranRef } = req.body;

  const url = 'https://secure-jordan.paytabs.com/payment/query';
  const headers = {
    'authorization': 'STJ9TLHGG9-JJRKDN9HRM-ZN2MRRTGTD',
    'Content-Type': 'application/json',
  };
  const body = {
    'profile_id':150335,
    "cart_id": tranRef
  };

  try {
    const response = await axios.post(url, body, { headers });
    if (response.status === 200) {
      res.json(response.data);
      console.log(response.data);
    } else {
      res.status(response.status).json({ success: false, message: 'Failed to initiate payment' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error occurred', error: error.message });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
