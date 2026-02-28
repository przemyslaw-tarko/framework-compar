function uniqueEmail(prefix = 'user') {
  const ts = Date.now();
  const rand = Math.floor(Math.random() * 100000);
  return `${prefix}_${ts}_${rand}@example.test`;
}

function uniqueUsername(prefix = 'user') {
  const ts = Date.now();
  const rand = Math.floor(Math.random() * 100000);
  return `${prefix}_${ts}_${rand}`;
}

module.exports = {
  uniqueEmail,
  uniqueUsername
};
