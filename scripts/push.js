const shell = require('shelljs');
const git = require('simple-git');
const path = require('path');
const dir = path.join(__dirname, '../');

// npm run push 'commit message'
git(dir).branch((err, res) => {
  console.log('current branch:', res.current);
  const curBranch = res.current;
  const commitMsg = process.argv[2] || 'update';
  shell.exec(`git add . && git commit -m "${commitMsg}" && git push origin ${curBranch}`);
});
