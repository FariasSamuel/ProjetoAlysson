const Post = require('../../modules/Post');
module.exports = {
    Query:{
        sayHi(){
            console.log("Hello")
        },
        async getPosts(){
            try{
                const posts = await Post.find();
                return posts;
            }catch(e){
                throw new Error(e); 
            }
        }
        
    }   
}