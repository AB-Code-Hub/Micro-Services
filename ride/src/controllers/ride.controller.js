import { Ride  as rideModel} from "../models/ride.model.js";

export const createRide = async (req, res) => {
        try {
            const {pickup, destination} = req.body;

            if(!pickup || !destination) {
                return res.status(401).json({message: "Pickup and destination is required "})
            }

            const newRide = new rideModel({
                user: req.user._id,
                pickup,
                destination

            })

            await newRide.save()
        } catch (error) {
            
        }        
}

