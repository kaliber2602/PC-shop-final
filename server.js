const jsonServer = require('json-server');
const server = jsonServer.create();
const router = jsonServer.router('database.json');
const middlewares = jsonServer.defaults();

server.use(middlewares);
server.use(jsonServer.bodyParser);

server.post('/login', (req, res) => {
  const { user_name, password } = req.body;
  const users = router.db.get('users').value();
  const matchedAccount = users.find(
    (acc) => acc.user_name === user_name && acc.password === password
  );

  if (matchedAccount) {
    res.json({ success: true, admin: matchedAccount.admin, id: matchedAccount.id });
  } else {
    res.status(401).json({ success: false, message: "Invalid credentials" });
  }
});

server.use(router);
server.listen(3000, () => {
  console.log('JSON Server is running on port 3000');
});