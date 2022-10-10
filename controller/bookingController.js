const { asyncCatch } = require("../utils/asyncCatch");
const GlobalError = require("../error/GlobalError");

//*Stripe
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

exports.checkout = asyncCatch(async (req, res) => {
  const tourId = req.params.tourId;

  const product = await stripe.products.create({ name: "Start wars" });

  const price = await stripe.prices.create({
    product: product.id,
    unit_amount: 2000,
    currency: "usd",
  });

  const checkout = await stripe.checkout.sessions.create({
    line_items: [
      {
        // Provide the exact Price ID (for example, pr_1234) of the product you want to sell
        price: price.id,
        quantity: 1,
      },
    ],
    mode: "payment",
    success_url: `${req.protocol}://${req.get("host")}`,
    cancel_url: `${req.protocol}://${req.get("host")}/error`,
  });

  res.status(200).json({ success: true, checkout });
});
