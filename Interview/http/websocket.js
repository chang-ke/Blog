const crypto = require('crypto');
const http = require('http');
const mask = '258EAFA5-E914-47DA-95CA-C5AB0DC85B11';

class WebSocket {
  constructor(socket) {
    this.state = 'OPEN';
  }
  /**
   * 设置socket实例
   *
   * @param {Socket} socket
   * @memberof WebSocket
   */
  setSocket(socket) {
    this.socket = socket;
  }
  /**
   * 监听端口
   *
   * @param {number} port
   * @memberof WebSocket
   */
  listen(port) {
    const httpServer = http.createServer(this.callback);
    httpServer.on('upgrade', this.upgrade.bind(this)).listen(port);
  }
  /**
   * http服务回调
   *
   * @param {object} request
   * @param {object} response
   * @memberof WebSocket
   */
  callback(request, response) {
    response.writeHead(403, {'content-type': 'text/plain'});
    response.end('Invalid WebSocket connection!');
  }
  /**
   * 处理协议升级请求
   *
   * @param {object} response
   * @param {object} socket
   * @param {Buffer} upgradeHead
   * @memberof WebSocket
   */
  upgrade(response, socket, upgradeHead) {
    const {headers} = response;
    if (headers.upgrade !== 'websocket') throw new Error('Invalid connection');
    this.setSocket(socket);
    const key = crypto
      .createHash('sha1')
      .update(headers['sec-websocket-key'] + mask)
      .digest('base64');
    const head = [
      'HTTP:1.1 101 Switching Protocols',
      'Upgrade: websocket',
      'Connection: Upgrade',
      `Sec-WebSocket-Accept: ${key}`,
      `Sec-WebSocket-Version: ${headers['sec-websocket-version']}`,
      '\r\n',
    ];
    socket.on('data', data => {
      this.handleRequest(data);
    });
    socket.setNoDelay(true);
    socket.write(head.join('\r\n'), 'utf-8');
  }
  /**
   * 处理请求
   *
   * @param {Buffer} data
   * @memberof WebSocket
   */
  handleRequest(data) {
    console.log(data.slice(1, data.length - 1));
    this.send('2122');
  }
  /**
   * 发送数据
   *
   * @param {string} message
   * @returns
   * @memberof WebSocket
   */
  send(message) {
    if (this.state !== 'OPEN') return;
    const msg = message.toString();
    let length = Buffer.byteLength(msg);
    let index = 2 + (length > 65535 ? 8 : length > 125 ? 2 : 0);
    const buffer = new Buffer(index + length);
    // 第一个字节，fin位为1，opcode为1
    buffer[0] = 129;
    if (length > 65535) {
      buffer[1] = 127;
      buffer.writeUInt32BE(0, 2);
      buffer.writeUInt32BE(length, 6);
    } else if (length > 125) {
      buffer[1] = 126;
      // 长度超过125就由2个字节表示
      buffer.writeUInt32BE(length, 2);
    } else {
      buffer[1] = length;
    }
    buffer.write(msg, index);
    this.socket.write(buffer);
  }
}

new WebSocket().listen(3000);

/**
 * 加上首尾标志位
 *
 * @param {object} data
 * @returns
 */
function wrapData(data) {
  const dataStr = data.toString();
  const len = Buffer.byteLength(dataStr) + 2;
  const buff = new Buffer(len);
  buff[0] = 0x00; //首尾加上数据标志
  buff.write(dataStr, 1);
  buff[len - 1] = 0xff;
  return buff;
}
