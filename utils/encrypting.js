import bcrypt from 'bcrypt';

export const encryptPassword = async (password) =>{
    try{
        if(!password){
            throw new Error("Password is required");
        }
        const saltRounds = 12;
        const salt = await bcrypt.genSalt(saltRounds);
        const hash = await bcrypt.hash(password, salt);
        return hash;
    }catch(err){
        console.error("Error while hashing password:", err);
        throw new Error("ERROR" + err.message);
    }
}   


export const comparePassword = async (password, hash) =>{
    try{
        if (!password || password.trim().length === 0) {
            throw new Error("Password is required.");
        }
        if (!hash) {
            throw new Error("Hash is required.");
        }
    
        const isMatch = await bcrypt.compare(password, hash);
        return isMatch;

    }catch(err){
        console.error("Error while comparing password:", err);
        throw new Error("ERROR" + err.message);
    }

}

