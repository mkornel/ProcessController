module.exports = function (processes) {

    const exec = require('child_process').exec;
    const spawn = require('child_process').spawn;
    const process = require('process');
    const fs = require('fs');
    const isProcessRunning = require('is-running');

    function getPidsFromFile(file, cb) {
        fs.readFile(file, { encoding: 'utf-8' }, function (err, data) {
            if (err) {
                cb({ success: false, err: err });
            }

            var pids = [];

            if (data) {
                if (data != "") {
                    var lines = data.split("\n");

                    for (let i = 0; i < lines.length; i++) {
                        let name = lines[i].split(":")[0];
                        let pid = lines[i].split(":")[1];
                        pids.push({ name: name, pid: pid });
                    }

                    cb({ success: true, pids: pids });
                }
                cb({ success: false, err: { code: "EMPTY" } });
            }
            else {
                cb({ success: false, err: { code: "ENOENT" } });
            }

        });
    }

    function savePidsToFile(processes, file) {

        var data = "";

        for (let i = 0; i < processes.length; i++) {
            data += processes[i].name + ":" + processes[i].pid;
            if (i < (processes.length - 1)) {
                data += "\n";
            }
        }

        fs.writeFile(file, data, function (err) {
            if (err) {
                console.log(err);
            }
        });
    }

    function killProcess(pid) {
        if (isProcessRunning(pid)) {
            process.kill(pid);
        }
    }

    function setPids(processes, pids) {
        for (let i = 0; i < pids.length; i++) {
            for (let j = 0; j < processes.length; j++) {
                if (pids[i].name == processes[j].name) {
                    processes[j].pid = pids[i].pid;
                }
            }
        }
    }

    function startProcesses(processes) {
        for (let i = 0; i < processes.length; i++) {
            if (!isProcessRunning(processes[i].pid)) {
                let child_process = spawn(processes[i].command, processes[i].args, { stdio: 'inherit' });
                child_process.on('error', function(err) {
                    console.log(err);
                });
                processes[i].child_process = child_process;
                processes[i].pid = child_process.pid;
            }
        }

        return processes;
    }

    function run(processes, file) {

        return new Promise((resolve, reject) => {

            getPidsFromFile(file, (resp) => {

                if (resp.success) {
                    setPids(processes, resp.pids);
                    startProcesses(processes);
                    savePidsToFile(processes, file);
                    resolve({ success: true, processes: processes });
                }
                else {
                    if (resp.err.code == "ENOENT" || resp.err.code == "EMPTY") {
                        startProcesses(processes);
                        savePidsToFile(processes, file);
                        resolve({ success: true, processes: processes });
                    }
                    else {
                        console.log(resp.err);
                        reject({ success: false, error: resp.err });
                    }

                }

            });

        });


    }

    return {
        run: function (processes, file) {
            return new Promise((resolve, reject) => {
                run(processes, file).then((resp) => {
                    resolve(resp);
                }).catch((err) => {
                    resolve(err);
                });
            });
        },
        killProcess: function (pid) {
            killProcess(pid);
        }
    }

};