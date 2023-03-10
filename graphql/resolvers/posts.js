const Post = require('../../modules/Post');
const checkAuth = require('../../util/check-auth');
const { AuthenticationError, UserInputError } = require('apollo-server');

module.exports = {
    Query:{
        sayHi(){
            console.log("Hello")
        },
        async getPosts(){
            try{
                const posts = await Post.find().sort({createdAt: -1});
                return posts;
            }catch(e){
                throw new Error(e); 
            }
        },
        
        async getPost(_,{postId}){
            try{
                const post = await Post.findById(postId);
                if(post)
                    return post;
                else   
                    throw new Error('Post not found');
            }catch(e){
                throw new Error(e);
            }
        }
    },
    Mutation:{
        async createPost(_, {body},context){
            const user = checkAuth(context);
            const newPost = new Post({
                body,
                user: user.id,
                username: user.username,
                createdAt: new Date().toISOString()
            }) 

            const post = await newPost.save();

            return post;
        },
        async deletePost(_, { postId }, context) {
            const user = checkAuth(context);
      
            try {
              const post = await Post.findById(postId);
              if (user.username === post.username) {
                await post.delete();
                return 'Post deleted successfully';
              } else {
                throw new AuthenticationError('Action not allowed');
              }
            } catch (err) {
              throw new Error(err);
            }
          },
          async likePost(_, { postId }, context) {
            const { username } = checkAuth(context);
      
            const post = await Post.findById(postId);
            if (post) {
              if (post.likes.find((like) => like.username === username)) {
                // Post already likes, unlike it
                post.likes = post.likes.filter((like) => like.username !== username);
              } else {
                // Not liked, like post
                post.likes.push({
                  username,
                  createdAt: new Date().toISOString()
                });
              }
      
              await post.save();
              return post;
            } else throw new UserInputError('Post not found');
          },
          
    }   
}