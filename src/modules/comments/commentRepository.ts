import { PostComment, PostModel } from "../posts/postModel";

export const addComment = async (id: string, values: PostComment) => {
  const post = await PostModel.findById(id);
  post.comments.push({
    userId: values.userId,
    userName: values.userName,
    comment: values.comment,
  });
  post.commentsCount += 1;
  await post.save();
  return post;
};
