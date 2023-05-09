// This fuction is automatically exported, and can be called upon to ascribe a random id to a given element. //

module.exports = () =>
  Math.floor((1 + Math.random()) * 0x10000)
    .toString(16)
    .substring(1);