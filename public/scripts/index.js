/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
// Show an object on the screen.
function showObject(obj) {
  const pre = document.getElementById('response');
  const preParent = pre.parentElement;
  pre.innerText = JSON.stringify(obj, null, 4);
  preParent.classList.add('flashing');
  setTimeout(() => {
    preParent.classList.remove('flashing');
  }, 300);
}

function showResponse(response) {
  response.json().then(data => {
    showObject({
      data,
      status: response.status,
      statusText: response.statusText
    });
  });
}

/**
 * IT IS UNLIKELY THAT YOU WILL WANT TO EDIT THE CODE ABOVE.
 * EDIT THE CODE BELOW TO SEND REQUESTS TO YOUR API.
 *
 * Native browser Fetch API documentation to fetch resources: https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API
 */

// Map form (by id) to the function that should be called on submit
const formsAndHandlers = {
  'create-user': createUser,
  'delete-user': deleteUser,
  'change-username': changeUsername,
  'change-password': changePassword,
  'sign-in': signIn,
  'sign-out': signOut,
  'view-all-freets': viewAllFreets,
  'view-freets-by-author': viewFreetsByAuthor,
  'create-freet': createFreet,
  'edit-freet': editFreet,
  'delete-freet': deleteFreet,
  'get-quickaccess': getQuickAccess,
  'edit-quickaccess': editQuickAccess,
  'get-followings': getFollowings,
  'follow-user': follow,
  'unfollow-user': unfollow,
  'count-followers': countFollowers,
  'get-following-freets': getFollowingFreets,
  'get-friends': getFriends,
  'get-friends-of': getFriends,
  unfriend,
  'get-friend-requests': getFriendRequests,
  'request-friend': requestFriend,
  'withdraw-request': withdrawRequest,
  'respond-request': respondRequest,
  'vote-thing': voteThing,
  'unvote-thing': unvoteThing,
  'my-votes': myVotes,
  'start-break': startBreak,
  'end-break': endBreak,
  'get-comments': getComments,
  'create-comment': createComment,
  'edit-comment': editComment,
  'delete-comment': deleteComment
};

// Attach handlers to forms
function init() {
  Object.entries(formsAndHandlers).forEach(([formID, handler]) => {
    const form = document.getElementById(formID);
    form.onsubmit = e => {
      e.preventDefault();
      const formData = new FormData(form);
      handler(Object.fromEntries(formData.entries()));
      return false; // Don't reload page
    };
  });
}

// Attach handlers once DOM is ready
window.onload = init;
