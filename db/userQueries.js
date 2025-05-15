import User from "../models/User.model.js";

export const findAll = ( ) =>{
    return  User.find();
}
export const findByEmail =  ( email ) =>{
    
    return  User.findOne({email});
}

export const findByID =  ( id ) =>{
    return  User.findById(id);
}


export const findByUserName =  ( userName ) =>{
    return  User.findOne({userName});
}


export const updateUser =  ( id, newData ) =>{
    return  User.findByIdAndUpdate(id, newData, {
        new : true
    });
}

export const deleteUserByID =  (id) => {
    return  User.findByIdAndDelete(id);
}