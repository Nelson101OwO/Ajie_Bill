const mysql=require('mysql');
const fs=require('fs');

Date.prototype.toAjieString=function(){//为时间对象添加自定义的方法
	let t=[,'-',,'-',,' ',,':',,':'];
	t[0]=this.getFullYear();
	t[2]=`0${this.getMonth()+1}`.slice(-2);
	t[4]=`0${this.getDate()}`.slice(-2);
	t[6]=`0${this.getHours()}`.slice(-2);
	t[8]=`0${this.getMinutes()}`.slice(-2);
	t[10]=`0${this.getSeconds()}`.slice(-2);
	return t.join('');
}

Date.prototype.ajieDifference=function(type){//时间对象返回时间差值？天？小时？分？秒
	let t=Date.now()-this.getTime();
	if(type)//若为无修饰模式
		return t;//直接返回毫秒
	let str=[,'天',,'小时',,'分钟',,'秒']
	str[6]=Math.floor((t/=1000)%60);
	str[4]=Math.floor((t/=60)%60);
	str[2]=Math.floor((t/=60)%24);
	str[0]=Math.floor(t/=24);
	return str.join('');
}


class Server{
	constructor(){
		this.conf=JSON.parse(fs.readFileSync('./conf.json'));//读取配置文件
		this.log=new Log();
		this.sql=new SQL(this.conf.sql);
		this.t=new Date();
	}
	async close(){
		this.log.done('主动关闭服务器','done');
		this.log.info(`本次服务器共运行了${this.t.ajieDifference()}`);
		await this.log.save();
		process.exit();
	}
}

class SQL{//数据库
	constructor(conf){
		this.pool=mysql.createPool(conf);
	}

	query(SQLstr,key,callback){//查询
		this.pool.getConnection((err,sql)=>{//从连接池中获取一个连接
			try{
				sql.query(SQLstr,key,(err,result)=>{//执行sql语句
					if(err)//若发生错误
						Log.log(`MySQL错误：${err.sql}`);
					else//若查询正常
						callback(result);//返回查询结果
				});
			}
			catch(err){
				Log.log(err);
			}
			sql.release();//释放当前连接，将其放回连接池
		});
	}

	ping(){
		let t=Date.now();
		this.pool.getConnection((err,sql)=>{
			sql.ping((err)=>{
				if(err)
					Log.err();
			});
		});
	}
}

class Log{//日志输出
	constructor(){
		this.interval=false;//初始化计时器为false
		this.data='';//初始化日志为空
		if(!fs.existsSync('./log'))//判断日志文件夹是否存在
			fs.mkdirSync('./log');//创建日志文件夹
		if(fs.existsSync(`./log/${new Date().toAjieString('log').slice(0,10)}.log`))
			this.data='\n\n\n\n';
	}

	done(str){//重要的完成信息
		this.log('done',str);
	}

	err(str){//错误
		this.log('err',str);
	}

	info(str){//普通的调试信息
		this.log('info',str);
	}

	log(level,str){
		let t=new Date();//获取当前时间
		let output=`[${t.toAjieString()}] [${level}] ${str}\n`;//将日志标准化
		let color;
		switch(level){//判断日志等级
			case 'info':color='\x1b[39m';break;
			case 'done':color='\x1b[32m';break;
			case 'warn':color='\x1b[33m';break;
			case 'err':color='\x1b[31m';break;
		}
		console.log(`${color}${output}\x1b[39m`);//将日志打印在控制台
		this.data+=output;//缓存标准化日志
		if(!this.interval)//若计时器为false
			this.interval=setInterval(()=>{//绑定计时器
				this.save();//保存日志
			},15000);
	}

	save(){
		return new Promise((resolve,rejects)=>{
			let data=this.data;//获取缓存的日志
			let t=new Date();
			this.data='';//清空缓存的日志
			let fd=fs.openSync(`./log/${t.toAjieString('log').slice(0,10)}.log`,'a')//打开日志文件
			fs.write(fd,data,(err)=>{
				if(err)
					console.log(err);
				resolve();
			});//写入日志文件
		});
	}

	warn(str){//警告
		this.log('warn',str);
	}
}

module.exports=Server;