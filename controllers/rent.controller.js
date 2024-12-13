import { uploadToCloudinary } from "../middlewares/uploadMiddleware.js";
import Catelog from "../models/catalog.js";

export const publishRent = async (req, resp) => {
  const {
    firstName,
        lastName,
        contactNumber,
        email,
        city,
        brand,
        price,
        size,
        rentalDate,
        productName,
        productDescription,
        color,
        category
  } = req.body;
  console.log(req.file, "file");
  try {
    const uploadedFile = await uploadToCloudinary(req.file?.path);

    if (!uploadedFile) {
      throw new Error("File not uploaded")
    }

    const data = await Catelog.create({
      firstName,
        lastName,
        contactNumber,
        email,
        city,
        brand,
        price,
        size,
        rentalDate,
        productName,
        productDescription,
        color,
        category,
        imagePath: uploadedFile
    });

    if (!data) {
      return resp.json({
        status: 401,
        message: "An error while storing the data",
      });
    }
    return resp.json({
      status: 201,
      message: "Data posted successfully",
      data: data,
    });
  } catch (error) {
    console.log(error);
    return resp.json({
      success: false,
      message: "Internal server error",
      error,
    });
  }
};


export const editRent = async (req, resp) => {
  const { productId } = req.params
  const {
    firstName,
        lastName,
        contactNumber,
        email,
        city,
        brand,
        price,
        size,
        rentalDate,
        productName,
        productDescription,
        color,
        category
  } = req.body;
  console.log(req.file, "file");
  try {
    const uploadedFile = await uploadToCloudinary(req.file?.path);

    if (!uploadedFile) {
      throw new Error("File not uploaded")
    }

    const data = await Catelog.findByIdAndUpdate({_id: productId}
      , {
        $set: {
            firstName,
              lastName,
              contactNumber,
              email,
              city,
              brand,
              price,
              size,
              rentalDate,
              productName,
              productDescription,
              color,
              category,
              imagePath: uploadedFile
          }
      }
    );

    if (!data) {
      return resp.json({
        status: 401,
        message: "An error while storing the data",
      });
    }
    return resp.json({
      status: 201,
      message: "Data posted successfully",
      data: data,
    });
  } catch (error) {
    console.log(error);
    return resp.json({
      success: false,
      message: "Internal server error",
      error,
    });
  }
};



