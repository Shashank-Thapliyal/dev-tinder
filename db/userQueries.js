import User from "../models/User.model.js";

export const findAll = async ( ) =>{
    return await User.find();
}
export const findByEmail = async ( email ) =>{
    
    return await User.findOne({email});
}

export const findByID = async ( id ) =>{
    return await User.findById(id);
}


export const findByUserName = async ( userName ) =>{
    return await User.findOne({userName});
}


export const updateUser = async ( id, newData ) =>{
    return await User.findByIdAndUpdate(id, newData, {
        new : true
    });
}

export const deleteUserByID = async (id) => {
    return await User.findByIdAndDelete(id);
}