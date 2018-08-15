let server = require('http').createServer();

const ProcessController = require('./ProcessController.js')();

const MONGODB_CONF_PATH = "C:/Programs/mongod/conf/";

var processes = [
    {name: 'mongod_rs1', command: "mongod", args: ["--config", MONGODB_CONF_PATH + "mongod_rs1.conf"], pid: null, child_process: null},
    {name: 'mongod_rs2', command: "mongod", args: ["--config", MONGODB_CONF_PATH + "mongod_rs2.conf"], pid: null, child_process: null},
    {name: 'mongod_rs3', command: "mongod", args: ["--config", MONGODB_CONF_PATH + "mongod_rs3.conf"], pid: null, child_process: null}
];

function startMongoDb(cb){
    ProcessController.run(processes, "processes.inf" ).then((resp)=>{
        cb('The processes are started');
    }).catch((resp)=>{
        cb(resp)
    });
}

function stopMongoDb(){
    for(let i=0; i<processes.length; i++){
        if(processes[i].pid){
            ProcessController.killProcess(processes[i].pid);
            processes[i].pid = null;
        }
    }
}


startMongoDb((resp)=>{
    console.log(resp);
});


server.listen(3000);