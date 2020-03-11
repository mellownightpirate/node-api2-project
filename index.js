const server = require("./apis/server");

const PORT = 3333

server.listen(PORT, () => {
  console.log(`Server Running on ${PORT}`);
});