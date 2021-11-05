const Koa=require('koa');
const ssl=require('koa-sslify').default;
const Lib=require('./lib/lib.js');

const lib=new Lib();
const server=new Koa();

server.use(async(ctx,next)=>{
	ctx.body='server is running';
});

server.listen(lib.conf.app.port);
lib.log.done(`服务启动，监听${lib.conf.app.port}端口`)

process.on('SIGINT',async()=>{//监听程序退出事件
	lib.close();
});