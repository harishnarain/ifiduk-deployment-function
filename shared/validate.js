const subscriptionName = (name) => {
  const nameCheck = /^([a-z][a-z0-9]*(?:-[a-z0-9]+)*){5,15}$/;
  return nameCheck.test(name.toLowerCase());
};

module.exports = { subscriptionName };
