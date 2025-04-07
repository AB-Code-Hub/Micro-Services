import { Ride as rideModel } from "../models/ride.model.js";
import { publishToQueue } from "../service/rabbit.js";

export const createRide = async (req, res) => {
  try {
    const { pickup, destination } = req.body;

    if (!pickup || !destination) {
      return res
        .status(401)
        .json({ message: "Pickup and destination is required " });
    }

    const newRide = new rideModel({
      user: req.user._id,
      pickup,
      destination,
    });

    await newRide.save();

    publishToQueue("new-ride", JSON.stringify(newRide));


    return res
      .status(200)
      .json({ message: "ride Created successfully", data: newRide });
  } catch (error) {
    console.error("Error in create ride", error);
    return res
      .status(500)
      .json({ message: "Internal server Error", error: error.message });
  }
};

export const acceptRide = async (req, res) => {
  try {
    const { rideId } = req.query;

    if (!rideId) {
      return res.status(401).json({ message: "Ride ID is required" });
    }

    const ride = await rideModel.findById(rideId);

    if (!ride) {
      return res.status(404).json({ message: "Ride not found" });
    }

    ride.status = "accepted";

    await ride.save();

    publishToQueue("ride-accepted", JSON.stringify(ride));

    return res.status(200).json({ message: "Ride accepted successfully", data: ride });
  } catch (error) {
    console.error("Error in accept ride", error);
    return res.status(500).json({ message: "Internal server Error", error: error.message });
  }
}
