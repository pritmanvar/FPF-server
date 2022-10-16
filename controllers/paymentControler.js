import { instance } from "../server.js";
import crypto from "crypto";

export const checkout = async (req, res) => {

    const options = {
        amount: Number(req.body.amount * 100),
        currency: "INR",
    };

    const order = await instance.orders.create(options);

    res.status(200).json({

        // add razorpay_order_id, razorpay_payment_id, razorpay_signature to db
        success: true,
        order,
    });

};


export const payment = async (req, res) => {

    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
        req.body;

    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
        .createHmac("sha256", process.env.RAZORPAY_APT_SECRET)
        .update(body.toString())
        .digest("hex");

    const isAuthentic = expectedSignature === razorpay_signature;

    if (isAuthentic) {
        // Database comes here

        // await Payment.create({
        //     razorpay_order_id,
        //     razorpay_payment_id,
        //     razorpay_signature,
        // });

        res.redirect(

            // find data from db with razorpay_payment_id

            `http://localhost:3000/ordersuccess?reference=${razorpay_payment_id}&product=product&date=11-06-04&total=30`

        );
    } else {
        res.status(400).json({
            success: false,
        });
    }

}; 