const crypto = require('crypto');
const http = require('http');
const mask = '258EAFA5-E914-47DA-95CA-C5AB0DC85B11';

const context = {
  set body(msg) {
    this.send(msg);
  },
};

class WebSocket {
  constructor(socket) {
    this.state = 'OPEN';
    this.received = null;
    this.middleWare = [];
    this.context = Object.create(context);
    this.createContext();
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
   * 创建响应上下文
   *
   * @memberof WebSocket
   */
  createContext() {
    this.context.send = this.send.bind(this);
  }

  /**
   * 添加中间件
   *
   * @param {function} func
   * @memberof WebSocket
   */
  use(func) {
    if (typeof func !== 'function') throw new Error('middleware must be a function');
    this.middleWare.push(func);
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
    this.context.headers = headers;
    this.socket = socket;
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
    let received = this.received;

    if (!received) {
      received = this.parseFrame(data);
      if (received.opcode === 8) {
        this.close(new Error('client closed'));
        return;
      }
      this.received = received;
    } else {
      // 将新来的数据跟此前的数据合并
      received.payloadData = Buffer.concat([received.payloadData, data], received.payloadData.length + data.length);
      received.remains -= data.length;
    }

    if (received.remains <= 0) {
      received = this.decodeData(this.received);
      this.context.state = received;
      this.middleWare.forEach(fn => fn(this.context));
      this.received = null;
    }
  }

  /**
   * 解析数据帧
   *
   * @param {Buffer} data
   * @returns {Object}
   * @memberof WebSocket
   */
  parseFrame(data) {
    const fin = data[0] >> 7; //获取fin位，因为是第一位，所以8位二进制往后推7位
    const opcode = data[0] & 0b00001111; //获取第一个字节的opcode位，与00001111进行与运算
    const masked = data[1] >> 7; //获取masked位，因为是第一位，所以8位二进制往后推7位
    let payloadLength = data[1] & 0b01111111; //获取数据长度，与01111111进行与运算
    let dataIndex = 2; //数据索引，因为第一个字节和第二个字节肯定不为数据，所以初始值为2
    let maskingKey,
      payloadData,
      remains = 0;

    //如果为126，则后面16位长的数据为数据长度，如果为127，则后面64位长的数据为数据长度
    if (payloadLength == 126) {
      dataIndex += 2;
      payloadLength = data.readUInt16BE(2);
    } else if (payloadLength == 127) {
      dataIndex += 8;
      payloadLength = data.readUInt32BE(2) + data.readUInt32BE(6);
    }

    //如果有掩码，则获取32位的二进制masking key，同时更新index
    if (masked) {
      maskingKey = data.slice(dataIndex, dataIndex + 4);
      dataIndex += 4;
    }

    // 解析出来的数据
    payloadData = data.slice(dataIndex, dataIndex + payloadLength);

    // 剩余字节数
    remains = dataIndex + payloadLength - data.length;

    return {
      fin,
      opcode,
      masked,
      maskingKey,
      remains,
      payloadData,
    };
  }

  /**
   * 解码数据
   *
   * @param {Buffer} received
   * @returns
   * @memberof WebSocket
   */
  decodeData(received) {
    const {payloadData, maskingKey} = received;
    let result = null;

    if (received.maskingKey) {
      result = new Buffer(payloadData.length);
      for (let i = 0; i < payloadData.length; i++) {
        //对每个字节进行异或运算，masked是4个字节，所以%4
        result[i] = payloadData[i] ^ maskingKey[i % 4];
      }
    }

    result = (result || payloadData).toString();
    return result;
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

  close(msg) {
    this.send(msg);
  }
}

const websocket = new WebSocket();
websocket.use(ctx => {
  console.log(ctx.state, ctx.headers);
  ctx.body = '1333';
});
websocket.listen(3000);
