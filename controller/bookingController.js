const { asyncCatch } = require("../utils/asyncCatch");
const GlobalError = require("../error/GlobalError");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const Tour = require("../model/tour");

exports.checkout = asyncCatch(async (req, res) => {
  console.log(req.params.tourId);
  const tour = await Tour.findById(req.params.tourId);
  const session = await stripe.checkout.sessions.create({
    line_items: [
      {
        // Provide the exact Price ID (for example, pr_1234) of the product you want to sell
        price_data: {
          currency: "usd",
          product_data: {
            name: tour.name,
          },
          unit_amount: tour.price * 100,
        },
        quantity: 1,
      },
    ],

    payment_method_types: ["card"],
    mode: "payment",
    // client_reference_id: req.params.tourId,
    customer_creation: "always",
    customer_email: req.user.email,
    success_url: `http://localhost:3000`,
    cancel_url: `http://localhost:3000/error`,
  });

  res.status(200).json({ success: true, session });
});
