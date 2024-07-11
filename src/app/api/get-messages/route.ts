import { getServerSession } from "next-auth";
import { authOption } from "../auth/[...nextauth]/option";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { User } from "next-auth";
import mongoose from "mongoose";


export async function GET(request: Request){
    await dbConnect();

    const session = await getServerSession(authOption);
    const user: User = session?.user;
  
    if (!session || !session.user) {
      return Response.json(
        {
          success: false,
          message: "Not Authenticated",
        },
        {
          status: 401,
        }
      );
    }
  
    const userId = new mongoose.Types.ObjectId(user._id);
    try {
        const user = await UserModel.aggregate([
            {$match:{id: userId}},
            {$unwind:'$messages'},
            {$sort: {'messages.createdAt': -1}},
            {$group: {_id: '$_id' , messages:{$push:'$messages'}}}
        ])

        if(!user || user.length === 0 ){
            return Response.json(
                {
                  success: false,
                  message: "User not found",
                },
                {
                  status: 401,
                }
              );
        }
        return Response.json(
            {
              success: true,
              messages: user[0].messages,
            },
            {
              status: 401,
            }
          );
    } catch (error) {
        console.log("An unexpected error occured: " , error)
        return Response.json({
            success: false,
            message:"Not Aunthenticated"
        },{status: 500})
    }

}