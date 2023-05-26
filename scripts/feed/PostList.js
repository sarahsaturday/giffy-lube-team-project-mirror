// Import the necessary functions from '../data/TransientState.js'
import { fetchLikes, fetchPosts, fetchUsers, setLike, saveLike, getCurrentUser } from '../data/TransientState.js';
import { PostInteraction } from './PostInteraction.js';

// declare and export PostList function
export const PostList = async () => {
  // retrieve posts, likes, and users
  const posts = await fetchPosts();
  const likes = await fetchLikes();
  const users = await fetchUsers();

  // retrieve the current user
  const userId = getCurrentUser();

  // generate HTML for each post
  const htmlStrings = posts.map((post) => {
    // extract necessary data from the post object using destructuring
    const { postId, userId: postUserId, title, description, imageUrl, year } = post;

    // retrieve the user who made the post
    const user = users.find((user) => user.userId === postUserId);
    const userName = user ? user.name : 'Unknown User';

    const postLikes = likes.filter((like) => like.postId === postId);
    const likesCount = postLikes.length;

    // check if the current user has already liked this post
    const userLiked = likes.some((like) => like.userId === userId && like.postId === postId);

    // generate HTML for the Post component and interactions
    const postHtml = `
      <div class="post">
        <div class="post-content">
          <h2>${title}</h2>
          <p>${description}</p>
          <img src="${imageUrl}" alt="Post Image" />
          <p>Year: ${year}</p>
        </div>
        <div class="post-interactions">
          <div class="user">${userName}</div>
          <div class="likes">Likes: ${likesCount}</div>
          ${PostInteraction(postId)}
        </div>
      </div>
    `;

    return postHtml;
  });

  // combine HTML strings for all posts
  const resultString = htmlStrings.join('');

  // handle favorite button click event
  const handleFavoriteButtonClick = (event) => {
    if (event.target.classList.contains('favorite-button')) {
      const postId = event.target.dataset.postId;
      const userId = getCurrentUser();
      const likeObject = { userId, postId };

      setLike(likeObject);
      saveLike();
    }
  };

  document.addEventListener('click', handleFavoriteButtonClick);

  return resultString;
};
