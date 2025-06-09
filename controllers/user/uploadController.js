import cloudinary from "../../utils/config/cloudinary.js";

const uploadProfilePic = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "File not uploaded" });
        }

        const uploadResult = await new Promise((resolve, reject) => {
            const upload_stream = cloudinary.uploader.upload_stream(
                {
                    folder: "devTinder/profilePics",
                    resource_type: "image"
                },
                (err, result) => {
                    if (err) {
                        console.log("Cloudinary ERROR: ", err);
                        return reject(err);
                    }
                    resolve(result); 
                }
            );

            upload_stream.end(req.file.buffer);
        });

        return res.status(200).json({
            message: "Image uploaded successfully",
            publicID : uploadResult.public_id,
            url: uploadResult.secure_url
        });

    } catch (error) {
        return res.status(500).json({
            message: "Error while uploading the Image",
            error: error.message
        });
    }
};


export default uploadProfilePic;