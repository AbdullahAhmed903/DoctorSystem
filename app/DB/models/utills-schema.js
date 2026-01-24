import { Schema } from "mongoose";



const AddressSchema = new Schema({
    address: String,
    city: String,
    state: String,
    country: String,
    postalCode: String
}, { _id: false });



export { AddressSchema };