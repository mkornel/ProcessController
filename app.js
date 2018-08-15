const ProcessController = require('./controllers/ProcessController.js')();


var processes = [
    {name: 'nodejs', command: "node", args: [__dirname + "/applications/app1.js"], pid: null, child_process: null},
    {name: 'nodejs', command: "node", args: [__dirname + "/applications/app2.js"], pid: null, child_process: null},
    {name: 'nodejs', command: "node", args: [__dirname + "/applications/app3.js"], pid: null, child_process: null},
];

function startProcesses(cb){
    ProcessController.run(processes, "processes.inf" ).then((resp)=>{
        cb('The processes are started');
    }).catch((resp)=>{
        cb(resp)
    });
}

function stopProcesses(){
    for(let i=0; i<processes.length; i++){
        if(processes[i].pid){
            ProcessController.killProcess(processes[i].pid);
            processes[i].pid = null;
        }
    }
}


startProcesses((resp)=>{
    console.log(resp);
});