module.exports = (id, type, ip, origin, agent, sender) => {
  return {
    id: id,
    nick: "",
    type: type,
    authenticated: false,
    details: {
      origin: origin,
      ip: ip,
      agent: agent
    },
    sender: sender,
  };
}
