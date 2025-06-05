import validator from "validator";

export const validateData = (data) =>{
    const {firstName,lastName,userName,email,password,dob,gender} = data.body;

    if(!firstName || !userName || !email || !password  || !dob || !gender  ){
        throw new Error("Please enter the required fields")
    }

    if(!validator.isEmail(email)){
        throw new Error("Please enter a valid email")
    }

    if(!validator.isStrongPassword(password)){
        throw new Error("Password must be 8 characters long and contain at least one uppercase letter, one lowercase letter, one number and one special character")
    }
    
    if(!validator.isDate(dob)){
        throw new Error("Please enter a valid date")
    }

    if(!validator.isIn(gender,["male","female","others"])){
        throw new Error("Please enter a valid gender")
    }

}