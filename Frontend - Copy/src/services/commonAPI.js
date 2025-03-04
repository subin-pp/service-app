import axios from "axios"
const commonAPI=async(HttpMethod,url,reqBody,reqHeaders)=>{
    const reqConfiq={
        method:HttpMethod,
        url,
        data:reqBody,
        headers:reqHeaders ? reqHeaders : {"Content-Type":"application/json"}
        
    }
    console.log(reqConfiq);
    
    return  await axios(reqConfiq).then(res=>{
        return res;
    }).catch(err=>{
        return err
    })
}
export default commonAPI