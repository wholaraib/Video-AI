import { dbConnect } from "@/utils/db";
import { NextResponse, NextRequest } from "next/server";
import User from "@/Models/User";

export async function POST(request: NextRequest) {
    // Handle user registration by extracting email and password from the request body
    try{
        const {email, password} = await request.json();
        if(!email || !password) {
            return NextResponse.json(
                {error: "Email and password are required"},
                {status: 400}
            )
        }

    
    // Ensure to connect to the database before performing any operations
        await dbConnect();

    // Validate the input and check if the user already exists
    // If the user exists, return an error response

        const existingUser = await User.findOne({ email });
        if(existingUser) {
            return NextResponse.json(
                {error: "User already registered"},
                {status: 400}
            );
        } 
    // If the user does not exist, create a new user and return a success response
        const newUser = await User.create({
            email,
            password});
        
        return NextResponse.json({
            message: "User registered successfully",
            status: 200,
        })

    }catch (error) {
        // Handle any errors that may occur during the registration process
        console.log("registration error:", error);
        return NextResponse.json({
            message: "Failed to register user",
            status: 500,
        })
    }
}