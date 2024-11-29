import jwt from "jsonwebtoken";
const isAuthenticated =async (req,res,next)=>{
    try{
        const token= req.cookies.token;//req me cokkies me hmne token create kr ke dala tha while login ise le ae 
        if(!token){//if not found token
            return res.status(401).json({
                message:"user not authenticated",
                success:false,
            })
        }
        const decode= jwt.verify(token,process.env.SECRET_KEY);//now decode that tken
        if(!decode){//if decode ni huwa
            return res.status(401).json({
                message:"invalid token",
                success:false
            })
        };
        req.id=decode.userId;//decode ho gaya to hmne token me userId dali thi when we created the token in login wala cotroller ie when user login krega tb token bnega .get that user if and put it in req id
        next();//yaha tk sb thik h to send it to next route

    }catch(error){
        console.log(error);
    }
}
export default isAuthenticated;