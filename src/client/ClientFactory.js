module.exports = (id, nick, type, client) => {
  return {
    id: id,
    nick: nick,
    type: type,
    authenticated: false,
    details: {
      origin: null,
      ip: null,
      agent: null
    },
    sender: client,
  };
}
