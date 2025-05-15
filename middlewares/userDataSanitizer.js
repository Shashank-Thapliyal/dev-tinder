  export const sanitizeData = (user) =>{
      return {
          id : user._id,
          firstName : user.firstName,
          middleName : user.middleName,
          lastName : user.lastName,
          userName : user.userName,
          profilePic : user.profilePic,
          about : user.about,
          skills: user.skills
      }
    }